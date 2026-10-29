import 'i18next';

import {TranslationDto} from '../src/types/TranslationDto';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {translation: TranslationDto};
    }
}
