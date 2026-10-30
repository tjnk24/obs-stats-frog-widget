import type {Nullable} from 'infrastructure/common';

import {ObsRequestDto} from '__types/obs/requests/ObsRequestDto';
import {ObsRequestTypeEnum} from '__types/obs/requests/ObsRequestTypeEnum';

const {GetStreamStatus, GetOutputStatus} = ObsRequestTypeEnum;

export const isStatusRequestOf = (outputName: Nullable<string>) => ({requestType, requestData}: ObsRequestDto) => (
    outputName === null
        ? requestType === GetStreamStatus
        : requestType === GetOutputStatus && requestData?.outputName === outputName
);
