import {RouteObject} from 'react-router';

import AppRoute from '__components/AppRoute';
import {ROUTES} from '__routes';

import Page from './containers/page';

const routes: RouteObject[] = [
    {
        path: ROUTES.SETTINGS.INDEX,
        element: (
            <AppRoute title="Настройки">
                <Page/>
            </AppRoute>
        ),
    },
];

export default routes;
