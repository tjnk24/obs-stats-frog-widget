import {QuestionCircleOutlined} from '@ant-design/icons';
import {Tooltip} from 'antd';

import {StatItemDto} from '../types';

export const renderLabel = ({label, hint}: StatItemDto) => {
    if (!hint) {
        return label;
    }

    return (
        <Tooltip title={hint}>
            <span>
                {`${label} `}

                <QuestionCircleOutlined/>
            </span>
        </Tooltip>
    );
};
