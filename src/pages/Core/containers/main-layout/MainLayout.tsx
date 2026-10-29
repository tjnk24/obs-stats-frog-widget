import {ArrowLeftOutlined, SettingOutlined} from '@ant-design/icons';
import {
    Alert,
    Badge,
    Flex,
} from 'antd';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {Outlet, useMatch} from 'react-router';

import EnhancedButton from '__components/EnhancedButton';
import {ROUTES} from '__routes';
import {connectionStatusSelector} from '__selectors/connectionSelectors';
import {settingsIsMockEnabledSelector} from '__selectors/settingsSelectors';
import {obsConnectionService} from '__services/obsConnectionService';
import {routerManager} from '__utils/infrastructure/routing/routeManager';

import {CONNECTION_BADGES} from './consts';

import style from './style.module.scss';

const MainLayout = () => {
    const {t} = useTranslation();

    const status = useSelector(connectionStatusSelector);
    const isMockEnabled = useSelector(settingsIsMockEnabledSelector);
    const isSettingsPage = Boolean(useMatch(ROUTES.SETTINGS.INDEX));

    const {status: badgeStatus, textKey} = CONNECTION_BADGES[status];

    return (
        <Flex
            className={style.layout}
            gap="small"
            vertical
        >
            <Flex
                className={style.header}
                align="center"
                justify="space-between"
                gap="small"
            >
                <Badge
                    status={badgeStatus}
                    text={t(textKey)}
                />

                <EnhancedButton
                    buttonProps={isSettingsPage
                        ? {
                            type: 'text',
                            size: 'small',
                            icon: <ArrowLeftOutlined/>,
                            'aria-label': t('header.toStats'),
                            onClick: () => routerManager.goToStats(),
                        }
                        : {
                            type: 'text',
                            size: 'small',
                            icon: <SettingOutlined/>,
                            'aria-label': t('header.toSettings'),
                            onClick: () => routerManager.goToSettings(),
                        }}
                    withSpinner={false}
                />
            </Flex>

            {isMockEnabled && (
                <Alert
                    type="warning"
                    title={t('mock.banner')}
                    action={(
                        <EnhancedButton
                            buttonProps={{
                                type: 'link',
                                size: 'small',
                                onClick: () => obsConnectionService.setMockEnabled(false),
                            }}
                            withSpinner={false}
                        >
                            {t('mock.disable')}
                        </EnhancedButton>
                    )}
                    showIcon
                />
            )}

            <Flex
                className={style.content}
                vertical
            >
                <Outlet/>
            </Flex>
        </Flex>
    );
};

export default MainLayout;
