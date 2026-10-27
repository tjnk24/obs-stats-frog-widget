import type {Nullable} from 'infrastructure/common';

import {PASSWORD_STORAGE_KEY} from '__utils/consts';

export const savePassword = (password: Nullable<string>) => {
    try {
        if (password === null) {
            localStorage.removeItem(PASSWORD_STORAGE_KEY);
        } else {
            localStorage.setItem(PASSWORD_STORAGE_KEY, password);
        }
    } catch {
        // without localStorage the password is asked again next time
    }
};
