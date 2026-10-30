import requirements from '../../../config/compatibility.json' with {type: 'json'};
import {VERSION} from '../consts.ts';

import {readNumberFromSource} from './readNumberFromSource.ts';
import {readRequiredRequests} from './readRequiredRequests.ts';

export const buildCompatibility = () => ({
    version: VERSION,
    minObsVersion: requirements.minObsVersion,
    obsWebSocketRpcVersion: readNumberFromSource('src/utils/consts.ts', /OBS_RPC_VERSION\s*=\s*(\d+)/),
    minChromiumVersion: requirements.minChromiumVersion,
    minBridgeVersion: readNumberFromSource('obs-script/obs-stats-bridge/consts.lua', /BRIDGE_VERSION\s*=\s*(\d+)/),
    requiredRequests: readRequiredRequests(),
});
