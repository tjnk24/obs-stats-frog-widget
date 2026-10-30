import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import {languageService} from '__services/languageService';
import {storageService} from '__services/storageService';
import {LanguageEnum} from '__types/i18n/LanguageEnum';

import {de} from './locales/de';
import {en} from './locales/en';
import {es} from './locales/es';
import {frog} from './locales/frog';
import {ptBr} from './locales/ptBr';
import {ru} from './locales/ru';

void i18n.use(initReactI18next).init({
    resources: {
        [LanguageEnum.En]: {translation: en},
        [LanguageEnum.Ru]: {translation: ru},
        [LanguageEnum.Es]: {translation: es},
        [LanguageEnum.De]: {translation: de},
        [LanguageEnum.PtBr]: {translation: ptBr},
        [LanguageEnum.Frog]: {translation: frog},
    },
    lng: languageService.resolveLanguage(storageService.loadSettings().language),
    fallbackLng: LanguageEnum.En,
    interpolation: {escapeValue: false},
    initAsync: false,
});

document.documentElement.lang = i18n.language;

i18n.on('languageChanged', language => {
    document.documentElement.lang = language;
});

import.meta.webpackHot?.decline();
