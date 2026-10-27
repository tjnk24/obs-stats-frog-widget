import type {Nullable} from 'infrastructure/common';

import {PASSWORD_STORAGE_KEY} from '__utils/consts';

export const loadPassword = (): Nullable<string> => {
    try {
        return localStorage.getItem(PASSWORD_STORAGE_KEY);
    } catch {
        return null;
    }
};
