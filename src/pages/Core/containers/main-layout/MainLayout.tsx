import {
    Badge,
    Flex,
    Segmented,
} from 'antd';
import {useSelector} from 'react-redux';
import {Outlet, useLocation} from 'react-router';

import {connectionStatusSelector} from '__selectors/connectionSelectors';

import {CONNECTION_BADGES, NAV_ITEMS} from './consts';

import style from './style.module.scss';

const MainLayout = () => {
    const {pathname} = useLocation();
    const status = useSelector(connectionStatusSelector);

    const {status: badgeStatus, text} = CONNECTION_BADGES[status];

    return (
        <Flex
            className={style.layout}
            gap="small"
            vertical
        >
            <Segmented
                value={pathname}
                options={NAV_ITEMS}
                onChange={path => NAV_ITEMS.find(({value}) => value === path)?.goTo()}
                block
            />

            <div className={style.content}>
                <Outlet/>
            </div>

            <Badge
                status={badgeStatus}
                text={text}
            />
        </Flex>
    );
};

export default MainLayout;
