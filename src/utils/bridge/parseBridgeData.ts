import type {Nullable} from 'infrastructure/common';

import {BridgeDataDto} from '__types/BridgeDataDto';
import {ObsProfileParameterDto} from '__types/ObsProfileParameterDto';
import {BRIDGE_STALE_SEC} from '__utils/consts';

export const parseBridgeData = (parameter: Nullable<ObsProfileParameterDto>): Nullable<BridgeDataDto> => {
    try {
        const data = JSON.parse(parameter?.parameterValue ?? '') as BridgeDataDto;

        if ((Date.now() / 1000) - data.updated > BRIDGE_STALE_SEC) {
            return null;
        }

        return data;
    } catch {
        return null;
    }
};
