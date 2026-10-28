import {CardProps, TagProps} from 'antd';

import {HealthLevelEnum} from '__types/HealthLevelEnum';
import {RECENT_WINDOW_SEC} from '__utils/consts';

import {TagDto} from '../../types';

const {
    Ok,
    Warn,
    Bad,
    Off,
} = HealthLevelEnum;

export const STATUS_WORDINGS = {
    [Ok]: 'В эфире',
    [Warn]: 'Есть потери',
    [Bad]: 'Теряет кадры',
    [Off]: 'Не в эфире',
};

export const RECONNECTING_WORDING = 'Переподключение';

export const HINTS = {
    dropped: 'Кадры, которые OBS выбросил, потому что сеть не успевала их отправить (Dropped Frames (Network) в окне Stats)',
    recent: `Сколько кадров потеряно за последние ${RECENT_WINDOW_SEC} с`,
    congestion: 'Насколько забит буфер отправки: 0% — всё уходит сразу, чем выше, тем хуже сеть успевает',
};

export const GROUP_SEPARATOR = ' ';

export const CARD_STYLES: CardProps['styles'] = {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        whiteSpace: 'normal',
    },
    body: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
};

export const MAIN_TAG: TagDto = {
    text: 'Основной',
    hint: 'Площадка из Settings → Stream',
    color: 'blue',
};

export const PLUGIN_TAG: TagDto = {
    text: 'Плагин',
};

export const HEALTH_TAGS: Record<HealthLevelEnum, Pick<TagProps, 'color' | 'variant'>> = {
    [Ok]: {color: 'success', variant: 'solid'},
    [Warn]: {color: 'warning', variant: 'solid'},
    [Bad]: {color: 'error', variant: 'solid'},
    [Off]: {color: 'default', variant: 'filled'},
};
