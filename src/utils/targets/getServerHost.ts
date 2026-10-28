export const getServerHost = (server?: string) => {
    const match = /^[a-z][a-z0-9+.-]*:\/\/(?:[^/?#@]*@)?([^/?#:]+)/i.exec(server || '');

    return match ? match[1].toLowerCase() : '';
};
