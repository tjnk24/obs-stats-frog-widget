import type {Nullable} from 'infrastructure/common';

import {ObsRequestDto} from '__types/ObsRequestDto';
import {ObsRequestTypeEnum} from '__types/ObsRequestTypeEnum';

const {GetStreamStatus, GetOutputStatus} = ObsRequestTypeEnum;

export const isStatusRequestOf = (outputName: Nullable<string>) => ({requestType, requestData}: ObsRequestDto) => (
    outputName === null
        ? requestType === GetStreamStatus
        : requestType === GetOutputStatus && requestData?.outputName === outputName
);
