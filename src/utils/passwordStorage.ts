import {PASSWORD_STORAGE_KEY} from './consts';

// localStorage may be unavailable (blocked storage, private profile); the dock then just asks again

export const loadPassword = () => {
    try {
        return localStorage.getItem(PASSWORD_STORAGE_KEY);
    } catch {
        return null;
    }
};

export const savePassword = (password: string | null) => {
    try {
        if (password === null) {
            localStorage.removeItem(PASSWORD_STORAGE_KEY);
        } else {
            localStorage.setItem(PASSWORD_STORAGE_KEY, password);
        }
    } catch {
        // nothing to do
    }
};
