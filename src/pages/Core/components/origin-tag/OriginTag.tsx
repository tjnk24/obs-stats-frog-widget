import {Tag, Tooltip} from 'antd';

import {Props} from './types';

// where a card comes from: OBS's own stream settings or a plugin
const OriginTag = ({tag}: Props) => {
    const {text, hint, color} = tag;

    return (
        <Tooltip title={hint}>
            <Tag
                color={color}
                variant="outlined"
            >
                {text}
            </Tag>
        </Tooltip>
    );
};

export default OriginTag;
