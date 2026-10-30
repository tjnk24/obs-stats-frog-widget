import {ObsRequestResultDto} from '__types/obs/requests/ObsRequestResultDto';

export const failureResult = (requestType: string, code: number): ObsRequestResultDto => ({
    requestType,
    requestStatus: {result: false, code},
});
