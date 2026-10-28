import {QuestionCircleOutlined} from '@ant-design/icons';
import {
    Flex,
    Tooltip,
    Typography,
} from 'antd';

import {LABEL_TEXT_STYLE} from '../consts';
import style from '../style.module.scss';
import {StatItemDto} from '../types';

// a label too long for the dock, e.g. with a GPU name, is cut with an ellipsis and shown whole on hover
export const renderLabel = ({label, hint}: StatItemDto) => (
    <Flex
        className={style.label}
        align="center"
        gap={4}
    >
        <Typography.Text
            style={LABEL_TEXT_STYLE}
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
