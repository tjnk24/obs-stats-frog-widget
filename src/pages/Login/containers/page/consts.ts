import {FormRule} from 'antd';

import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';
import {CONNECTING_WORDING} from '__utils/consts';

export const PASSWORD_RULES: FormRule[] = [
    {
        required: true,
        message: 'Введите пароль',
    },
];

const {
    Connecting,
    Closed,
    WrongPassword,
} = ConnectionStatusEnum;

export const LOGIN_MESSAGES: Partial<Record<ConnectionStatusEnum, string>> = {
    [Connecting]: CONNECTING_WORDING,
    [Closed]: 'OBS не отвечает на этом порту. Проверьте, что OBS запущен, а порт указан верно.',
    [WrongPassword]: 'Неверный пароль. Введите пароль obs-websocket ещё раз.',
};

export const ERROR_STATUSES = [Closed, WrongPassword];
