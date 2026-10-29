import {ConfigProvider} from 'antd';
import {useTranslation} from 'react-i18next';
import {Outlet} from 'react-router';

import ErrorBoundary from '__components/ErrorBoundary';
import {LanguageEnum} from '__types/LanguageEnum';

import {ANTD_LOCALES} from './consts';

const CorePage = () => {
    const {i18n} = useTranslation();

    return (
        <ConfigProvider locale={ANTD_LOCALES[i18n.language as LanguageEnum]}>
            <ErrorBoundary>
                <Outlet/>
            </ErrorBoundary>
        </ConfigProvider>
    );
};

export default CorePage;
