import {statsHardwareSelector, statsTargetsSelector} from '__selectors/statsSelectors';
import {getStore} from '__store';
import {BYTES_IN_GIGABYTE} from '__utils/consts';

import {buildEnvironmentLines} from './buildEnvironmentLines';
import {describeTarget} from './describeTarget';

export const buildDiagnostics = () => {
    const state = getStore();
    const {gpu, systemMemory} = statsHardwareSelector(state);
    const targets = statsTargetsSelector(state);
    const isBridgeActive = gpu !== null || systemMemory !== null;

    return [
        ...buildEnvironmentLines(),
        `Bridge script: ${isBridgeActive ? 'active' : 'not detected'}`,
        `GPU: ${gpu?.name ?? 'unknown'}`,
        `System memory: ${systemMemory ? `${(systemMemory.total / BYTES_IN_GIGABYTE).toFixed(1)} GB` : 'unknown'}`,
        `Time: ${new Date().toISOString()}`,
        '',
        'Outputs:',
        ...(targets.length ? targets.map(describeTarget) : ['- none']),
    ].join('\n');
};
