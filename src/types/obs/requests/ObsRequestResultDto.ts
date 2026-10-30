import {ObsRequestStatusDto} from './ObsRequestStatusDto';

export type ObsRequestResultDto<T = unknown> = {
    requestType: string;
    requestStatus: ObsRequestStatusDto;
    responseData?: T;
};
