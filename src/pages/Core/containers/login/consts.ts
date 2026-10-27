import {FormRule} from 'antd';

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
