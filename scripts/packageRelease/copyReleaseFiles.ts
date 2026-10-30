import fs from 'node:fs';
import path from 'node:path';

import {
    PACKAGE_DIRECTORY,
    RELEASE_DIRECTORY,
    ROOT_DIRECTORY,
} from './consts.ts';

export const copyReleaseFiles = () => {
    fs.rmSync(RELEASE_DIRECTORY, {recursive: true, force: true});
    fs.mkdirSync(PACKAGE_DIRECTORY, {recursive: true});

    fs.cpSync(path.join(ROOT_DIRECTORY, 'build'), path.join(PACKAGE_DIRECTORY, 'dock'), {recursive: true});
    fs.copyFileSync(path.join(ROOT_DIRECTORY, 'obs-script', 'obs-stats-bridge.lua'), path.join(PACKAGE_DIRECTORY, 'obs-stats-bridge.lua'));
    fs.copyFileSync(path.join(ROOT_DIRECTORY, 'LICENSE'), path.join(PACKAGE_DIRECTORY, 'LICENSE'));
};
