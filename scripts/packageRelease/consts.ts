import path from 'node:path';

import packageJson from '../../package.json' with {type: 'json'};

export const VERSION = packageJson.version;

export const ROOT_DIRECTORY = path.resolve(import.meta.dirname, '../..');

export const RELEASE_DIRECTORY = path.join(ROOT_DIRECTORY, 'release');

export const PACKAGE_DIRECTORY = path.join(RELEASE_DIRECTORY, `obs-stats-widget-${VERSION}`);

export const README_TEMPLATE_PATH = path.join(import.meta.dirname, 'README.template.txt');
