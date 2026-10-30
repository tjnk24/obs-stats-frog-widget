import type {Nullable} from 'infrastructure/common';

import {GpuStatsDto} from './GpuStatsDto';
import {SystemMemoryDto} from './SystemMemoryDto';

export type HardwareDto = {
    gpu: Nullable<GpuStatsDto>;
    systemMemory: Nullable<SystemMemoryDto>;
};
