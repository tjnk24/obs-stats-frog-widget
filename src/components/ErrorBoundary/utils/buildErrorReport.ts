import type {Nullable} from 'infrastructure/common';

import {buildEnvironmentLines} from '__utils/diagnostics/buildEnvironmentLines';

export const buildErrorReport = (error: Error, componentStack: Nullable<string> | undefined) => [
    ...buildEnvironmentLines(),
    `Page: ${window.location.hash || '#/'}`,
    `Time: ${new Date().toISOString()}`,
    '',
    error.stack ?? `${error.name}: ${error.message}`,
    '',
    'Component stack:',
    componentStack?.trim() ?? '',
].join('\n');
