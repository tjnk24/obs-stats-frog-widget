obs-stats-widget {{version}}

1. Copy this folder somewhere permanent, for example %LOCALAPPDATA%\obs-stats-widget.
2. OBS: Docks -> Custom Browser Docks. Add a dock with the URL file:///<folder>/dock/index.html
3. OBS: Tools -> WebSocket Server Settings. Enable the server and note the port and password.
4. OBS: Tools -> Scripts. Add obs-stats-bridge.lua (needed for obs-multi-rtmp outputs, GPU and memory).

Full guide: https://github.com/tjnk24/obs-stats-widget#readme
