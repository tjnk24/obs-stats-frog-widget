import {BRIDGE_PARAMETER} from '__utils/consts';
import {
    ObsRequestDto,
    ObsRequestTypeEnum,
    StreamTargetDto,
} from '__utils/types';

const {
    GetStats,
    GetStreamStatus,
    GetOutputStatus,
    GetStreamServiceSettings,
    GetOutputList,
    GetProfileParameter,
} = ObsRequestTypeEnum;

// stats of every known output each poll; with `withDiscovery` also what decides which outputs there are
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
        );
    }

    return requests;
};
