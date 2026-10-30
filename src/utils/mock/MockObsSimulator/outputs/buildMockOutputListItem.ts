import {ObsOutputListItemDto} from '__types/obs/responses/outputs/ObsOutputListItemDto';

export const buildMockOutputListItem = (outputName: string, isActive: boolean): ObsOutputListItemDto => ({
    outputName,
    outputKind: 'rtmp_output',
    outputActive: isActive,
    outputFlags: {
        OBS_OUTPUT_VIDEO: true,
        OBS_OUTPUT_AUDIO: true,
        OBS_OUTPUT_ENCODED: true,
        OBS_OUTPUT_SERVICE: true,
    },
});
