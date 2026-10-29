import type {Nullable} from 'infrastructure/common';
import isEqual from 'lodash/isEqual';

import {commonActions} from '__actions';
import {connectionObsVersionSelector, connectionStatusSelector} from '__selectors/connectionSelectors';
import {obsWebSocketPortSelector} from '__selectors/settingsSelectors';
import {statsTargetsSelector} from '__selectors/statsSelectors';
import {getStore} from '__store';
import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';
import {InFlightBatchDto} from '__types/InFlightBatchDto';
import {ObsMessageDto} from '__types/ObsMessageDto';
import {ObsOpCodeEnum} from '__types/ObsOpCodeEnum';
import {ObsRequestDto} from '__types/ObsRequestDto';
import {ObsRequestResultDto} from '__types/ObsRequestResultDto';
import {ObsRequestTypeEnum} from '__types/ObsRequestTypeEnum';
import {PasswordChangeDto} from '__types/PasswordChangeDto';
import {PasswordChangeResultEnum} from '__types/PasswordChangeResultEnum';
import {getAuthString} from '__utils/auth/getAuthString';
import {getHardware} from '__utils/bridge/getHardware';
import {
    AUTHENTICATION_FAILED_CLOSE_CODE,
    DISCOVERY_EVERY_POLLS,
    OBS_RPC_VERSION,
    OBS_WEBSOCKET_PROTOCOL,
    POLL_INTERVAL_MS,
    RECONNECT_INTERVAL_MS,
    REQUEST_TIMEOUT_MS,
} from '__utils/consts';
import {fetchDevObsConnection} from '__utils/dev/fetchDevObsConnection';
import {buildRequests} from '__utils/requests/buildRequests';
import {getObsVersion} from '__utils/requests/getObsVersion';
import {isRequestOfType} from '__utils/requests/isRequestOfType';
import {StatsTracker} from '__utils/stats/StatsTracker';
import {loadPassword} from '__utils/storage/loadPassword';
import {savePassword} from '__utils/storage/savePassword';
import {discoverTargets} from '__utils/targets/discoverTargets';

const {
    Hello,
    Identify,
    Identified,
    RequestBatch,
    RequestBatchResponse,
} = ObsOpCodeEnum;

const {
    Connecting,
    Closed,
    NeedPassword,
    WrongPassword,
} = ConnectionStatusEnum;

class ObsConnectionService {
    private socket: Nullable<WebSocket> = null;

    private reconnectTimer: Nullable<number> = null;

    private pollTimer: Nullable<number> = null;

    private inFlight: Nullable<InFlightBatchDto> = null;

    private requestId = 0;

    private pollIndex = 0;

    private password = loadPassword();

    private passwordChange: Nullable<PasswordChangeDto> = null;

    private readonly tracker = new StatsTracker();

    start = async () => {
        if (process.env.IS_DEV_SERVER) {
            await this.applyDevConnection();
        }

        this.connect();
    };

    stop = () => {
        this.disconnect();
    };

    logIn = (port: number, password: string) => {
        commonActions.settings.setPort(port);
        this.password = password;

        this.reconnect();
    };

    changePassword = (password: string) => new Promise<PasswordChangeResultEnum>(resolve => {
        this.passwordChange = {password, resolve};

        this.reconnect();
    });

    setPort = (port: number) => {
        commonActions.settings.setPort(port);

        this.reconnect();
    };

    resetStats = () => {
        commonActions.stats.setView(this.tracker.reset());
    };

    private applyDevConnection = async () => {
        const connection = await fetchDevObsConnection();

        if (connection) {
            commonActions.settings.setPort(connection.port);
            this.password = connection.password;
        }
    };

    private reconnect = () => {
        this.disconnect();
        this.connect();
    };

    private connect = () => {
        this.clearReconnectTimer();

        connectionStatusSelector(getStore()) !== Closed && commonActions.connection.setStatus(Connecting);

        const socket = new WebSocket(`ws://127.0.0.1:${obsWebSocketPortSelector(getStore())}`, OBS_WEBSOCKET_PROTOCOL);

        socket.onmessage = ({data}: MessageEvent<string>) => {
            void this.onMessage(socket, JSON.parse(data) as ObsMessageDto);
        };

        socket.onclose = ({code}) => this.onClose(socket, code);

        this.socket = socket;
    };

    private disconnect = () => {
        this.clearReconnectTimer();

        const {socket} = this;

        this.socket = null;

        if (socket) {
            socket.onmessage = null;
            socket.onclose = null;
            socket.close();
        }

        this.onDisconnected();
    };

