import type {Nullable} from 'infrastructure/common';

import {LanguageEnum} from './LanguageEnum';

export type SettingsDto = {
    port: number;
    isShowGeneralCard: boolean;
    language: Nullable<LanguageEnum>;
    isMockEnabled: boolean;
};
