import {Tag} from 'antd';

import {HEALTH_TAGS} from './consts';
import {Props} from './types';

const HealthTag = ({level, text}: Props) => {
    const {color, variant} = HEALTH_TAGS[level];

    return (
        <Tag
            color={color}
            variant={variant}
        >
            {text}
        </Tag>
    );
};

export default HealthTag;
