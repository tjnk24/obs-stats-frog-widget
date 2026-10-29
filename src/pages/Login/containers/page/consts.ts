import type {ParseKeys} from 'i18next';

import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';

const {
    Connecting,
    Closed,
    WrongPassword,
} = ConnectionStatusEnum;

export const LOGIN_MESSAGES: Partial<Record<ConnectionStatusEnum, ParseKeys>> = {
    [Connecting]: 'connection.connecting',
    [Closed]: 'login.closed',
    [WrongPassword]: 'login.wrongPassword',
};

export const ERROR_STATUSES = [Closed, WrongPassword];
