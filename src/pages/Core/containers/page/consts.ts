import {Locale} from 'antd/es/locale';
import deDE from 'antd/locale/de_DE';
import enUS from 'antd/locale/en_US';
import esES from 'antd/locale/es_ES';
import ptBR from 'antd/locale/pt_BR';
import ruRU from 'antd/locale/ru_RU';

import {LanguageEnum} from '__types/LanguageEnum';

export const ANTD_LOCALES: Record<LanguageEnum, Locale> = {
    [LanguageEnum.En]: enUS,
    [LanguageEnum.Ru]: ruRU,
    [LanguageEnum.Es]: esES,
    [LanguageEnum.De]: deDE,
    [LanguageEnum.PtBr]: ptBR,
    [LanguageEnum.Frog]: ruRU,
};
