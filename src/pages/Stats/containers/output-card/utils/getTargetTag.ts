import {OutputOriginEnum} from '__types/OutputOriginEnum';
import {StreamTargetDto} from '__types/StreamTargetDto';

import {TagDto} from '../../../types';
import {MAIN_TAG, PLUGIN_TAG} from '../consts';

export const getTargetTag = ({origin, pluginName, outputName}: StreamTargetDto): TagDto => {
    if (origin === OutputOriginEnum.Main) {
        return MAIN_TAG;
    }

    return {
        ...PLUGIN_TAG,
        text: pluginName ? `${PLUGIN_TAG.text} · ${pluginName}` : PLUGIN_TAG.text,
        hint: `Выход плагина «${outputName}»`,
    };
};
