import {BadgeProps} from 'antd';

export type NavItemDto = {
    label: string;
    value: string;
    goTo: () => void;
};

export type ConnectionBadgeDto = {
    status: BadgeProps['status'];
    text: string;
};
