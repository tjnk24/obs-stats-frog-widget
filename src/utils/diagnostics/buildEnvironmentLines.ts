import i18n from 'i18next';

import {connectionObsVersionSelector, connectionStatusSelector} from '__selectors/connectionSelectors';
import {getStore} from '__store';

export const buildEnvironmentLines = () => {
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
    ];
};
