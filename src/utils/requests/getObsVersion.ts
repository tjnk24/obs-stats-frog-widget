import type {Nullable} from 'infrastructure/common';

import {ObsRequestTypeEnum} from '__types/obs/requests/ObsRequestTypeEnum';
import {RequestResultPairDto} from '__types/obs/requests/RequestResultPairDto';
import {ObsVersionDto} from '__types/obs/responses/ObsVersionDto';

import {findResultData} from './findResultData';
import {isRequestOfType} from './isRequestOfType';

export const getObsVersion = (pairs: RequestResultPairDto[]): Nullable<ObsVersionDto> => {
    const data = findResultData<ObsVersionDto>(pairs, isRequestOfType(ObsRequestTypeEnum.GetVersion));

    return data
        ? {
            obsVersion: data.obsVersion,
            obsWebSocketVersion: data.obsWebSocketVersion,
            platformDescription: data.platformDescription,
        }
        : null;
};
