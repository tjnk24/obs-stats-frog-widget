import {ObsRequestDto} from '../requests/ObsRequestDto';

export type InFlightBatchDto = {
    id: string;
    since: number;
    requests: ObsRequestDto[];
};
