import fs from 'node:fs';
import path from 'node:path';

const COMPILER_LOCATIONS = [
    process.env.ISCC_PATH,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'Inno Setup 6', 'ISCC.exe'),
    process.env['ProgramFiles(x86)'] && path.join(process.env['ProgramFiles(x86)'], 'Inno Setup 6', 'ISCC.exe'),
    process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'Inno Setup 6', 'ISCC.exe'),
];

export const findCompiler = () => {
    const compiler = COMPILER_LOCATIONS.find(location => location && fs.existsSync(location));

    if (!compiler) {
        throw new Error('Inno Setup 6 is not found. Install it (winget install JRSoftware.InnoSetup) or set ISCC_PATH');
    }

    return compiler;
};
