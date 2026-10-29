import type {Nullable} from 'infrastructure/common';

import {ObsRequestTypeEnum} from '__types/ObsRequestTypeEnum';
import {ObsVersionDto} from '__types/ObsVersionDto';
import {RequestResultPairDto} from '__types/RequestResultPairDto';

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
