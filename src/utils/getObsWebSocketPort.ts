import type {Nullable} from 'infrastructure/common';

export const getObsWebSocketPort = (): Nullable<number> => {
    const port = Number(new URLSearchParams(window.location.search).get('port'));

    return port > 0 ? port : null;
};
