import {RuleObject} from 'antd/es/form';
import type {Nullable} from 'infrastructure/common';

import {MAX_PORT, MIN_PORT} from '../consts';

export const validatePort = (_rule: RuleObject, port: Nullable<number>) => {
    if (!!port && (port >= MIN_PORT && port <= MAX_PORT)) {
        return Promise.resolve();
    }

    return Promise.reject(new Error(`Порт - число от ${MIN_PORT} до ${MAX_PORT}`));
};
