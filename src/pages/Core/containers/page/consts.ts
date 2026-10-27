import {RECONNECT_INTERVAL_MS} from '__utils/consts';
import {HealthLevelEnum, OutputViewDto} from '__utils/types';

export const CONNECTING_WORDING = 'Подключение к OBS...';
export const CONNECTED_WORDING = 'OBS подключён';
export const CHANGE_PASSWORD_WORDING = 'Сменить пароль';
export const ENTER_PASSWORD_WORDING = 'Введите пароль obs-websocket.';
export const WRONG_PASSWORD_WORDING = 'Неверный пароль. Введите пароль obs-websocket ещё раз.';
export const MAIN_FALLBACK_TITLE = 'Трансляция';
export const UNKNOWN_PLATFORM_TITLE = 'Неизвестная площадка';

export const getClosedWording = (port: number) => (
    `Нет связи с OBS (obs-websocket, порт ${port}). Повтор через ${RECONNECT_INTERVAL_MS / 1000} с...`
);

export const OFF_OUTPUT_VIEW: OutputViewDto = {
    isActive: false,
    isReconnecting: false,
    level: HealthLevelEnum.Off,
    kbps: null,
    timecode: '',
    dropped: 0,
    total: 0,
    recentDropped: 0,
    recentTotal: 0,
    congestion: 0,
    graph: [],
};
