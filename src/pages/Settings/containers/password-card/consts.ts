import {PasswordChangeResultEnum} from '__types/connection/PasswordChangeResultEnum';

import {ResultAlertDto} from './types';

const {
    Accepted,
    Rejected,
    NoConnection,
} = PasswordChangeResultEnum;

export const RESULT_ALERTS: Record<PasswordChangeResultEnum, ResultAlertDto> = {
    [Accepted]: {
        type: 'success',
        titleKey: 'settings.passwordAccepted',
    },
    [Rejected]: {
        type: 'error',
        titleKey: 'settings.passwordRejected',
    },
    [NoConnection]: {
        type: 'warning',
        titleKey: 'settings.passwordNoConnection',
    },
};
