import {FormRule} from 'antd';

import {validatePort} from './utils/validatePort';

export const MIN_PORT = 1;
export const MAX_PORT = 65535;

export const PORT_RULES: FormRule[] = [
    {
        validator: validatePort,
    },
];
