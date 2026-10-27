# stats-sorayuki-frog-widget

OBS Custom Browser Dock with live stream stats for every output that streams, plus OBS-wide encoding
and rendering lag. Numbers come from OBS's built-in obs-websocket (port 4455).
Built with React and antd (dark compact theme in the chat widget's colors, `src/utils/theme.ts`).

The cards follow OBS's settings by themselves:

- **Основной** — OBS's own stream output; the platform comes from Settings → Stream (service name or server).
- **Плагин** — any other output that streams to a service, e.g. an obs-multi-rtmp target (output `multi-output`).
  obs-websocket does not tell where a plugin output streams to; `obs-script/obs-stats-bridge.lua` looks it up
  inside OBS and passes only the server's scheme and host (never the key) to the dock as the profile parameter
  `[ObsStatsDock] PluginOutputs`. Without the script the card shows «Неизвестная площадка».

obs-multi-rtmp names the outputs of all its targets `multi-output` and obs-websocket finds outputs by name,
so with several targets the stats are for only one of them.

## Build

```
npm install
npm run build:prod
```

## Add to OBS

1. Docks → Custom Browser Docks, URL `file:///<project folder>/build/index.html`.
   The obs-websocket password (Tools → WebSocket Server Settings → Show Connect Info) is typed into the dock once.
2. Tools → Scripts → `+` → `obs-script/obs-stats-bridge.lua` (for the platforms of plugin outputs).

## Development

`npm run start:dev` serves the dock at http://localhost:3062 (port from `PORT` in `.env`).
`?port=NNNN` in the URL connects to another obs-websocket port.
