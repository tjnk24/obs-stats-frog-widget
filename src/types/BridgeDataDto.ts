import {GpuStatsDto} from './GpuStatsDto';
import {SystemMemoryDto} from './SystemMemoryDto';

export type BridgeDataDto = {
    updated: number;
    outputs: {
        name: string;
        server: string;
    }[];
    gpu?: GpuStatsDto;
    systemMemory?: SystemMemoryDto;
};
