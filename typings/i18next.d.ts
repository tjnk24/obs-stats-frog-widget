import 'i18next';

import {TranslationResourcesDto} from '../src/types/i18n/TranslationResourcesDto';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: TranslationResourcesDto;
    }
}
