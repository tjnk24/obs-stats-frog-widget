import {ArrowLeftOutlined, SettingOutlined} from '@ant-design/icons';
import {Badge, Flex} from 'antd';
import {useSelector} from 'react-redux';
import {Outlet, useMatch} from 'react-router';

import EnhancedButton from '__components/EnhancedButton';
import {ROUTES} from '__routes';
import {connectionStatusSelector} from '__selectors/connectionSelectors';
import {routerManager} from '__utils/infrastructure/routing/routeManager';

import {CONNECTION_BADGES} from './consts';

import style from './style.module.scss';

const MainLayout = () => {
    const status = useSelector(connectionStatusSelector);
    const isSettingsPage = Boolean(useMatch(ROUTES.SETTINGS.INDEX));

    const {status: badgeStatus, text} = CONNECTION_BADGES[status];

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
                    text={text}
                />

                <EnhancedButton
                    buttonProps={isSettingsPage
                        ? {
                            type: 'text',
                            size: 'small',
                            icon: <ArrowLeftOutlined/>,
                            'aria-label': 'К статистике',
                            onClick: () => routerManager.goToStats(),
                        }
                        : {
                            type: 'text',
                            size: 'small',
                            icon: <SettingOutlined/>,
                            'aria-label': 'Настройки',
                            onClick: () => routerManager.goToSettings(),
                        }}
                    withSpinner={false}
                />
            </Flex>

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
