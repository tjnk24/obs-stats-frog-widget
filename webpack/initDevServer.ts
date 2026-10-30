import dotenv from 'dotenv';
import type {Configuration} from 'webpack';
import type {Configuration as DevServerConfiguration} from 'webpack-dev-server';

import {serveObsConnection} from './serveObsConnection.ts';

const DEFAULT_PORT = 3062;

export const initDevServer = () => (webpackConfig: Configuration): Configuration => {
    dotenv.config({quiet: true});

    const devServer: DevServerConfiguration = {
        static: {
            directory: 'build',
        },
        liveReload: true,
        host: 'localhost',
        open: ['/'],
        port: process.env.PORT || DEFAULT_PORT,
        setupMiddlewares: (middlewares, server) => {
            server.app?.get('/dev/obs-connection', serveObsConnection);

            return middlewares;
        },
        hot: true,
        client: {
            logging: 'warn',
            overlay: false,
        },
    };

    return Object.assign(webpackConfig, {devServer});
};
