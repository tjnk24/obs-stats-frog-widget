import {FormRule} from 'antd';

import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';
import {CONNECTING_WORDING} from '__utils/consts';

import {LoginFormDto} from './types';

export const PASSWORD_PLACEHOLDER = 'Пароль obs-websocket';

export const CONNECT_INFO_HINT = 'Пароль: Tools → WebSocket Server Settings → Show Connect Info → Server Password.';

export const INITIAL_VALUES: Partial<LoginFormDto> = {
    isRemember: true,
};

export const PASSWORD_RULES: FormRule[] = [
    {
        required: true,
        message: 'Введите пароль',
    },
];

const {
    Connecting,
    NeedPassword,
    WrongPassword,
} = ConnectionStatusEnum;

export const LOGIN_MESSAGES: Partial<Record<ConnectionStatusEnum, string>> = {
    [Connecting]: CONNECTING_WORDING,
    [NeedPassword]: 'Введите пароль obs-websocket.',
    [WrongPassword]: 'Неверный пароль. Введите пароль obs-websocket ещё раз.',
};
