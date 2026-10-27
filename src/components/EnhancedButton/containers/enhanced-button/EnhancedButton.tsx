import CommonButton from '../common-button';
import PopconfirmButton from '../popconfirm-button';
import TooltipButton from '../tooltip-button';

import {Props} from './types';

// with withSpinner (the default) the button spins while the promise its onClick returns is pending
const EnhancedButton = ({
    buttonProps,
    popconfirmProps,
    tooltipProps,
    children,
    withSpinner = true,
}: Props) => {
    const commonChildren = children || buttonProps?.children;

    const commonButtonProps = buttonProps ?? {};

    if (popconfirmProps) {
        return (
            <PopconfirmButton
                buttonProps={commonButtonProps}
                popconfirmProps={popconfirmProps}
                tooltipProps={tooltipProps ?? null}
                withSpinner={withSpinner}
            >
                {commonChildren}
            </PopconfirmButton>
        );
    }

    if (tooltipProps) {
        return (
            <TooltipButton
                buttonProps={commonButtonProps}
                tooltipProps={tooltipProps}
                withSpinner={withSpinner}
            >
                {commonChildren}
            </TooltipButton>
        );
    }

    return (
        <CommonButton
            {...buttonProps}
            withSpinner={withSpinner}
        >
            {commonChildren}
        </CommonButton>
    );
};

export default EnhancedButton;
