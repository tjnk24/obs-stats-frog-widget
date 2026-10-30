import type {Configuration} from 'webpack';

import {IS_DEV_SERVER, IS_DEVELOPMENT} from './consts.ts';

export const loadScripts = () => (webpackConfig: Configuration): Configuration => {
    webpackConfig.module?.rules?.push({
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'swc-loader',
                options: {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                            tsx: true,
                        },
                        transform: {
                            react: {
                                runtime: 'automatic',
                                development: IS_DEVELOPMENT,
                                refresh: IS_DEV_SERVER,
                            },
                        },
                        target: 'es2022',
                    },
                },
            },
        ],
    });

    return webpackConfig;
};
