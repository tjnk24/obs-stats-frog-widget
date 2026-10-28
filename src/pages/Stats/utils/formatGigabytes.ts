import {formatFixed} from './formatFixed';

export const formatGigabytes = (bytes: number) => formatFixed(bytes / (1024 ** 3), 1);
