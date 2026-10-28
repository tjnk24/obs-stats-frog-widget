import {GetProp, Typography} from 'antd';

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
