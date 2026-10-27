import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router';

import {connectionStatusSelector} from '__selectors/connectionSelectors';
import {routerManager} from '__utils/infrastructure/routing/routeManager';

import {PASSWORD_STATUSES, PASSWORD_PAGE_STATUSES} from './consts';
import {Props} from './types';

const AppRoute = ({
    title,
    isAuthRequired,
    isLoginPage,
    children,
}: Props) => {
    const status = useSelector(connectionStatusSelector);

    useEffect(() => {
        document.title = title;
    }, [title]);

    if (isAuthRequired && PASSWORD_STATUSES.includes(status)) {
        return (
            <Navigate
                to={routerManager.goToLogin(true)}
                replace
            />
        );
    }

    if (isLoginPage && !PASSWORD_PAGE_STATUSES.includes(status)) {
        return (
            <Navigate
                to={routerManager.goToStats(true)}
                replace
            />
        );
    }

    return children;
};

export default AppRoute;
