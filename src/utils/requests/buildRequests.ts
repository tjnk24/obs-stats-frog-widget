import {ObsRequestDto} from '__types/obs/requests/ObsRequestDto';
import {ObsRequestTypeEnum} from '__types/obs/requests/ObsRequestTypeEnum';
import {StreamTargetDto} from '__types/targets/StreamTargetDto';
import {BRIDGE_PARAMETER} from '__utils/consts';

const {
    GetStats,
    GetStreamStatus,
    GetOutputStatus,
    GetStreamServiceSettings,
    GetOutputList,
    GetProfileParameter,
    GetVersion,
} = ObsRequestTypeEnum;

export const buildRequests = (targets: StreamTargetDto[], withDiscovery: boolean): ObsRequestDto[] => {
    const requests: ObsRequestDto[] = [
        {requestType: GetStats},
        {requestType: GetStreamStatus},
        ...targets
            .filter(({outputName}) => outputName !== null)
            .map(({outputName}) => ({requestType: GetOutputStatus, requestData: {outputName}})),
    ];

    if (withDiscovery) {
        requests.push(
            {requestType: GetStreamServiceSettings},
            {requestType: GetOutputList},
            {requestType: GetProfileParameter, requestData: BRIDGE_PARAMETER},
            {requestType: GetVersion},
        );
    }

    return requests;
};
