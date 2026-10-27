import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import useWebSocket from 'react-use-websocket';

import {
    AUTHENTICATION_FAILED_CLOSE_CODE,
    OBS_RPC_VERSION,
    OBS_WEBSOCKET_PROTOCOL,
    POLL_INTERVAL_MS,
    RECONNECT_INTERVAL_MS,
    REQUEST_TIMEOUT_MS,
} from '__utils/consts';
import {getAuthString} from '__utils/getAuthString';
import {loadPassword, savePassword} from '__utils/passwordStorage';
import {
    ObsMessageDto,
    ObsOpCodeEnum,
    ObsRequestDto,
} from '__utils/types';

import {
    CONNECTING_WORDING,
    ENTER_PASSWORD_WORDING,
    WRONG_PASSWORD_WORDING,
} from '../consts';
import {LoginStateDto, UseObsConnectionParams} from '../types';

const {
    Hello,
    Identify,
    Identified,
    RequestBatch,
    RequestBatchResponse,
} = ObsOpCodeEnum;

// obs-websocket 5 session: Hello -> Identify (with the password hash if OBS asks for it) -> Identified,
// then one RequestBatch per POLL_INTERVAL_MS. The login form is shown when OBS wants a password we do not have
// or rejects the one we sent (close code 4009); while it is shown, no connection is kept.
export const useObsConnection = ({port, getRequests, onBatchResults}: UseObsConnectionParams) => {
    const [isConnectAllowed, setIsConnectAllowed] = useState(true);
    const [isIdentified, setIsIdentified] = useState(false);
    const [login, setLogin] = useState<LoginStateDto | null>(null);

    // refs, so the socket handlers always see the current values
    const passwordRef = useRef<string | null>(null);
    const isRememberPasswordRef = useRef(true);
    const getRequestsRef = useRef(getRequests);
    const onBatchResultsRef = useRef(onBatchResults);
    // the batch waiting for its answer; results come back in the order of its requests
    const inFlightRef = useRef<{id: string; since: number; requests: ObsRequestDto[]} | null>(null);
    const requestIdRef = useRef(0);

    useEffect(() => {
        passwordRef.current = loadPassword();
    }, []);

    useEffect(() => {
        getRequestsRef.current = getRequests;
        onBatchResultsRef.current = onBatchResults;
    }, [getRequests, onBatchResults]);

    const {sendJsonMessage, readyState} = useWebSocket(isConnectAllowed ? `ws://127.0.0.1:${port}` : null, {
        protocols: OBS_WEBSOCKET_PROTOCOL,
        onMessage: ({data}: MessageEvent<string>) => {
            void onObsMessage(JSON.parse(data) as ObsMessageDto);
        },
        onClose: ({code}) => {
            setIsIdentified(false);

            if (code === AUTHENTICATION_FAILED_CLOSE_CODE) {
                savePassword(null);
                passwordRef.current = null;
                setIsConnectAllowed(false);
                setLogin({message: WRONG_PASSWORD_WORDING, isError: true});
            }
        },
        shouldReconnect: ({code}) => code !== AUTHENTICATION_FAILED_CLOSE_CODE,
        reconnectAttempts: Infinity,
        reconnectInterval: RECONNECT_INTERVAL_MS,
        retryOnError: true,
    });

    const onObsMessage = async ({op, d}: ObsMessageDto) => {
        switch (op) {
            case Hello: {
                const identify: Record<string, unknown> = {
                    rpcVersion: OBS_RPC_VERSION,
                    eventSubscriptions: 0,
                };

                if (d.authentication) {
                    if (!passwordRef.current) {
                        setIsConnectAllowed(false);
                        setLogin({message: ENTER_PASSWORD_WORDING});

                        return;
                    }

                    identify.authentication = await getAuthString(passwordRef.current, d.authentication.salt, d.authentication.challenge);
                }

                sendJsonMessage({op: Identify, d: identify});
                break;
            }

            case Identified:
                isRememberPasswordRef.current && passwordRef.current && savePassword(passwordRef.current);
                setLogin(null);
                setIsIdentified(true);
                break;

            case RequestBatchResponse: {
                const inFlight = inFlightRef.current;

                // an answer to a batch given up on after REQUEST_TIMEOUT_MS is dropped
                if (inFlight?.id === d.requestId) {
                    inFlightRef.current = null;
                    onBatchResultsRef.current(inFlight.requests, d.results);
                }

                break;
            }

            default:
                break;
        }
    };

    useEffect(() => {
        if (!isIdentified) {
            return;
        }

        let pollIndex = 0;

        const poll = () => {
            const now = performance.now();

            // the previous answer is still pending
            if (inFlightRef.current && now - inFlightRef.current.since < REQUEST_TIMEOUT_MS) {
                return;
            }

            const id = String(++requestIdRef.current);
            const requests = getRequestsRef.current(pollIndex++);

            inFlightRef.current = {id, since: now, requests};

            sendJsonMessage({
                op: RequestBatch,
                d: {
                    requestId: id,
                    haltOnFailure: false,
                    requests,
                },
            });
        };

        inFlightRef.current = null;
        poll();

        const timer = setInterval(poll, POLL_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [isIdentified, sendJsonMessage]);

    const submitPassword = useCallback((password: string, isRemember: boolean) => {
        passwordRef.current = password;
        isRememberPasswordRef.current = isRemember;

        !isRemember && savePassword(null);

        setLogin({message: CONNECTING_WORDING});
        setIsConnectAllowed(true);
    }, []);

    const resetPassword = useCallback(() => {
        savePassword(null);
        passwordRef.current = null;

        setIsConnectAllowed(false);
        setIsIdentified(false);
        setLogin({message: ENTER_PASSWORD_WORDING});
    }, []);

    return {
        readyState,
        isIdentified,
        login,
        submitPassword,
        resetPassword,
    };
};
