import {GraphPointDto} from './GraphPointDto';
import {HealthLevelEnum} from './HealthLevelEnum';

export type OutputViewDto = {
    isActive: boolean;
    isReconnecting: boolean;
    level: HealthLevelEnum;
    kbps: number | null;
    timecode: string;
    dropped: number;
    total: number;
    recentDropped: number;
    recentTotal: number;
    congestion: number;
    graph: GraphPointDto[];
};
