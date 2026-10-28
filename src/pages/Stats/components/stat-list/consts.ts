import {
    DescriptionsProps,
    GetProp,
    Typography,
} from 'antd';
import {CSSProperties} from 'react';

import {HealthLevelEnum} from '__types/HealthLevelEnum';

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
    // the label takes the room the value leaves, so only the label is ever cut
    label: {
        flex: '1 1 auto',
        minWidth: 0,
        whiteSpace: 'nowrap',
    },
    content: {
        flex: 'none',
        justifyContent: 'flex-end',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
    },
};

// the label keeps the color antd gives Descriptions labels
export const LABEL_TEXT_STYLE: CSSProperties = {
    color: 'inherit',
};
