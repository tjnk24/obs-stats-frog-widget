import {ObsRequestDto} from '__types/ObsRequestDto';
import {RequestResultPairDto} from '__types/RequestResultPairDto';

export const findResultData = <T>(pairs: RequestResultPairDto[], predicate: (request: ObsRequestDto) => boolean) => {
    const pair = pairs.find(({request}) => predicate(request));

    return pair?.result?.requestStatus.result ? pair.result.responseData as T : null;
};
