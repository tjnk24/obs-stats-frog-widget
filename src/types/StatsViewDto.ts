import {GeneralViewDto} from './GeneralViewDto';
import {OutputViewDto} from './OutputViewDto';

export type StatsViewDto = {
    outputs: Record<string, OutputViewDto>;
    general: GeneralViewDto | null;
    now: number;
};
