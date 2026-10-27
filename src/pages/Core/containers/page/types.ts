import {ObsRequestDto, ObsRequestResultDto} from '__utils/types';

export type LoginStateDto = {
    message: string;
    isError?: boolean;
};

export type UseObsConnectionParams = {
    port: number;
    // what to ask in the poll number `pollIndex` (counted from 0 after every connect)
    getRequests: (pollIndex: number) => ObsRequestDto[];
    onBatchResults: (requests: ObsRequestDto[], results: ObsRequestResultDto[]) => void;
};
