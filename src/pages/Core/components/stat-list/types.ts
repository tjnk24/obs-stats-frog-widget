import {ReactNode} from 'react';

import {HealthLevelEnum} from '__utils/types';

export type StatItemDto = {
    key: string;
    label: string;
    hint?: string;
    level?: HealthLevelEnum;
    value: ReactNode;
};

interface OwnProps {
    items: StatItemDto[];
}

export type Props = OwnProps;
