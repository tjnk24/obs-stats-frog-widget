import {sha256Fallback} from './sha256Fallback';

// crypto.subtle, or plain JS if the browser hides it from local (file:///) pages
export const sha256 = async (text: string) => {
    const bytes = new TextEncoder().encode(text);

    if (window.crypto?.subtle) {
        return new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    }

    return sha256Fallback(bytes);
};
