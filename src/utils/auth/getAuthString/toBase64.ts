export const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...Array.from(bytes)));
