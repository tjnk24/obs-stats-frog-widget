import countBy from 'lodash/countBy';

import {
    BRIDGE_SCRIPT_NAME,
    BRIDGE_STALE_SEC,
    MAIN_OUTPUT_NAMES,
    MAIN_TARGET_KEY,
    PLUGIN_OUTPUT_NAMES,
} from '__utils/consts';
import {detectPlatform} from '__utils/detectPlatform';
import {
    BridgeDataDto,
    NoteDto,
    ObsOutputListItemDto,
    ObsProfileParameterDto,
    ObsRequestTypeEnum,
    ObsStreamServiceDto,
    OutputOriginEnum,
    RequestResultPairDto,
    StreamTargetDto,
} from '__utils/types';

import {MAIN_FALLBACK_TITLE, UNKNOWN_PLATFORM_TITLE} from '../consts';

import {findResultData, isRequestOfType} from './findResultData';

const {GetStreamServiceSettings, GetOutputList, GetProfileParameter} = ObsRequestTypeEnum;
const {Main, Plugin} = OutputOriginEnum;

const parseBridgeData = (parameter: ObsProfileParameterDto | null): Map<string, string> | null => {
    try {
        const data = JSON.parse(parameter?.parameterValue) as BridgeDataDto;

        if ((Date.now() / 1000) - data.updated > BRIDGE_STALE_SEC) {
            return null;
        }

        return new Map(data.outputs.map(({name, server}) => [name, server]));
    } catch {
        return null;
    }
};

// Which cards to show: OBS's own stream output (platform from Settings -> Stream) and every other
// output that streams to a service, i.e. one a plugin created. A plugin output's server is only known
// from obs-stats-bridge.lua. Returns null when the batch had no discovery requests.
export const discoverTargets = (pairs: RequestResultPairDto[]): StreamTargetDto[] | null => {
    if (!pairs.some(({request}) => request.requestType === GetOutputList)) {
        return null;
    }

    const service = findResultData<ObsStreamServiceDto>(pairs, isRequestOfType(GetStreamServiceSettings));
    const outputs = findResultData<{outputs: ObsOutputListItemDto[]}>(pairs, isRequestOfType(GetOutputList))?.outputs || [];
    const bridge = parseBridgeData(findResultData<ObsProfileParameterDto>(pairs, isRequestOfType(GetProfileParameter)));

    const {service: serviceName, server} = service?.streamServiceSettings || {};

    const main: StreamTargetDto = {
        key: MAIN_TARGET_KEY,
        origin: Main,
        outputName: null,
        pluginName: null,
        platform: detectPlatform(serviceName, server, MAIN_FALLBACK_TITLE),
        notes: [],
    };

    const pluginOutputNames = outputs
        .filter(({outputName, outputFlags}) => outputFlags?.OBS_OUTPUT_SERVICE && !MAIN_OUTPUT_NAMES.includes(outputName))
        .map(({outputName}) => outputName);

    const counts = countBy(pluginOutputNames);

    const plugins = Object.keys(counts).sort().map((outputName): StreamTargetDto => {
        const pluginName = PLUGIN_OUTPUT_NAMES[outputName] || null;
        const bridgeServer = bridge?.get(outputName);
        const notes: NoteDto[] = [];

        if (!bridge) {
            notes.push({
                text: `Площадку покажет скрипт ${BRIDGE_SCRIPT_NAME} (Tools → Scripts)`,
                type: 'info',
            });
        }

        // obs-multi-rtmp names the outputs of all its targets alike, and obs-websocket finds outputs by name
        if (counts[outputName] > 1) {
            notes.push({
                text: `Выходов с именем «${outputName}»: ${counts[outputName]}, статистика только по одному`,
                type: 'warning',
            });
        }

        return {
            key: `plugin:${outputName}`,
            origin: Plugin,
            outputName,
            pluginName,
            // the plugin itself is named in the tag
            platform: detectPlatform(null, bridgeServer, UNKNOWN_PLATFORM_TITLE),
            notes,
        };
    });

    return [main, ...plugins];
};
