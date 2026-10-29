import {Popconfirm, PopconfirmProps} from 'antd';
import {useTranslation} from 'react-i18next';

import {useAsyncButtonClick} from '../../hooks/useAsyncButtonClick';
import TooltipButton from '../tooltip-button';

import {Props} from './types';

const PopconfirmButton = ({
    buttonProps,
    popconfirmProps,
    children,
    tooltipProps,
    withSpinner,
}: Props) => {
    const {t} = useTranslation();

    const {handleClick, isPending} = useAsyncButtonClick(popconfirmProps.onConfirm);

    const {
        okButtonProps,
        title = t('popconfirm.title'),
        onConfirm,
        okText = t('popconfirm.ok'),
        cancelText = t('popconfirm.cancel'),
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
