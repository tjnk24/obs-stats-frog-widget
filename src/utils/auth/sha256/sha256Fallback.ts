import {
    BLOCK_BYTES,
    DIGEST_BYTES,
    ROUND_COUNT,
} from './consts';
import {rotateRight} from './rotateRight';
import {initialHash, roundConstants} from './sha256Tables';

export const sha256Fallback = (bytes: Uint8Array) => {
    const messageLength = bytes.length;
    const padded = new Uint8Array(Math.ceil((messageLength + 9) / BLOCK_BYTES) * BLOCK_BYTES);

    padded.set(bytes);
    padded[messageLength] = 0x80;

    const paddedView = new DataView(padded.buffer);

    paddedView.setUint32(padded.length - 8, Math.floor(messageLength / 0x20000000));
    paddedView.setUint32(padded.length - 4, (messageLength * 8) >>> 0);

    const hash = initialHash.slice();
    const schedule = new Int32Array(ROUND_COUNT);

    for (let blockStart = 0; blockStart < padded.length; blockStart += BLOCK_BYTES) {
        for (let wordIndex = 0; wordIndex < 16; wordIndex++) {
            schedule[wordIndex] = paddedView.getInt32(blockStart + (wordIndex * 4));
        }

        for (let wordIndex = 16; wordIndex < ROUND_COUNT; wordIndex++) {
            const olderWord = schedule[wordIndex - 15];
            const recentWord = schedule[wordIndex - 2];
            const olderMix = rotateRight(olderWord, 7) ^ rotateRight(olderWord, 18) ^ (olderWord >>> 3);
            const recentMix = rotateRight(recentWord, 17) ^ rotateRight(recentWord, 19) ^ (recentWord >>> 10);

            // Int32Array wraps the sum to 32 bits
            schedule[wordIndex] = schedule[wordIndex - 16] + olderMix + schedule[wordIndex - 7] + recentMix;
        }

        // the standard's working variables a..h
        const workingState = hash.slice();

        for (let round = 0; round < ROUND_COUNT; round++) {
            const [first, second, third, , fifth, sixth, seventh, eighth] = workingState;

            const fifthMix = rotateRight(fifth, 6) ^ rotateRight(fifth, 11) ^ rotateRight(fifth, 25);
            const choice = (fifth & sixth) ^ (~fifth & seventh);
            const firstSum = (eighth + fifthMix + choice + roundConstants[round] + schedule[round]) | 0;

            const firstMix = rotateRight(first, 2) ^ rotateRight(first, 13) ^ rotateRight(first, 22);
            const majority = (first & second) ^ (first & third) ^ (second & third);
            const secondSum = (firstMix + majority) | 0;

            // every variable moves one place down; the new first one is both sums,
            // the new fifth one is the old fourth plus the first sum
            workingState.pop();
            workingState.unshift((firstSum + secondSum) | 0);
            workingState[4] = (workingState[4] + firstSum) | 0;
        }

        workingState.forEach((value, wordIndex) => {
            hash[wordIndex] = (hash[wordIndex] + value) | 0;
        });
    }

    const digest = new Uint8Array(DIGEST_BYTES);
    const digestView = new DataView(digest.buffer);

    hash.forEach((word, wordIndex) => digestView.setInt32(wordIndex * 4, word));

    return digest;
};
