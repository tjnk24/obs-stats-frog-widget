import {ConfigProvider} from 'antd';
import ReactDOM from 'react-dom/client';

import {THEME} from '__utils/theme';

import './global.module.scss';

import Core from './pages/Core';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ConfigProvider theme={THEME}>
        <Core/>
    </ConfigProvider>,
);
