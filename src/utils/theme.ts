import {theme, ThemeConfig} from 'antd';

export const THEME_CSS_VAR_KEY = 'css-var-app';

const FIELD_COLORS = {
    colorBgContainer: '#363a46',
    hoverBg: '#3b404d',
    activeBg: '#3b404d',
};

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
            itemPaddingEnd: 24,
        },
        Statistic: {
            contentFontSize: 28,
        },
        Input: FIELD_COLORS,
        InputNumber: FIELD_COLORS,
    },
};
