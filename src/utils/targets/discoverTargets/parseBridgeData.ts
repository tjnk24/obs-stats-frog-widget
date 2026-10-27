import type {Nullable} from 'infrastructure/common';

import {BridgeDataDto} from '__types/BridgeDataDto';
import {ObsProfileParameterDto} from '__types/ObsProfileParameterDto';
import {BRIDGE_STALE_SEC} from '__utils/consts';

export const parseBridgeData = (parameter: Nullable<ObsProfileParameterDto>): Nullable<Map<string, string>> => {
    try {
        const data = JSON.parse(parameter?.parameterValue) as BridgeDataDto;

        if ((Date.now() / 1000) - data.updated > BRIDGE_STALE_SEC) {
            return null;
        }

        return new Map(data.outputs.map(({name, server}) => [name, server]));
    } catch {
        return null;
    }
};
