import i18n from 'i18next';
import type {Nullable} from 'infrastructure/common';

import {commonActions} from '__actions';
import {LanguageEnum} from '__types/i18n/LanguageEnum';
import {OBS_LANGUAGE_PREFIXES} from '__utils/consts';

class LanguageService {
    resolveLanguage = (language: Nullable<LanguageEnum>): LanguageEnum => {
        if (language && Object.values(LanguageEnum).includes(language)) {
            return language;
        }

        const obsLanguage = navigator.language.toLowerCase();
        const match = OBS_LANGUAGE_PREFIXES.find(({prefix}) => obsLanguage.startsWith(prefix));

        return match ? match.language : LanguageEnum.En;
    };

    setLanguage = async (language: LanguageEnum) => {
        commonActions.settings.setLanguage(language);

        await i18n.changeLanguage(language);
    };
}

export const languageService = new LanguageService();