    private onDisconnected = () => {
        this.stopPolling();
        this.tracker.reset();

        commonActions.stats.reset();
    };

    private onClose = (socket: WebSocket, code: number) => {
        if (socket !== this.socket) {
            return;
        }

        this.socket = null;
        this.onDisconnected();

        if (code === AUTHENTICATION_FAILED_CLOSE_CODE && this.passwordChange) {
            this.finishPasswordChange(PasswordChangeResultEnum.Rejected);
            this.connect();

            return;
        }

        this.passwordChange && this.finishPasswordChange(PasswordChangeResultEnum.NoConnection);

        if (code === AUTHENTICATION_FAILED_CLOSE_CODE) {
            savePassword(null);
            this.password = null;

            commonActions.connection.setStatus(WrongPassword);

            return;
        }

        commonActions.connection.setStatus(Closed);

        this.reconnectTimer = window.setTimeout(this.connect, RECONNECT_INTERVAL_MS);
    };

    private onMessage = async (socket: WebSocket, {op: opCode, d: data}: ObsMessageDto) => {
        switch (opCode) {
            case Hello: {
                const identify: Record<string, unknown> = {
                    rpcVersion: OBS_RPC_VERSION,
                    eventSubscriptions: 0,
                };

                const password = this.passwordChange?.password ?? this.password;

                if (data.authentication) {
                    if (!password) {
                        this.disconnect();

                        commonActions.connection.setStatus(NeedPassword);

                        return;
                    }

                    identify.authentication = await getAuthString(password, data.authentication.salt, data.authentication.challenge);
                }

                socket === this.socket && socket.send(JSON.stringify({op: Identify, d: identify}));
                break;
            }

            case Identified:
                this.passwordChange && this.finishPasswordChange(PasswordChangeResultEnum.Accepted);
                this.password && savePassword(this.password);

                commonActions.connection.setStatus(ConnectionStatusEnum.Identified);

                this.startPolling();
                break;

            case RequestBatchResponse: {
                const {inFlight} = this;

                if (inFlight && inFlight.id === data.requestId) {
                    this.inFlight = null;
                    this.onBatchResults(inFlight.requests, data.results);
                }

                break;
            }

            default:
                break;
        }
    };

    private startPolling = () => {
        this.stopPolling();

        this.pollIndex = 0;

        this.poll();
        this.pollTimer = window.setInterval(this.poll, POLL_INTERVAL_MS);
    };

    private stopPolling = () => {
        this.pollTimer !== null && window.clearInterval(this.pollTimer);
        this.pollTimer = null;
        this.inFlight = null;
    };

    private poll = () => {
        const now = performance.now();

        if (!this.socket || (this.inFlight && now - this.inFlight.since < REQUEST_TIMEOUT_MS)) {
            return;
        }

        const id = String(++this.requestId);
        const requests = buildRequests(statsTargetsSelector(getStore()), this.pollIndex++ % DISCOVERY_EVERY_POLLS === 0);

        this.inFlight = {id, since: now, requests};

        this.socket.send(JSON.stringify({
            op: RequestBatch,
            d: {
                requestId: id,
                haltOnFailure: false,
                requests,
            },
        }));
    };

    private onBatchResults = (requests: ObsRequestDto[], results: ObsRequestResultDto[]) => {
        const pairs = requests.map((request, index) => ({request, result: results[index]}));
        const discovered = discoverTargets(pairs);

        if (discovered && !isEqual(discovered, statsTargetsSelector(getStore()))) {
            commonActions.stats.setTargets(discovered);
        }

        if (pairs.some(({request}) => isRequestOfType(ObsRequestTypeEnum.GetProfileParameter)(request))) {
            commonActions.stats.setHardware(getHardware(pairs));
        }

        const obsVersion = getObsVersion(pairs);

        if (obsVersion && !isEqual(obsVersion, connectionObsVersionSelector(getStore()))) {
            commonActions.connection.setObsVersion(obsVersion);
        }

        commonActions.stats.setView(this.tracker.ingest(statsTargetsSelector(getStore()), pairs, performance.now()));
    };

    private finishPasswordChange = (result: PasswordChangeResultEnum) => {
        const {passwordChange} = this;

        if (!passwordChange) {
            return;
        }

        this.passwordChange = null;

        if (result === PasswordChangeResultEnum.Accepted) {
            this.password = passwordChange.password;
        }

        passwordChange.resolve(result);
    };

    private clearReconnectTimer = () => {
        this.reconnectTimer !== null && window.clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
    };
}

export const obsConnectionService = new ObsConnectionService();

import.meta.webpackHot?.decline();
