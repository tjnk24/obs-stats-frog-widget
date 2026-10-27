/* eslint-disable no-restricted-imports */
import {RouteObject} from 'react-router';

import Login from '__pages/Login';
import NotFound from '__pages/NotFound';
import Settings from '__pages/Settings';
import Stats from '__pages/Stats';

import MainLayout from '../main-layout';

export const APP_ROUTES: RouteObject[] = [
    ...Login,
    {
        element: <MainLayout/>,
        children: [
            ...Stats,
            ...Settings,
        ],
    },
    ...NotFound,
];
