import {ButtonProps, TooltipProps} from 'antd';
import {ReactNode} from 'react';

import {EnhancedPopconfirmProps} from '../popconfirm-button/types';

interface OwnProps {
    tooltipProps?: TooltipProps;
    buttonProps?: ButtonProps;
    popconfirmProps?: EnhancedPopconfirmProps;
    withSpinner?: boolean;
    children?: ReactNode;
}

export type Props = OwnProps;
