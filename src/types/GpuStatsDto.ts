import type {Nullable} from 'infrastructure/common';

export type GpuStatsDto = {
    // as the driver names it; null when Windows did not tell
    name?: Nullable<string>;
    // percent of the busiest 3D engine
    usage: number;
    // percent of the hardware encoder: NVENC, AMF, Quick Sync
    encoder: number;
    // bytes; for integrated graphics the system memory Windows gave to it
    memory: number;
    isSharedMemory: boolean;
};
