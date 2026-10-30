import fs from 'node:fs';
import path from 'node:path';

import {PACKAGE_DIRECTORY, RELEASE_DIRECTORY} from './consts.ts';

export const writeCompatibility = (compatibility: object) => {
    const json = `${JSON.stringify(compatibility, null, 4)}\n`;

    fs.writeFileSync(path.join(PACKAGE_DIRECTORY, 'compatibility.json'), json);
    fs.writeFileSync(path.join(RELEASE_DIRECTORY, 'compatibility.json'), json);

    return json;
};
