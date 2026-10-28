import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';
import {CONNECTING_WORDING} from '__utils/consts';

import {ConnectionBadgeDto} from './types';

const {
    Connecting,
    Closed,
    NeedPassword,
    WrongPassword,
    Identified,
} = ConnectionStatusEnum;

export const CONNECTION_BADGES: Record<ConnectionStatusEnum, ConnectionBadgeDto> = {
    [Connecting]: {status: 'processing', text: CONNECTING_WORDING},
    [Closed]: {status: 'error', text: 'Нет связи с OBS'},
    [NeedPassword]: {status: 'warning', text: 'Нужен пароль'},
    [WrongPassword]: {status: 'warning', text: 'Нужен пароль'},
    [Identified]: {status: 'success', text: 'OBS подключён'},
};
