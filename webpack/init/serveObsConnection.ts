import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type {Request, Response} from 'webpack-dev-server';

const OBS_CONFIG_DIRECTORIES: Partial<Record<NodeJS.Platform, string>> = {
    win32: path.join(process.env.APPDATA || '', 'obs-studio'),
    darwin: path.join(os.homedir(), 'Library', 'Application Support', 'obs-studio'),
};

const OBS_WEBSOCKET_CONFIG_PATH = path.join(
    OBS_CONFIG_DIRECTORIES[process.platform] || path.join(os.homedir(), '.config', 'obs-studio'),
    'plugin_config',
    'obs-websocket',
    'config.json',
);

export const serveObsConnection = (_request: Request, response: Response) => {
    try {
        const config = JSON.parse(fs.readFileSync(OBS_WEBSOCKET_CONFIG_PATH, 'utf8'));

        response.json({
            port: config.server_port,
            password: config.auth_required ? config.server_password : null,
        });
    } catch {
        response.status(404).end();
    }
};
