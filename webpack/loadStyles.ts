import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type {Configuration} from 'webpack';

import {CONTENT_HASH, IS_DEVELOPMENT} from './consts.ts';

export const loadStyles = () => (webpackConfig: Configuration): Configuration => {
    webpackConfig.plugins?.push(
        new MiniCssExtractPlugin({
            chunkFilename: `[name]${CONTENT_HASH}.css`,
            filename: `[name]${CONTENT_HASH}.css`,
            ignoreOrder: true,
        }),
    );

    webpackConfig.module?.rules?.push({
        test: /\.(s*)css$/,
        use: [
            {
                loader: IS_DEVELOPMENT ? 'style-loader' : MiniCssExtractPlugin.loader,
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap: IS_DEVELOPMENT,
                    modules: {
                        mode: 'local',
                        namedExport: false,
                        localIdentName: '[local]--[hash:base64:5]',
                    },
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: IS_DEVELOPMENT,
                },
            },
        ],
    });

    return webpackConfig;
};
