import countBy from 'lodash/countBy';

import {NoteDto} from '__types/NoteDto';
import {ObsOutputListItemDto} from '__types/ObsOutputListItemDto';
import {ObsProfileParameterDto} from '__types/ObsProfileParameterDto';
import {ObsRequestTypeEnum} from '__types/ObsRequestTypeEnum';
import {ObsStreamServiceDto} from '__types/ObsStreamServiceDto';
import {OutputOriginEnum} from '__types/OutputOriginEnum';
import {RequestResultPairDto} from '__types/RequestResultPairDto';
import {StreamTargetDto} from '__types/StreamTargetDto';
import {
    BRIDGE_SCRIPT_NAME,
    MAIN_FALLBACK_TITLE,
    MAIN_OUTPUT_NAMES,
    MAIN_TARGET_KEY,
    PLUGIN_OUTPUT_NAMES,
    UNKNOWN_PLATFORM_TITLE,
} from '__utils/consts';
import {findResultData} from '__utils/requests/findResultData';
import {isRequestOfType} from '__utils/requests/isRequestOfType';

import {detectPlatform} from '../detectPlatform';

import {parseBridgeData} from './parseBridgeData';

const {GetStreamServiceSettings, GetOutputList, GetProfileParameter} = ObsRequestTypeEnum;
const {Main, Plugin} = OutputOriginEnum;

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
            platform: detectPlatform(null, bridgeServer, UNKNOWN_PLATFORM_TITLE),
            notes,
        };
    });

    return [main, ...plugins];
};
