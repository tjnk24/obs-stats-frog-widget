import {DescriptionsProps} from 'antd';
import {ReactNode} from 'react';

import {HealthLevelEnum} from '__types/HealthLevelEnum';

export type StatItemDto = {
    key: string;
    label: string;
    hint?: string;
    level?: HealthLevelEnum;
    value: ReactNode;
};

interface OwnProps {
    items: StatItemDto[];
    column?: DescriptionsProps['column'];
}

export type Props = OwnProps;
