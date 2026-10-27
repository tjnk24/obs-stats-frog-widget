import {MAIN_TAG, PLUGIN_TAG} from '__utils/consts';
import {
    OutputOriginEnum,
    StreamTargetDto,
    TagDto,
} from '__utils/types';

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
