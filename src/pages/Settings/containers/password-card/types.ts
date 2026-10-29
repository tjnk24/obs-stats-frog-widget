import {AlertProps} from 'antd';
import type {ParseKeys} from 'i18next';

export type PasswordFormDto = {
    password: string;
};

export type ResultAlertDto = {
    type: AlertProps['type'];
    titleKey: ParseKeys;
};
