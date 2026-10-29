import {MockTargetDto} from '__types/MockTargetDto';
import {BYTES_IN_GIGABYTE} from '__utils/consts';

export const MOCK_FPS = 60;
export const MOCK_MAIN_OUTPUT_NAME = 'adv_stream';
export const MOCK_TWITCH_OUTPUT_NAME = 'multi-output';
export const MOCK_TWITCH_SERVER = 'rtmp://ingest.global-contribute.live-video.net';
export const MOCK_TWITCH_DELAY_SEC = 5;

export const MOCK_EXTRA_TARGETS: MockTargetDto[] = [
    {
        outputName: 'kick-output',
        server: 'rtmps://fa723fc1b171.global-contribute.live-video.net:443',
        minKbps: 7600,
        maxKbps: 8200,
    },
    {
        outputName: 'vk-live-output',
        server: 'rtmp://rtmp.vkvideo.ru',
        minKbps: 4700,
        maxKbps: 5100,
    },
];

export const MOCK_GPU = {
    name: 'NVIDIA GeForce RTX 4070 SUPER',
    memoryInBytes: 5.3 * BYTES_IN_GIGABYTE,
    isSharedMemory: false,
};

export const MOCK_SYSTEM_MEMORY = {
    used: 14.2 * BYTES_IN_GIGABYTE,
    total: 31.9 * BYTES_IN_GIGABYTE,
};
