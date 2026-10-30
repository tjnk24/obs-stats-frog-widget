import fs from 'node:fs';
import path from 'node:path';

import {
    PACKAGE_DIRECTORY,
    README_TEMPLATE_PATH,
    VERSION,
} from './consts.ts';

export const writeReadme = () => {
    const readme = fs.readFileSync(README_TEMPLATE_PATH, 'utf8')
        .replaceAll('{{version}}', VERSION)
        .replace(/\r?\n/g, '\r\n');

    fs.writeFileSync(path.join(PACKAGE_DIRECTORY, 'README.txt'), readme);
};
