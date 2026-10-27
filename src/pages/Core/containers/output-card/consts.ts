import {CardProps} from 'antd';

import {RECENT_WINDOW_SEC} from '__utils/consts';
import {HealthLevelEnum} from '__utils/types';

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

// thousands split by a no-break space, as formatNumber does
export const GROUP_SEPARATOR = ' ';

// the platform and its tag wrap onto two lines in a narrow dock instead of being cut off
export const CARD_STYLES: CardProps['styles'] = {
    title: {
        whiteSpace: 'normal',
    },
};
