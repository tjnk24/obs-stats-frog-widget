import {ObsRequestDto, RequestResultPairDto} from '__utils/types';

// responseData of the first successful request matching `predicate`; null if it failed or was not sent
export const findResultData = <T>(pairs: RequestResultPairDto[], predicate: (request: ObsRequestDto) => boolean) => {
    const pair = pairs.find(({request}) => predicate(request));

    return pair?.result?.requestStatus.result ? pair.result.responseData as T : null;
};

export const isRequestOfType = (requestType: string) => (request: ObsRequestDto) => request.requestType === requestType;
