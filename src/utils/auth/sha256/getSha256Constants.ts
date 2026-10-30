import {Sha256ConstantsDto} from '__types/connection/Sha256ConstantsDto';

import {
    HASH_WORD_COUNT,
    ROUND_COUNT,
    UINT32_RANGE,
} from './consts';

export const getSha256Constants = (): Sha256ConstantsDto => {
    const roundConstants: number[] = [];
    const initialHash: number[] = [];

    for (let candidate = 2, primesFound = 0; primesFound < ROUND_COUNT; candidate++) {
        let isPrime = true;

        for (let divisor = 2; divisor * divisor <= candidate; divisor++) {
            if (candidate % divisor === 0) {
                isPrime = false;
                break;
            }
        }

        if (!isPrime) {
            continue;
        }

        if (primesFound < HASH_WORD_COUNT) {
            initialHash[primesFound] = ((Math.pow(candidate, 1 / 2) % 1) * UINT32_RANGE) | 0;
        }

        roundConstants[primesFound++] = ((Math.pow(candidate, 1 / 3) % 1) * UINT32_RANGE) | 0;
    }

    return {roundConstants, initialHash};
};
