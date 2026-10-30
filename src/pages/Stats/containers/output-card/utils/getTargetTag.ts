import {t} from 'i18next';

import {OutputOriginEnum} from '__types/targets/OutputOriginEnum';
import {StreamTargetDto} from '__types/targets/StreamTargetDto';

import {TagDto} from '../../../types';

export const getTargetTag = ({origin, pluginName, outputName}: StreamTargetDto): TagDto => {
    if (origin === OutputOriginEnum.Main) {
        return {
            text: t('stats.mainTag'),
            hint: t('stats.mainTagHint'),
            color: 'blue',
        };
    }

    const pluginTag = t('stats.pluginTag');

    return {
        text: pluginName ? `${pluginTag} · ${pluginName}` : pluginTag,
        hint: t('stats.pluginTagHint', {name: outputName}),
    };
};
