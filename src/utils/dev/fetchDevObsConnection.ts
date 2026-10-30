import type {Nullable} from 'infrastructure/common';

import {DevObsConnectionDto} from '__types/connection/DevObsConnectionDto';
import {DEV_OBS_CONNECTION_URL} from '__utils/consts';

export const fetchDevObsConnection = async (): Promise<Nullable<DevObsConnectionDto>> => {
    try {
        const response = await fetch(DEV_OBS_CONNECTION_URL);

        return response.ok ? await response.json() as DevObsConnectionDto : null;
    } catch {
        return null;
    }
};
