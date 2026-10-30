import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';

const {
    Connecting,
    Closed,
    NeedPassword,
    WrongPassword,
} = ConnectionStatusEnum;

export const PASSWORD_STATUSES = [NeedPassword, WrongPassword];

export const PASSWORD_PAGE_STATUSES = [...PASSWORD_STATUSES, Connecting, Closed];
