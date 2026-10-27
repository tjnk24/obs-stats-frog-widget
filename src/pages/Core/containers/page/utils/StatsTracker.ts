import {GRAPH_SPAN_SEC, RECENT_WINDOW_SEC} from '__utils/consts';
import {RecentCounter} from '__utils/RecentCounter';
import {
    GeneralViewDto,
    GraphPointDto,
    ObsOutputStatusDto,
    ObsRequestDto,
    ObsRequestTypeEnum,
    ObsStatsDto,
    OutputViewDto,
    RequestResultPairDto,
    StatsViewDto,
    StreamTargetDto,
} from '__utils/types';

import {OFF_OUTPUT_VIEW} from '../consts';

import {findResultData, isRequestOfType} from './findResultData';
import {getHealthLevel} from './getHealthLevel';

const {GetStats, GetStreamStatus, GetOutputStatus} = ObsRequestTypeEnum;

type OutputState = {
    previous: {time: number; bytes: number} | null;
    graph: GraphPointDto[];
    recent: RecentCounter;
    view: OutputViewDto;
};

const createOutputState = (): OutputState => ({
    previous: null,
    graph: [],
    recent: new RecentCounter(RECENT_WINDOW_SEC),
    view: OFF_OUTPUT_VIEW,
});

const isStatusRequestOf = (outputName: string | null) => ({requestType, requestData}: ObsRequestDto) => (
    outputName === null
        ? requestType === GetStreamStatus
        : requestType === GetOutputStatus && requestData?.outputName === outputName
);

// Turns the raw counters of each poll into what the cards show: bitrate from the byte difference
// between polls, the bitrate history for the graph and the "last minute" deltas.
export class StatsTracker {
    private outputs = new Map<string, OutputState>();
    private readonly encoding = new RecentCounter(RECENT_WINDOW_SEC);
    private readonly rendering = new RecentCounter(RECENT_WINDOW_SEC);

    reset(): StatsViewDto {
        this.outputs.clear();
        this.encoding.reset();
        this.rendering.reset();

        return {outputs: {}, general: null, now: performance.now()};
    }

    ingest(targets: StreamTargetDto[], pairs: RequestResultPairDto[], now: number): StatsViewDto {
        const outputs: Record<string, OutputViewDto> = {};

        // forget outputs that are gone, e.g. after a profile change
        this.outputs.forEach((_, key) => {
            !targets.some(target => target.key === key) && this.outputs.delete(key);
        });

        targets.forEach(({key, outputName}) => {
            if (!this.outputs.has(key)) {
                this.outputs.set(key, createOutputState());
            }

            const output = this.outputs.get(key);
            const isStatusRequest = isStatusRequestOf(outputName);

            // an output found by this very batch has no status in it yet
            if (pairs.some(({request}) => isStatusRequest(request))) {
                // GetOutputStatus fails (code 600) when no output has this name
                output.view = this.ingestOutput(output, findResultData<ObsOutputStatusDto>(pairs, isStatusRequest), now);
            }

            outputs[key] = output.view;
        });

        return {
            outputs,
            general: this.ingestGeneral(findResultData<ObsStatsDto>(pairs, isRequestOfType(GetStats)), now),
            now,
        };
    }

    private resetOutput(output: OutputState) {
        output.previous = null;
        output.graph = [];
        output.recent.reset();
    }

    private ingestOutput(output: OutputState, status: ObsOutputStatusDto | null, now: number): OutputViewDto {
        if (!status?.outputActive) {
            this.resetOutput(output);

            return OFF_OUTPUT_VIEW;
        }

        const {
            outputBytes,
            outputSkippedFrames,
            outputTotalFrames,
        } = status;

        const {previous} = output;

        let kbps: number | null = null;

        if (previous && outputBytes >= previous.bytes && now > previous.time) {
            // bytes per millisecond * 8 = kilobits per second
            kbps = ((outputBytes - previous.bytes) * 8) / (now - previous.time);
        } else if (previous) {
            // the output restarted
            output.graph = [];
        }

        output.previous = {time: now, bytes: outputBytes};

        const graph = kbps === null ? output.graph : [...output.graph, {time: now, kbps}];

        output.graph = graph.filter(({time}) => time >= now - (GRAPH_SPAN_SEC * 1000));

        const recent = output.recent.add(now, outputSkippedFrames, outputTotalFrames);

        return {
            isActive: true,
            isReconnecting: status.outputReconnecting,
            level: getHealthLevel(recent.count, recent.total),
            kbps,
            timecode: status.outputTimecode,
            dropped: outputSkippedFrames,
            total: outputTotalFrames,
            recentDropped: recent.count,
            recentTotal: recent.total,
            congestion: status.outputCongestion,
            graph: output.graph,
        };
    }

    private ingestGeneral(stats: ObsStatsDto | null, now: number): GeneralViewDto | null {
        if (!stats) {
            this.encoding.reset();
            this.rendering.reset();

            return null;
        }

        const {
            outputSkippedFrames,
            outputTotalFrames,
            renderSkippedFrames,
            renderTotalFrames,
        } = stats;

        return {
            fps: stats.activeFps,
            frameTime: stats.averageFrameRenderTime,
            cpu: stats.cpuUsage,
            encoding: {
                skipped: outputSkippedFrames,
                total: outputTotalFrames,
                recentSkipped: this.encoding.add(now, outputSkippedFrames, outputTotalFrames).count,
            },
            rendering: {
                skipped: renderSkippedFrames,
                total: renderTotalFrames,
                recentSkipped: this.rendering.add(now, renderSkippedFrames, renderTotalFrames).count,
            },
        };
    }
}
