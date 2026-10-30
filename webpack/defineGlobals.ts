import packageJson from '../package.json' with {type: 'json'};

import {IS_DEV_SERVER} from './consts.ts';

export const defineGlobals = () => ({
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        IS_DEV_SERVER: JSON.stringify(IS_DEV_SERVER),
        APP_VERSION: JSON.stringify(packageJson.version),
    },
});
