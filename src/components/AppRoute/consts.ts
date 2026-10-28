import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';

const {
    Connecting,
    Closed,
    NeedPassword,
    WrongPassword,
} = ConnectionStatusEnum;

export const PASSWORD_STATUSES = [NeedPassword, WrongPassword];

// the login page also stays while the entered port and password are checked, and when nothing answers on that port
export const PASSWORD_PAGE_STATUSES = [...PASSWORD_STATUSES, Connecting, Closed];
