import {ReloadOutlined} from '@ant-design/icons';
import {Card, Flex} from 'antd';
import {useTranslation} from 'react-i18next';

import EnhancedButton from '__components/EnhancedButton';
import {obsConnectionService} from '__services/obsConnectionService';

import StatList from '../../components/stat-list';

import {STAT_COLUMNS} from './consts';
import {useItems} from './hooks/useItems';

import style from './style.module.scss';

const GeneralCard = () => {
    const {t} = useTranslation();

    const items = useItems();

    return (
        <Card
            size="small"
            title={t('general.title')}
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
                    {t('general.reset')}
                </EnhancedButton>
            </Flex>
        </Card>
    );
};

export default GeneralCard;
