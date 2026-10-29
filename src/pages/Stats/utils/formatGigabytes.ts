import {BYTES_IN_GIGABYTE} from '__utils/consts';

import {formatFixed} from './formatFixed';

export const formatGigabytes = (bytes: number) => formatFixed(bytes / BYTES_IN_GIGABYTE, 1);
