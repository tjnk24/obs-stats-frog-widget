import {TagProps} from 'antd';

import {HealthLevelEnum} from '__types/HealthLevelEnum';

import {PlatformMarkDto} from './types';

const {
    Ok,
    Warn,
    Bad,
    Off,
} = HealthLevelEnum;

export const PLATFORM_MARKS: Partial<Record<string, PlatformMarkDto>> = {
    'VK Video Live': {
        emoji: '💩',
        hintKey: 'stats.crappyPlatform',
    },
};

export const HEALTH_TAGS: Record<HealthLevelEnum, Pick<TagProps, 'color' | 'variant'>> = {
    [Ok]: {color: 'success', variant: 'solid'},
    [Warn]: {color: 'warning', variant: 'solid'},
    [Bad]: {color: 'error', variant: 'solid'},
    [Off]: {color: 'default', variant: 'filled'},
};
