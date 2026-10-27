import {theme, ThemeConfig} from 'antd';

// antd's dark theme in the colors of the chat widget; compact, as a dock is narrow
export const THEME: ThemeConfig = {
    algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    token: {
        colorPrimary: '#2689fb',
        colorInfo: '#2689fb',
        colorSuccess: '#4cb36c',
        colorWarning: '#e2a63b',
        colorError: '#e5534b',
        colorBgBase: '#1D1F26',
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
