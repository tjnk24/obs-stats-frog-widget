import {ButtonProps, TooltipProps} from 'antd';
import type {Nullable} from 'infrastructure/common';
import {ReactNode} from 'react';

interface OwnProps {
    tooltipProps: Nullable<TooltipProps>;
    buttonProps: ButtonProps;
    withSpinner: boolean;
    children: ReactNode;
}

export type Props = OwnProps;
