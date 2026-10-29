import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router';

import {connectionStatusSelector} from '__selectors/connectionSelectors';
import {routerManager} from '__services/routerManager';

import {PASSWORD_STATUSES, PASSWORD_PAGE_STATUSES} from './consts';
import {Props} from './types';

const AppRoute = ({
    titleKey,
    isAuthRequired,
    isLoginPage,
    children,
}: Props) => {
    const {t} = useTranslation();

    const status = useSelector(connectionStatusSelector);

    const title = t(titleKey);

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
