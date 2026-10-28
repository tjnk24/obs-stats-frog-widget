import {formatFixed} from './formatFixed';
import {formatNumber} from './formatNumber';

export const formatMemory = (megabytes: number) => (
    megabytes >= 1024 ? `${formatFixed(megabytes / 1024, 1)} ГБ` : `${formatNumber(Math.round(megabytes))} МБ`
);
