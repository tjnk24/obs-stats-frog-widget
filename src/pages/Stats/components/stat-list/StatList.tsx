import {Descriptions, Typography} from 'antd';

import {DESCRIPTIONS_STYLES, LEVEL_TEXT_TYPES} from './consts';
import {Props} from './types';
import {renderLabel} from './utils/renderLabel';

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
