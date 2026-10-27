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
}

export type Props = OwnProps;
