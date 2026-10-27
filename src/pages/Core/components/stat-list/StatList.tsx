import {QuestionCircleOutlined} from '@ant-design/icons';
import {
    Descriptions,
    Tooltip,
    Typography,
} from 'antd';

import {DESCRIPTIONS_STYLES, LEVEL_TEXT_TYPES} from './consts';
import {Props, StatItemDto} from './types';

const renderLabel = ({label, hint}: StatItemDto) => {
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

// label on the left, value on the right; the value is colored by its health level
const StatList = ({items}: Props) => (
    <Descriptions
        size="small"
        column={1}
        colon={false}
        styles={DESCRIPTIONS_STYLES}
        items={items.map(item => ({
            key: item.key,
            label: renderLabel(item),
            children: (
                <Typography.Text type={item.level ? LEVEL_TEXT_TYPES[item.level] : undefined}>
                    {item.value}
                </Typography.Text>
            ),
        }))}
    />
);

export default StatList;
