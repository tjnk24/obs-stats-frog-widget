import {PLATFORM_RULES, UNKNOWN_PLATFORM_COLOR} from './consts';
import {getServerHost} from './getServerHost';
import {PlatformDto} from './types';

export const detectPlatform = (service: string, server: string, fallbackTitle: string): PlatformDto => {
    const host = getServerHost(server);

    const rule = PLATFORM_RULES.find(({services, hosts}) => (
        (service && services.test(service)) || (host && hosts.some(pattern => pattern.test(host)))
    ));

    if (rule) {
        return {title: rule.title, color: rule.color, isKnown: true};
    }

    return {title: service || host || fallbackTitle, color: UNKNOWN_PLATFORM_COLOR, isKnown: false};
};
