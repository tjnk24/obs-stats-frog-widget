import {BadgeProps} from 'antd';
import type {ParseKeys} from 'i18next';

export type ConnectionBadgeDto = {
    status: BadgeProps['status'];
    textKey: ParseKeys;
};
