import {DEFAULT_OBS_WEBSOCKET_PORT} from '__utils/consts';

// ?port=NNNN connects to another port (used for testing)
export const getObsWebSocketPort = () => {
    const port = Number(new URLSearchParams(window.location.search).get('port'));

    return port > 0 ? port : DEFAULT_OBS_WEBSOCKET_PORT;
};
