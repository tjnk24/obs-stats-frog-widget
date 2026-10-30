import {ObsRequestDto} from '__types/obs/requests/ObsRequestDto';
import {RequestResultPairDto} from '__types/obs/requests/RequestResultPairDto';

export const findResultData = <T>(pairs: RequestResultPairDto[], predicate: (request: ObsRequestDto) => boolean) => {
    const pair = pairs.find(({request}) => predicate(request));

    return pair?.result?.requestStatus.result ? pair.result.responseData as T : null;
};
