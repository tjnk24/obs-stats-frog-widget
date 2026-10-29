/* eslint-disable no-restricted-imports */
import {ConfigProvider} from 'antd';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {createHashRouter, RouterProvider} from 'react-router';

import '__i18n';
import Core from '__pages/Core';
import {routerManager} from '__services/routerManager';
import store from '__store';
import {THEME, THEME_CSS_VAR_KEY} from '__utils/theme';

import './global.module.scss';

const router = createHashRouter(Core);

routerManager.init(router.navigate);

document.documentElement.classList.add(THEME_CSS_VAR_KEY);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <Provider store={store}>
        <ConfigProvider theme={THEME}>
            <RouterProvider router={router}/>
        </ConfigProvider>
    </Provider>,
);
