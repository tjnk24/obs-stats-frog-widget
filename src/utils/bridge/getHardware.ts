import {HardwareDto} from '__types/HardwareDto';
import {ObsProfileParameterDto} from '__types/ObsProfileParameterDto';
import {ObsRequestTypeEnum} from '__types/ObsRequestTypeEnum';
import {RequestResultPairDto} from '__types/RequestResultPairDto';
import {findResultData} from '__utils/requests/findResultData';
import {isRequestOfType} from '__utils/requests/isRequestOfType';

import {parseBridgeData} from './parseBridgeData';

export const getHardware = (pairs: RequestResultPairDto[]): HardwareDto => {
    const bridgeData = parseBridgeData(findResultData<ObsProfileParameterDto>(pairs, isRequestOfType(ObsRequestTypeEnum.GetProfileParameter)));

    return {
        gpu: bridgeData?.gpu ?? null,
        systemMemory: bridgeData?.systemMemory ?? null,
    };
};
