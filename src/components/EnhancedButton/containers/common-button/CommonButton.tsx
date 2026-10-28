import {Button} from 'antd';

import {useAsyncButtonClick} from '../../hooks/useAsyncButtonClick';

import {Props} from './types';

const CommonButton = (props: Props) => {
    const {handleClick, isPending} = useAsyncButtonClick(props.onClick);

    const {
        onClick,
        children,
        withSpinner,
        loading,
        type,
        danger,
        disabled,
        ...buttonPropsRest
    } = props;

    const isDefault = !disabled && !danger && !type;

    return (
        <Button
            {...buttonPropsRest}
            color={isDefault ? 'primary' : buttonPropsRest.color}
            variant={isDefault ? 'outlined' : buttonPropsRest.variant}
            onClick={withSpinner ? handleClick : onClick}
            loading={isPending || loading}
            type={type}
            danger={danger}
            disabled={disabled}
        >
            {children}
        </Button>
    );
};

export default CommonButton;
