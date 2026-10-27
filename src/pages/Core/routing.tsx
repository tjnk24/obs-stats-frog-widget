import {RouteObject} from 'react-router';

import CorePage from './containers/page';
import {APP_ROUTES} from './containers/page/appRoutes';

const routes: RouteObject[] = [
    {
        element: <CorePage/>,
        children: APP_ROUTES,
    },
];

export default routes;
