import {RuleObject} from 'antd/es/form';
import {t} from 'i18next';
import type {Nullable} from 'infrastructure/common';

import {MAX_PORT, MIN_PORT} from '../consts';

export const validatePort = (_rule: RuleObject, port: Nullable<number>) => {
    if (!!port && (port >= MIN_PORT && port <= MAX_PORT)) {
        return Promise.resolve();
    }

    return Promise.reject(new Error(t('portField.range', {min: MIN_PORT, max: MAX_PORT})));
};
