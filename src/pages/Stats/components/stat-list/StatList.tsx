import {Descriptions, Typography} from 'antd';

import {DESCRIPTIONS_STYLES, LEVEL_TEXT_TYPES} from './consts';
import {Props} from './types';
import {renderLabel} from './utils/renderLabel';

import style from './style.module.scss';

const StatList = ({items, column = 1}: Props) => (
    <Descriptions
        className={style.list}
        size="small"
        column={column}
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
