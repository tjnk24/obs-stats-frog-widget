import type {Nullable} from 'infrastructure/common';

export type GpuStatsDto = {
    name?: Nullable<string>;
    usage: number;
    encoder: number;
    memoryInBytes: number;
    isSharedMemory: boolean;
};
