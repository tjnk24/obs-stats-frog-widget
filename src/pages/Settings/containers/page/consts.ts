import {SelectProps} from 'antd';

import {LanguageEnum} from '__types/i18n/LanguageEnum';

export const LANGUAGE_OPTIONS: NonNullable<SelectProps<LanguageEnum>['options']> = [
    {value: LanguageEnum.En, label: 'English'},
    {value: LanguageEnum.Ru, label: 'Русский'},
    {value: LanguageEnum.Es, label: 'Español'},
    {value: LanguageEnum.De, label: 'Deutsch'},
    {value: LanguageEnum.PtBr, label: 'Português (Brasil)'},
    {value: LanguageEnum.Frog, label: 'Жабий'},
];
