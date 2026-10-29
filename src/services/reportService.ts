import i18n from 'i18next';
import type {Nullable} from 'infrastructure/common';

import {connectionObsVersionSelector, connectionStatusSelector} from '__selectors/connectionSelectors';
import {statsHardwareSelector, statsTargetsSelector} from '__selectors/statsSelectors';
import {getStore} from '__store';
import {OutputOriginEnum} from '__types/OutputOriginEnum';
import {StreamTargetDto} from '__types/StreamTargetDto';
import {BYTES_IN_GIGABYTE} from '__utils/consts';

class ReportService {
    buildDiagnostics = () => {
        const state = getStore();
        const {gpu, systemMemory} = statsHardwareSelector(state);
        const targets = statsTargetsSelector(state);
        const isBridgeActive = gpu !== null || systemMemory !== null;

        return [
            ...this.buildEnvironmentLines(),
            `Bridge script: ${isBridgeActive ? 'active' : 'not detected'}`,
            `GPU: ${gpu?.name ?? 'unknown'}`,
            `System memory: ${systemMemory ? `${(systemMemory.total / BYTES_IN_GIGABYTE).toFixed(1)} GB` : 'unknown'}`,
            `Time: ${new Date().toISOString()}`,
            '',
            'Outputs:',
            ...(targets.length ? targets.map(this.describeTarget) : ['- none']),
        ].join('\n');
    };

    buildErrorReport = (error: Error, componentStack: Nullable<string> | undefined) => [
        ...this.buildEnvironmentLines(),
        `Page: ${window.location.hash || '#/'}`,
        `Time: ${new Date().toISOString()}`,
        '',
        error.stack ?? `${error.name}: ${error.message}`,
        '',
        'Component stack:',
        componentStack?.trim() ?? '',
    ].join('\n');

    copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);

            return true;
        } catch {
            return false;
        }
    };

    private buildEnvironmentLines = () => {
        const state = getStore();
        const obsVersion = connectionObsVersionSelector(state);

        return [
            `Widget: obs-stats-widget ${process.env.APP_VERSION}`,
            `OBS: ${obsVersion?.obsVersion ?? 'unknown'}`,
            `obs-websocket: ${obsVersion?.obsWebSocketVersion ?? 'unknown'}`,
            `Platform: ${obsVersion?.platformDescription ?? 'unknown'}`,
            `Connection: ${connectionStatusSelector(state)}`,
            `Language: ${i18n.language}`,
            `Browser: ${navigator.userAgent}`,
        ];
    };

    private describeTarget = ({origin, outputName, pluginName, platform}: StreamTargetDto) => {
        if (origin === OutputOriginEnum.Main) {
            return `- ${platform.title}: main output`;
        }

        return `- ${platform.title}: plugin output "${outputName}"${pluginName ? ` (${pluginName})` : ''}`;
    };
}

export const reportService = new ReportService();
