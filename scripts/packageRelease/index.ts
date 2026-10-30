import path from 'node:path';

import {buildCompatibility} from './buildCompatibility.ts';
import {PACKAGE_DIRECTORY, ROOT_DIRECTORY} from './consts.ts';
import {copyReleaseFiles} from './copyReleaseFiles.ts';
import {writeCompatibility} from './writeCompatibility.ts';
import {writeReadme} from './writeReadme.ts';

const compatibility = buildCompatibility();

copyReleaseFiles();
writeReadme();

const compatibilityJson = writeCompatibility(compatibility);

console.log(`Packaged ${path.relative(ROOT_DIRECTORY, PACKAGE_DIRECTORY)}`);
console.log(compatibilityJson);
