import {theme, ThemeConfig} from 'antd';

// the class antd puts its CSS variables (--ant-*) on; set on <html> in index.tsx,
// so the page's own styles can use them too, not only antd components and what is inside them
export const THEME_CSS_VAR_KEY = 'css-var-app';

export const THEME: ThemeConfig = {
    algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    cssVar: {
        key: THEME_CSS_VAR_KEY,
    },
    token: {
        colorPrimary: '#2689fb',
        colorInfo: '#2689fb',
        colorSuccess: '#4cb36c',
        colorWarning: '#e2a63b',
        colorError: '#e5534b',
        colorBgBase: '#1D1F26',
        // the dark algorithm would derive a slightly bluer page background from colorBgBase
        colorBgLayout: '#1D1F26',
        colorBgContainer: '#272a33',
        colorBgElevated: '#30343e',
        colorBorder: '#3c404d',
        colorBorderSecondary: '#3c404d',
        borderRadius: 5,
        fontSize: 14,
        fontFamily: 'Inter, Roboto, \'Helvetica Neue\', Geneva, arial, Tahoma, verdana, sans-serif',
    },
    components: {
        Descriptions: {
            itemPaddingBottom: 2,
            itemPaddingEnd: 0,
        },
        Statistic: {
            contentFontSize: 28,
        },
    },
};
