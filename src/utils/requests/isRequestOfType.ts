import {ObsRequestDto} from '__types/ObsRequestDto';

export const isRequestOfType = (requestType: string) => (request: ObsRequestDto) => request.requestType === requestType;
