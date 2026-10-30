import {readSourceFile} from './readSourceFile.ts';

export const readNumberFromSource = (relativePath: string, pattern: RegExp) => {
    const match = readSourceFile(relativePath).match(pattern);

    if (!match) {
        throw new Error(`${pattern} not found in ${relativePath}`);
    }

    return Number(match[1]);
};
