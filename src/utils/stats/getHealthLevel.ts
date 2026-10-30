import {HealthLevelEnum} from '__types/stats/views/HealthLevelEnum';
import {BAD_DROP_SHARE} from '__utils/consts';

const {Ok, Warn, Bad} = HealthLevelEnum;

export const getHealthLevel = (recentDropped: number, recentTotal: number) => {
    if (recentDropped === 0) {
        return Ok;
    }

    return recentTotal > 0 && recentDropped / recentTotal >= BAD_DROP_SHARE ? Bad : Warn;
};
