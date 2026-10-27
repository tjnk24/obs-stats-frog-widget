// "rtmp://user@Host.example:1935/app" -> "host.example"; a regexp, because older Chromium (OBS's CEF)
// does not parse hosts of non-http URLs such as rtmp://
export const getServerHost = (server?: string) => {
    const match = /^[a-z][a-z0-9+.-]*:\/\/(?:[^/?#@]*@)?([^/?#:]+)/i.exec(server || '');

    return match ? match[1].toLowerCase() : '';
};
