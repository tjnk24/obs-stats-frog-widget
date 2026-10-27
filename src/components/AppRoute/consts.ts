import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';

const {
    Connecting,
    NeedPassword,
    WrongPassword,
} = ConnectionStatusEnum;

export const PASSWORD_STATUSES = [NeedPassword, WrongPassword];

// the login page also stays while the entered password is being checked
export const PASSWORD_PAGE_STATUSES = [...PASSWORD_STATUSES, Connecting];
