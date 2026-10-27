import {ObsRequestDto} from './ObsRequestDto';

export type InFlightBatchDto = {
    id: string;
    since: number;
    requests: ObsRequestDto[];
};
