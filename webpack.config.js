const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const {DefinePlugin} = require('webpack');

const alias = require('./config/aliases.js');
const globals = require('./config/globals.js');

require('dotenv').config();

const development = process.env.NODE_ENV !== 'production';

const plugins = [
    new DefinePlugin(globals),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
        chunkFilename: '[name].css',
        filename: '[name].css',
        ignoreOrder: true,
    }),
];

if (development) {
    plugins.push(
        new ForkTsCheckerWebpackPlugin({
            async: true,
            typescript: {
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                },
            },
        }),
        new EslintWebpackPlugin({
            files: 'src/**/*.{ts,tsx,js,jsx}',
            emitError: true,
            failOnError: false,
            emitWarning: true,
            failOnWarning: false,
            cache: true,
        }),
    );
}

const cssLoaders = [
    {
        loader: development ? 'style-loader' : MiniCssExtractPlugin.loader,
    },
    {
        loader: 'css-loader',
        options: {
            sourceMap: development,
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
            sourceMap: development,
        },
    },
];

module.exports = {
    devtool: development && 'source-map',
    devServer: {
        static: {
            directory: 'build',
        },
        liveReload: false,
        open: ['/'],
        port: process.env.PORT || 3062,
        hot: true,
        client: {
            logging: 'error',
            overlay: false,
        },
    },
    entry: {
        app: ['./src/index.tsx'],
    },
    mode: development ? 'development' : 'production',
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        path: path.resolve(__dirname, 'build'),
        // relative paths, so the build opens from disk (file:///) as an OBS dock
        publicPath: '',
        pathinfo: false,
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias,
    },
    module: {
        rules: [
            {
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
                                        development,
                                    },
                                },
                                // OBS 33 docks run on Chromium 127
                                target: 'es2022',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(s*)css$/,
                use: cssLoaders,
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
        ],
    },
    performance: {
        hints: false,
    },
    plugins,
};
