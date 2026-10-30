import fs from 'node:fs';
import path from 'node:path';

import {ROOT_DIRECTORY} from './consts.ts';

export const readSourceFile = (relativePath: string) => fs.readFileSync(path.join(ROOT_DIRECTORY, relativePath), 'utf8');
