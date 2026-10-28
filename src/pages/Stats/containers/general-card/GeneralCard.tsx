import {ReloadOutlined} from '@ant-design/icons';
import {Card, Flex} from 'antd';

import EnhancedButton from '__components/EnhancedButton';
import {obsConnectionService} from '__services/obsConnectionService';

import StatList from '../../components/stat-list';

import {STAT_COLUMNS} from './consts';
import {useItems} from './hooks/useItems';

import style from './style.module.scss';

const GeneralCard = () => {
    const items = useItems();

    return (
        <Card
            size="small"
            title="OBS"
        >
            <StatList
                items={items}
                column={STAT_COLUMNS}
            />

            <Flex
                className={style.actions}
                justify="end"
            >
                <EnhancedButton
                    buttonProps={{
                        size: 'small',
                        icon: <ReloadOutlined/>,
                        onClick: obsConnectionService.resetStats,
                    }}
                    withSpinner={false}
                >
                    Сбросить графики
                </EnhancedButton>
            </Flex>
        </Card>
    );
};

export default GeneralCard;
