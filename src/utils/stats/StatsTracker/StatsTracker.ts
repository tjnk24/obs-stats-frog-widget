import {GeneralViewDto} from '__types/GeneralViewDto';
import {ObsOutputStatusDto} from '__types/ObsOutputStatusDto';
import {ObsRequestTypeEnum} from '__types/ObsRequestTypeEnum';
import {ObsStatsDto} from '__types/ObsStatsDto';
import {OutputStateDto} from '__types/OutputStateDto';
import {OutputViewDto} from '__types/OutputViewDto';
import {RequestResultPairDto} from '__types/RequestResultPairDto';
import {StatsViewDto} from '__types/StatsViewDto';
import {StreamTargetDto} from '__types/StreamTargetDto';
import {
    GRAPH_SPAN_SEC,
    OFF_OUTPUT_VIEW,
    RECENT_WINDOW_SEC,
} from '__utils/consts';
import {findResultData} from '__utils/requests/findResultData';
import {isRequestOfType} from '__utils/requests/isRequestOfType';

import {getHealthLevel} from '../getHealthLevel';
import {RecentCounter} from '../RecentCounter';

import {createOutputState} from './createOutputState';
import {isStatusRequestOf} from './isStatusRequestOf';

const {GetStats} = ObsRequestTypeEnum;

export class StatsTracker {
    private outputs = new Map<string, OutputStateDto>();
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

        this.outputs.forEach((_output, key) => {
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

    private resetOutput(output: OutputStateDto) {
        output.previous = null;
        output.graph = [];
        output.recent.reset();
    }

    private ingestOutput(output: OutputStateDto, status: ObsOutputStatusDto | null, now: number): OutputViewDto {
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
