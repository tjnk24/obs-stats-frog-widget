import {PlatformRuleDto, TagDto} from './types';

export const DEFAULT_OBS_WEBSOCKET_PORT = 4455;
export const OBS_WEBSOCKET_PROTOCOL = 'obswebsocket.json';
export const OBS_RPC_VERSION = 1;
export const AUTHENTICATION_FAILED_CLOSE_CODE = 4009;

export const POLL_INTERVAL_MS = 1000;
export const REQUEST_TIMEOUT_MS = 5000;
export const RECONNECT_INTERVAL_MS = 3000;
export const GRAPH_SPAN_SEC = 120;
export const RECENT_WINDOW_SEC = 60;
// stream settings and the list of outputs are re-read every this many polls
export const DISCOVERY_EVERY_POLLS = 5;

// share of frames lost over the last minute that turns a platform red
export const BAD_DROP_SHARE = 0.01;

// kept from the first single-file version of the dock, so a password remembered there carries over
export const PASSWORD_STORAGE_KEY = 'obs-stats-dock.password';

export const MAIN_TARGET_KEY = 'main';
// OBS's own stream output: "adv_stream" in Advanced output mode, "simple_stream" in Simple
export const MAIN_OUTPUT_NAMES = ['adv_stream', 'simple_stream'];
// names plugins give their stream outputs
export const PLUGIN_OUTPUT_NAMES: Record<string, string> = {
    'multi-output': 'multi-rtmp',
};

export const BRIDGE_SCRIPT_NAME = 'obs-stats-bridge.lua';
export const BRIDGE_PARAMETER = {
    parameterCategory: 'ObsStatsDock',
    parameterName: 'PluginOutputs',
};
// the script refreshes its data every 3 s; older data means it is no longer running
export const BRIDGE_STALE_SEC = 15;

export const UNKNOWN_PLATFORM_COLOR = '#9aa0ae';

// matched against the service name from Settings -> Stream ("YouTube - RTMPS") and the server host
export const PLATFORM_RULES: PlatformRuleDto[] = [
    {
        title: 'YouTube',
        color: '#ff4e45',
        services: /youtube/i,
        hosts: [/(^|\.)youtube\.com$/, /(^|\.)youtu\.be$/],
    },
    {
        title: 'Twitch',
        color: '#a970ff',
        services: /twitch/i,
        // Twitch ingests: ingest.global-contribute.live-video.net and regional ones like waw02.contribute.live-video.net
        hosts: [/(^|\.)twitch\.tv$/, /^ingest\.global-contribute\.live-video\.net$/, /^[a-z]{3}\d{2}\.contribute\.live-video\.net$/],
    },
    {
        title: 'Kick',
        color: '#53fc18',
        services: /kick/i,
        hosts: [/(^|\.)kick\.com$/, /^fa723fc1b171\.global-contribute\.live-video\.net$/],
    },
    {
        title: 'VK Видео',
        color: '#2787f5',
        services: /\bvk\b/i,
        hosts: [/(^|\.)(vk\.com|vkvideo\.ru|okcdn\.ru)$/],
    },
    {
        title: 'Rutube',
        color: '#00d1b2',
        services: /rutube/i,
        hosts: [/(^|\.)rutube\.ru$/],
    },
    {
        title: 'Telegram',
        color: '#2aabee',
        services: /telegram/i,
        hosts: [/(^|\.)t\.me$/],
    },
    {
        title: 'Facebook',
        color: '#1877f2',
        services: /facebook/i,
        hosts: [/(^|\.)facebook\.com$/],
    },
    {
        title: 'Trovo',
        color: '#19d65c',
        services: /trovo/i,
        hosts: [/(^|\.)trovo\.live$/],
    },
];

export const MAIN_TAG: TagDto = {
    text: 'Основной',
    hint: 'Площадка из Settings → Stream',
    color: 'blue',
};

export const PLUGIN_TAG: TagDto = {
    text: 'Плагин',
};
