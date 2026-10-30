const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const {version} = require('../package.json');
const requirements = require('../config/compatibility.json');

const readSource = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const matchNumber = (relativePath, pattern) => {
    const match = readSource(relativePath).match(pattern);

    if (!match) {
        throw new Error(`${pattern} not found in ${relativePath}`);
    }

    return Number(match[1]);
};

const requiredRequests = [...readSource('src/types/ObsRequestTypeEnum.ts').matchAll(/=\s*'(\w+)'/g)].map(([, requestType]) => requestType);

const compatibility = {
    version,
    minObsVersion: requirements.minObsVersion,
    obsWebSocketRpcVersion: matchNumber('src/utils/consts.ts', /OBS_RPC_VERSION\s*=\s*(\d+)/),
    minChromiumVersion: requirements.minChromiumVersion,
    minBridgeVersion: matchNumber('obs-script/obs-stats-bridge.lua', /local BRIDGE_VERSION\s*=\s*(\d+)/),
    requiredRequests,
};

const releaseDirectory = path.join(root, 'release');
const packageDirectory = path.join(releaseDirectory, `obs-stats-widget-${version}`);

fs.rmSync(releaseDirectory, {recursive: true, force: true});
fs.mkdirSync(packageDirectory, {recursive: true});
fs.cpSync(path.join(root, 'build'), path.join(packageDirectory, 'dock'), {recursive: true});
fs.copyFileSync(path.join(root, 'obs-script', 'obs-stats-bridge.lua'), path.join(packageDirectory, 'obs-stats-bridge.lua'));
fs.copyFileSync(path.join(root, 'LICENSE'), path.join(packageDirectory, 'LICENSE'));
fs.writeFileSync(path.join(packageDirectory, 'compatibility.json'), `${JSON.stringify(compatibility, null, 4)}\n`);
fs.writeFileSync(path.join(releaseDirectory, 'compatibility.json'), `${JSON.stringify(compatibility, null, 4)}\n`);
fs.writeFileSync(path.join(packageDirectory, 'README.txt'), [
    `obs-stats-widget ${version}`,
    '',
    '1. Copy this folder somewhere permanent, for example %LOCALAPPDATA%\obs-stats-widget.',
    '2. OBS: Docks -> Custom Browser Docks. Add a dock with the URL file:///<folder>/dock/index.html',
    '3. OBS: Tools -> WebSocket Server Settings. Enable the server and note the port and password.',
    '4. OBS: Tools -> Scripts. Add obs-stats-bridge.lua (needed for obs-multi-rtmp outputs, GPU and memory).',
    '',
    'Full guide: https://github.com/tjnk24/obs-stats-widget#readme',
    '',
].join('\r\n'));

console.log(`Packaged ${path.relative(root, packageDirectory)}`);
console.log(JSON.stringify(compatibility, null, 4));
