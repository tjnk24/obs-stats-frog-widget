export enum IndicatorTypeEnum {
    Loading = 'Loading',
    Critical = 'Critical',
};

export enum HealthLevelEnum {
    Ok = 'ok',
    Warn = 'warn',
    Bad = 'bad',
    Off = 'off',
};

// obs-websocket 5 message op codes
export enum ObsOpCodeEnum {
    Hello = 0,
    Identify = 1,
    Identified = 2,
    RequestBatch = 8,
    RequestBatchResponse = 9,
};

export type ObsMessageDto = {
    op: ObsOpCodeEnum;
    d: any;
};

export type ObsRequestDto = {
    requestType: string;
    requestData?: Record<string, unknown>;
};

export type ObsRequestResultDto<T = unknown> = {
    requestType: string;
    requestStatus: {
        result: boolean;
        code: number;
        comment?: string;
    };
    responseData?: T;
};

// GetStreamStatus and GetOutputStatus
export type ObsOutputStatusDto = {
    outputActive: boolean;
    outputReconnecting: boolean;
    outputTimecode: string;
    outputDuration: number;
    outputCongestion: number;
    outputBytes: number;
    outputSkippedFrames: number;
    outputTotalFrames: number;
};

export type ObsStatsDto = {
    activeFps: number;
    averageFrameRenderTime: number;
    cpuUsage: number;
    memoryUsage: number;
    availableDiskSpace: number;
    renderSkippedFrames: number;
    renderTotalFrames: number;
    outputSkippedFrames: number;
    outputTotalFrames: number;
};

export enum ObsRequestTypeEnum {
    GetStats = 'GetStats',
    GetStreamStatus = 'GetStreamStatus',
    GetOutputStatus = 'GetOutputStatus',
    GetStreamServiceSettings = 'GetStreamServiceSettings',
    GetOutputList = 'GetOutputList',
    GetProfileParameter = 'GetProfileParameter',
};

export type RequestResultPairDto = {
    request: ObsRequestDto;
    result?: ObsRequestResultDto;
};

// GetStreamServiceSettings; the stream key in it is never read
export type ObsStreamServiceDto = {
    streamServiceType: string;
    streamServiceSettings: {
        service?: string;
        server?: string;
    };
};

export type ObsOutputListItemDto = {
    outputName: string;
    outputKind: string;
    outputActive: boolean;
    outputFlags?: Record<string, boolean>;
};

export type ObsProfileParameterDto = {
    parameterValue: string | null;
};

// what obs-stats-bridge.lua publishes: plugin outputs with the scheme and host of their server
export type BridgeDataDto = {
    updated: number;
    outputs: {
        name: string;
        server: string;
    }[];
};

export enum OutputOriginEnum {
    Main = 'main',
    Plugin = 'plugin',
};

export type PlatformRuleDto = {
    title: string;
    color: string;
    services: RegExp;
    hosts: RegExp[];
};

export type PlatformDto = {
    title: string;
    color: string;
    isKnown: boolean;
};

export type TagDto = {
    text: string;
    hint?: string;
    // an antd Tag color; none for the gray one
    color?: string;
};

export type NoteDto = {
    text: string;
    type: 'info' | 'warning';
};

// one card: OBS's own stream output or a plugin output
export type StreamTargetDto = {
    key: string;
    origin: OutputOriginEnum;
    // null for OBS's own stream output, read with GetStreamStatus
    outputName: string | null;
    pluginName: string | null;
    platform: PlatformDto;
    notes: NoteDto[];
};

export type GraphPointDto = {
    time: number;
    kbps: number;
};

export type OutputViewDto = {
    isActive: boolean;
    isReconnecting: boolean;
    level: HealthLevelEnum;
    kbps: number | null;
    timecode: string;
    dropped: number;
    total: number;
    recentDropped: number;
    recentTotal: number;
    congestion: number;
    graph: GraphPointDto[];
};

export type LagViewDto = {
    skipped: number;
    total: number;
    recentSkipped: number;
};

export type GeneralViewDto = {
    fps: number;
    frameTime: number;
    cpu: number;
    encoding: LagViewDto;
    rendering: LagViewDto;
};

export type StatsViewDto = {
    // by StreamTargetDto.key
    outputs: Record<string, OutputViewDto>;
    general: GeneralViewDto | null;
    now: number;
};
