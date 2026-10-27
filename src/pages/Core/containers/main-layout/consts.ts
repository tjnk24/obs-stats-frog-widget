import {ROUTES} from '__routes';
import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';
import {CONNECTING_WORDING} from '__utils/consts';
import {routerManager} from '__utils/infrastructure/routing/routeManager';

import {ConnectionBadgeDto, NavItemDto} from './types';

const {
    Connecting,
    Closed,
    NeedPassword,
    WrongPassword,
    Identified,
} = ConnectionStatusEnum;

export const NAV_ITEMS: NavItemDto[] = [
    {
        label: 'Статистика',
        value: ROUTES.STATS.INDEX,
        goTo: () => routerManager.goToStats(),
    },
    {
        label: 'Настройки',
        value: ROUTES.SETTINGS.INDEX,
        goTo: () => routerManager.goToSettings(),
    },
];

export const CONNECTION_BADGES: Record<ConnectionStatusEnum, ConnectionBadgeDto> = {
    [Connecting]: {status: 'processing', text: CONNECTING_WORDING},
    [Closed]: {status: 'error', text: 'Нет связи с OBS'},
    [NeedPassword]: {status: 'warning', text: 'Нужен пароль obs-websocket'},
    [WrongPassword]: {status: 'warning', text: 'Нужен пароль obs-websocket'},
    [Identified]: {status: 'success', text: 'OBS подключён'},
};
