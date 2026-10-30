import {BridgeOutputDto} from './BridgeOutputDto';
import {GpuStatsDto} from './GpuStatsDto';
import {SystemMemoryDto} from './SystemMemoryDto';

export type BridgeDataDto = {
    bridgeVersion?: number;
    updated: number;
    outputs: BridgeOutputDto[];
    gpu?: GpuStatsDto;
    systemMemory?: SystemMemoryDto;
};
