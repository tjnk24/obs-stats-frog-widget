import flow from 'lodash/flow.js';

import {
    initBaseConfig,
    initClientConfig,
    initDevServer,
    loadAssets,
    loadScripts,
    loadStyles,
} from './webpack/index.ts';

const webpackConfig = flow([
    initBaseConfig({context: import.meta.dirname}),
    initClientConfig({
        entry: {
            app: ['./src/index.tsx'],
        },
    }),
    initDevServer(),
    loadScripts(),
    loadStyles(),
    loadAssets(),
])({});

export default webpackConfig;
