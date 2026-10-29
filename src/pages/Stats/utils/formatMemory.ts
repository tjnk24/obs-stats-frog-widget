import {t} from 'i18next';

import {formatFixed} from './formatFixed';
import {formatNumber} from './formatNumber';

export const formatMemory = (megabytes: number) => (
    megabytes >= 1024
        ? t('units.gigabytes', {value: formatFixed(megabytes / 1024, 1)})
        : t('units.megabytes', {value: formatNumber(Math.round(megabytes))})
);
