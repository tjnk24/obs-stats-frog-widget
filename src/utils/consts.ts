import {HealthLevelEnum} from '__types/HealthLevelEnum';
import {OutputViewDto} from '__types/OutputViewDto';
import {PlatformRuleDto} from '__types/PlatformRuleDto';
import {SettingsDto} from '__types/SettingsDto';

const DEFAULT_OBS_WEBSOCKET_PORT = 4455;
export const OBS_WEBSOCKET_PROTOCOL = 'obswebsocket.json';
export const OBS_RPC_VERSION = 1;
export const AUTHENTICATION_FAILED_CLOSE_CODE = 4009;

export const POLL_INTERVAL_MS = 1000;
export const REQUEST_TIMEOUT_MS = 5000;
export const RECONNECT_INTERVAL_MS = 3000;
export const GRAPH_SPAN_SEC = 120;
export const RECENT_WINDOW_SEC = 60;
export const DISCOVERY_EVERY_POLLS = 5;

export const BAD_DROP_SHARE = 0.01;

export const PASSWORD_STORAGE_KEY = 'obs-stats-dock.password';
export const SETTINGS_STORAGE_KEY = 'obs-stats-dock.settings';

export const DEFAULT_SETTINGS: SettingsDto = {
    port: DEFAULT_OBS_WEBSOCKET_PORT,
    isShowGeneralCard: true,
};

export const CONNECTING_WORDING = 'Подключение к OBS...';

export const MAIN_TARGET_KEY = 'main';
export const MAIN_OUTPUT_NAMES = ['adv_stream', 'simple_stream'];
export const PLUGIN_OUTPUT_NAMES: Record<string, string> = {
    'multi-output': 'multi-rtmp',
};

export const BRIDGE_SCRIPT_NAME = 'obs-stats-bridge.lua';
export const BRIDGE_PARAMETER = {
    parameterCategory: 'ObsStatsDock',
    parameterName: 'PluginOutputs',
};
export const BRIDGE_STALE_SEC = 15;

export const UNKNOWN_PLATFORM_COLOR = '#9aa0ae';
export const MAIN_FALLBACK_TITLE = 'Трансляция';
export const UNKNOWN_PLATFORM_TITLE = 'Неизвестная площадка';

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
        hosts: [/(^|\.)twitch\.tv$/, /^ingest\.global-contribute\.live-video\.net$/, /^[a-z]{3}\d{2}\.contribute\.live-video\.net$/],
    },
    {
        title: 'Kick',
        color: '#53fc18',
        services: /kick/i,
        hosts: [/(^|\.)kick\.com$/, /^fa723fc1b171\.global-contribute\.live-video\.net$/],
    },
    {
        title: 'VK Video Live',
        color: '#0077ff',
        services: /vk\s*(video\s*)?live|vk\s*play/i,
        hosts: [/^rtmp\.vkvideo\.ru$/, /(^|\.)vk\.me$/],
    },
    {
        title: 'VK Видео',
        color: '#2787f5',
        services: /\bvk\b/i,
        hosts: [/(^|\.)(vk\.com|vkvideo\.ru|okcdn\.ru|mycdn\.me)$/],
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

export const OFF_OUTPUT_VIEW: OutputViewDto = {
    isActive: false,
    isReconnecting: false,
    level: HealthLevelEnum.Off,
    kbps: null,
    timecode: '',
    dropped: 0,
    total: 0,
    recentDropped: 0,
    recentTotal: 0,
    congestion: 0,
    graph: [],
};
