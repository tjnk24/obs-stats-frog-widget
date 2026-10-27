import {Popconfirm, PopconfirmProps} from 'antd';

import {useAsyncButtonClick} from '../../hooks/useAsyncButtonClick';
import TooltipButton from '../tooltip-button';

import {
    DEFAULT_CANCEL_TEXT,
    DEFAULT_OK_TEXT,
    DEFAULT_TITLE,
} from './consts';
import {Props} from './types';

const PopconfirmButton = ({
    buttonProps,
    popconfirmProps,
    children,
    tooltipProps,
    withSpinner,
}: Props) => {
    const {handleClick, isPending} = useAsyncButtonClick(popconfirmProps.onConfirm);

    const {
        okButtonProps,
        title = DEFAULT_TITLE,
        onConfirm,
        okText = DEFAULT_OK_TEXT,
        cancelText = DEFAULT_CANCEL_TEXT,
        disabled = buttonProps.disabled,
        ...popconfirmPropsRest
    } = popconfirmProps;

    return (
        <Popconfirm
            {...popconfirmPropsRest}
            onConfirm={(withSpinner ? handleClick : onConfirm) as PopconfirmProps['onConfirm']}
            okButtonProps={{...okButtonProps, loading: isPending}}
            okText={okText}
            cancelText={cancelText}
            disabled={disabled}
            title={title}
        >
            <TooltipButton
                buttonProps={{
                    ...buttonProps,
                    loading: isPending,
                }}
                tooltipProps={tooltipProps}
                withSpinner={withSpinner}
            >
                {children}
            </TooltipButton>
        </Popconfirm>
    );
};

export default PopconfirmButton;
