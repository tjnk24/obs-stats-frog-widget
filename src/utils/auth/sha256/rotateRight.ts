export const rotateRight = (word: number, bits: number) => (word >>> bits) | (word << (32 - bits));
