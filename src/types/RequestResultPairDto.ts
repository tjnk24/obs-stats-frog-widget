import {ObsRequestDto} from './ObsRequestDto';
import {ObsRequestResultDto} from './ObsRequestResultDto';

export type RequestResultPairDto = {
    request: ObsRequestDto;
    result?: ObsRequestResultDto;
};
