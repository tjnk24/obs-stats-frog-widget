import {Navigate, RouteObject} from 'react-router';

import {routerManager} from '__services/routerManager';

const routes: RouteObject[] = [
    {
        path: '*',
        element: (
            <Navigate
                to={routerManager.goToStats(true)}
                replace
            />
        ),
    },
];

export default routes;
