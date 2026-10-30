import {GpuStatsDto} from './GpuStatsDto';
import {SystemMemoryDto} from './SystemMemoryDto';

export type BridgeDataDto = {
    bridgeVersion?: number;
    updated: number;
    outputs: {
        name: string;
        server: string;
    }[];
    gpu?: GpuStatsDto;
    systemMemory?: SystemMemoryDto;
};
