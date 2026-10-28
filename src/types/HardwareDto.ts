import type {Nullable} from 'infrastructure/common';

import {GpuStatsDto} from './GpuStatsDto';
import {SystemMemoryDto} from './SystemMemoryDto';

// from obs-stats-bridge.lua; null while the script is not running or the system gives no such data
export type HardwareDto = {
    gpu: Nullable<GpuStatsDto>;
    systemMemory: Nullable<SystemMemoryDto>;
};
