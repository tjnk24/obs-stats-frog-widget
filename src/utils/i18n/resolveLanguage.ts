import type {Nullable} from 'infrastructure/common';

import {LanguageEnum} from '__types/LanguageEnum';
import {OBS_LANGUAGE_PREFIXES} from '__utils/consts';

export const resolveLanguage = (language: Nullable<LanguageEnum>): LanguageEnum => {
    if (language && Object.values(LanguageEnum).includes(language)) {
        return language;
    }

    const obsLanguage = navigator.language.toLowerCase();
    const match = OBS_LANGUAGE_PREFIXES.find(({prefix}) => obsLanguage.startsWith(prefix));

    return match ? match.language : LanguageEnum.En;
};
