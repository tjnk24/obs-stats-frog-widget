import {OutputOriginEnum} from '__types/OutputOriginEnum';
import {StreamTargetDto} from '__types/StreamTargetDto';

export const describeTarget = ({origin, outputName, pluginName, platform}: StreamTargetDto) => {
    if (origin === OutputOriginEnum.Main) {
        return `- ${platform.title}: main output`;
    }

    return `- ${platform.title}: plugin output "${outputName}"${pluginName ? ` (${pluginName})` : ''}`;
};
