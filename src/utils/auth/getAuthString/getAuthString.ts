import {sha256} from '../sha256';

import {toBase64} from './toBase64';

export const getAuthString = async (password: string, salt: string, challenge: string) => {
    const secret = toBase64(await sha256(password + salt));

    return toBase64(await sha256(secret + challenge));
};
