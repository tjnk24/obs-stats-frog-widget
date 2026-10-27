import {
    DescriptionsProps,
    GetProp,
    Typography,
} from 'antd';

import {HealthLevelEnum} from '__utils/types';

const {
    Ok,
    Warn,
    Bad,
    Off,
} = HealthLevelEnum;

export const LEVEL_TEXT_TYPES: Record<HealthLevelEnum, GetProp<typeof Typography.Text, 'type'>> = {
    [Ok]: 'success',
    [Warn]: 'warning',
    [Bad]: 'danger',
    [Off]: 'secondary',
};

export const DESCRIPTIONS_STYLES: DescriptionsProps['styles'] = {
    label: {
        whiteSpace: 'nowrap',
    },
    content: {
        justifyContent: 'flex-end',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
    },
};
