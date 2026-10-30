# obs-stats-widget

A dock for [OBS Studio](https://obsproject.com/) that shows live stream stats for every output that is streaming:
the main stream and the extra targets of plugins such as [obs-multi-rtmp](https://github.com/sorayuki/obs-multi-rtmp),
side by side, plus the health of OBS itself.

It talks to OBS through the built-in obs-websocket server, so it needs no plugin of its own.
An optional Lua script adds the platform of plugin outputs, GPU load and system memory.

## Features

- **A card per streaming output.** The main stream from Settings → Stream gets a card, and so does every
  other output that streams to a service, such as an obs-multi-rtmp target.
- **Live bitrate with a two-minute graph** for each output.
- **Network health:** dropped frames in total and over the last minute, network congestion, and a status tag:
  live, losing frames, reconnecting or offline.
- **Platform detection** from the service name or the server address: YouTube, Twitch, Kick, VK Video Live,
  VK Video, Rutube, Telegram, Facebook and Trovo.
- **OBS card:** FPS, frame time, frames skipped by the encoder and missed by the renderer, CPU and OBS memory.
  With the bridge script: GPU load, hardware encoder load, video memory and system memory.
- **Interface in English, Russian, Spanish, German and Brazilian Portuguese**, picked from the OBS language
  and changeable in the settings.
- **Diagnostics and error reports** that can be copied and attached to an issue.
- **Built-in mock mode** to see the dock with several platforms without streaming.

## Requirements

- OBS Studio 28 or newer (obs-websocket 5 is built in). Developed and tested on OBS 33 on Windows.
- GPU and system memory stats come from Windows performance counters, so they are shown on Windows only.
  Everything else does not depend on the operating system.

## Installation

Ready-made builds are not published yet, so for now the dock is built from source.

1. **Build the dock.** You need [Node.js](https://nodejs.org/) 24 or newer (see `.nvmrc`); Node 25 is not supported by the dev server.

   ```bash
   git clone https://github.com/tjnk24/obs-stats-widget.git
   cd obs-stats-widget
   npm install
   npm run build:prod
   ```

   The dock is now in the `build` folder.

2. **Turn on obs-websocket.** In OBS, open Tools → WebSocket Server Settings, enable the server and keep
   the window open: you will need the port and the password from Show Connect Info.

3. **Add the dock.** Open Docks → Custom Browser Docks, enter any name and this URL:

   ```
   file:///C:/path/to/obs-stats-widget/build/index.html
   ```

   Use the real path to the `build` folder, with forward slashes.

4. **Connect.** On first launch the dock asks for the obs-websocket port (4455 by default) and password.
   The password is saved in the dock, so this happens once.

5. **Add the bridge script (optional, recommended).** Open Tools → Scripts, press `+` and choose
   `obs-script/obs-stats-bridge.lua`. See below for what it does.

To update, pull the new code, run `npm run build:prod` again and press Ctrl+R in the dock.

## The bridge script

obs-websocket reports the stats of plugin outputs but not where they stream to, and it knows nothing about the GPU.
`obs-stats-bridge.lua` runs inside OBS and fills these gaps:

- **Plugin platforms.** It reads the server address of every output that streams and passes only its scheme
  and host, never the stream key or the URL path. Without the script, plugin cards show "Unknown platform".
- **GPU and memory (Windows).** It reads the GPU load, the hardware encoder load and video memory from the same
  performance counters Task Manager uses, so it works with NVIDIA, AMD and Intel GPUs. It also reads system memory.

The script publishes this every three seconds as the profile parameter `[ObsStatsDock] PluginOutputs`,
which the dock reads through obs-websocket.

`obs-stats-bridge.lua` is only the entry point: its parts live in the `obs-stats-bridge` folder next to it,
and OBS loads them from there. If you copy the script somewhere else, copy the folder with it.

## Settings

The gear in the top right corner opens the settings:

- **Port** and **Password** of obs-websocket, each with its own Save button. A new password is used only after
  OBS accepts it; until then the old one keeps working.
- **Display:** interface language, the OBS card on or off, and the mock mode.
- **Diagnostics:** copies the versions, the GPU and the outputs the dock found, for a bug report.

## Privacy and security

- The dock connects only to obs-websocket on `127.0.0.1`.
- The stream key is never read: from the stream settings the dock takes only the service name and the server.
- The obs-websocket password is stored only in the dock's own browser storage.
- Diagnostics and error reports contain no keys, passwords or server addresses.

## Known limitations

- obs-multi-rtmp gives all its targets the same output name, `multi-output`, and obs-websocket finds outputs
  by name. With several obs-multi-rtmp targets the dock shows one card and stats for only one of them,
  with a warning on the card.
- The tag of a plugin card shows the plugin name only for outputs it knows (`multi-output` is shown as multi-rtmp).
  Other plugin outputs are labelled just "Plugin".

## Troubleshooting

- **The dock is empty or outdated.** Run `npm run build:prod` again and press Ctrl+R in the dock.
- **"No connection to OBS".** Check that the WebSocket server is enabled in OBS and that the port matches.
  The dock retries every few seconds and connects as soon as OBS answers.
- **"Wrong password".** Copy the password from Tools → WebSocket Server Settings → Show Connect Info.
- **Plugin cards say "Unknown platform".** Add the bridge script in Tools → Scripts.
- **No GPU or system memory rows.** These need the bridge script and Windows.

If something else goes wrong, open an issue and attach the text from Settings → Diagnostics → Copy diagnostics,
or the error report if the dock shows an error screen.

## Development

```bash
npm install
npm run start:dev
```

`start:dev` serves the dock at http://localhost:3062 with hot reload. If OBS is running, the dock connects to it
by itself: the dev server reads the obs-websocket port and password from the OBS config folder and serves them
only on `localhost`. If OBS is started later, the dock picks it up within a few seconds.
To work without OBS, turn on the mock mode in the settings.

Scripts:

| Command | What it does |
| --- | --- |
| `npm run start:dev` | Dev server with hot reload on port 3062 (`PORT` in `.env` changes it) |
| `npm run build:prod` | Production build into `build` |
| `npm run package:release` | Production build plus the release folder and `compatibility.json` in `release` |
| `npm run lint` | TypeScript, ESLint, Stylelint and Knip |

A pre-commit hook (husky and lint-staged) lints the changed files and type-checks the project.
The dev server clears the `build` folder, so run `npm run build:prod` again before using the dock in OBS.

Tech stack: React 19, antd 6, Redux Toolkit, React Router 8, i18next, CSS modules, webpack and swc.
Code conventions are described in [CLAUDE.md](CLAUDE.md).

## Releases

Versions follow [semantic versioning](https://semver.org/). While the version is 0.x, a minor release may still
change settings or setup steps; this is always written in the release notes.

A release is built by GitHub Actions when a `v*` tag is pushed. Each release has:

- `obs-stats-widget-<version>.zip` with the dock (`dock/index.html`), the bridge script, `compatibility.json`
  and a short `README.txt`;
- `compatibility.json`: the minimum OBS version, the obs-websocket RPC version, the minimum Chromium version
  of the OBS browser, the minimum bridge script version and the obs-websocket requests the dock uses;
- [minisign](https://jedisct1.github.io/minisign/) signatures (`.minisig`) of the archive and `compatibility.json`,
  and a SHA-256 checksum of the archive.

To check a download, use the public key [minisign.pub](minisign.pub):

```bash
minisign -Vm obs-stats-widget-0.1.0.zip -p minisign.pub
```

## License

[MIT](LICENSE)
