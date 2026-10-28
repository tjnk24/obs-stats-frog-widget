import {AlertProps, FormRule} from 'antd';

import {PasswordChangeResultEnum} from '__types/PasswordChangeResultEnum';

export const PASSWORD_RULES: FormRule[] = [
    {
        required: true,
        message: 'Введите пароль',
    },
];

const {
    Accepted,
    Rejected,
    NoConnection,
} = PasswordChangeResultEnum;

export const RESULT_ALERTS: Record<PasswordChangeResultEnum, Pick<AlertProps, 'type' | 'title'>> = {
    [Accepted]: {
        type: 'success',
        title: 'Пароль сменён',
    },
    [Rejected]: {
        type: 'error',
        title: 'OBS не принял пароль, остался прежний',
    },
    [NoConnection]: {
        type: 'warning',
        title: 'Нет связи с OBS, пароль не сменён',
    },
};
