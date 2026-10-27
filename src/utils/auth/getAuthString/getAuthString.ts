import {sha256} from '../sha256';

import {toBase64} from './toBase64';

// obs-websocket 5: base64(sha256(base64(sha256(password + salt)) + challenge))
export const getAuthString = async (password: string, salt: string, challenge: string) => {
    const secret = toBase64(await sha256(password + salt));

    return toBase64(await sha256(secret + challenge));
};
