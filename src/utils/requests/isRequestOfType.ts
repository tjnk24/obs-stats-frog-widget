import {ObsRequestDto} from '__types/obs/requests/ObsRequestDto';

export const isRequestOfType = (requestType: string) => (request: ObsRequestDto) => request.requestType === requestType;
