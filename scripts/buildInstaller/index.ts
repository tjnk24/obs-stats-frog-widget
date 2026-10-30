import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import {
    PACKAGE_DIRECTORY,
    RELEASE_DIRECTORY,
    ROOT_DIRECTORY,
    VERSION,
} from '../packageRelease/consts.ts';

import {findCompiler} from './findCompiler.ts';

if (!fs.existsSync(PACKAGE_DIRECTORY)) {
    throw new Error(`${path.relative(ROOT_DIRECTORY, PACKAGE_DIRECTORY)} is missing, run npm run package:release first`);
}

const result = spawnSync(findCompiler(), [
    '/Qp',
    `/DAppVersion=${VERSION}`,
    `/DPackageDir=${PACKAGE_DIRECTORY}`,
    `/DOutputDir=${RELEASE_DIRECTORY}`,
    path.join(ROOT_DIRECTORY, 'installer', 'obs-stats-widget.iss'),
], {stdio: 'inherit'});

if (result.status !== 0) {
    throw new Error(`Inno Setup failed with exit code ${result.status}`);
}

console.log(`Built ${path.relative(ROOT_DIRECTORY, path.join(RELEASE_DIRECTORY, `obs-stats-widget-setup-${VERSION}.exe`))}`);
