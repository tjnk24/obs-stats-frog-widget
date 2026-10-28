import {QuestionCircleOutlined} from '@ant-design/icons';
import {
    Flex,
    Tooltip,
    Typography,
} from 'antd';

import style from '../style.module.scss';
import {StatItemDto} from '../types';

export const renderLabel = ({label, hint}: StatItemDto) => (
    <Flex
        className={style.label}
        align="center"
        gap={4}
    >
        <Typography.Text
            className={style.labelText}
            ellipsis={{tooltip: label}}
        >
            {label}
        </Typography.Text>

        {hint && (
            <Tooltip title={hint}>
                <QuestionCircleOutlined/>
            </Tooltip>
        )}
    </Flex>
);
