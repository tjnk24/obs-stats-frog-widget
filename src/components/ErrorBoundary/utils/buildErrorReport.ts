import i18n from 'i18next';
import type {Nullable} from 'infrastructure/common';

import {connectionObsVersionSelector, connectionStatusSelector} from '__selectors/connectionSelectors';
import {getStore} from '__store';

export const buildErrorReport = (error: Error, componentStack: Nullable<string> | undefined) => {
    const state = getStore();
    const obsVersion = connectionObsVersionSelector(state);

    return [
        `Widget: obs-stats-frog-widget ${process.env.APP_VERSION}`,
        `OBS: ${obsVersion?.obsVersion ?? 'unknown'}`,
        `obs-websocket: ${obsVersion?.obsWebSocketVersion ?? 'unknown'}`,
        `Platform: ${obsVersion?.platformDescription ?? 'unknown'}`,
        `Connection: ${connectionStatusSelector(state)}`,
        `Language: ${i18n.language}`,
        `Browser: ${navigator.userAgent}`,
        `Page: ${window.location.hash || '#/'}`,
        `Time: ${new Date().toISOString()}`,
        '',
        error.stack ?? `${error.name}: ${error.message}`,
        '',
        'Component stack:',
        componentStack?.trim() ?? '',
    ].join('\n');
};
