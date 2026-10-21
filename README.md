# ScreenCord — Kettu voice-call diagnostics

ScreenCord adds a small settings page for inspecting connection information that the current Discord/Kettu build exposes while you're in a voice or video call.

## Install in Kettu

Use this jsDelivr manifest URL as the plugin source:

`https://cdn.jsdelivr.net/gh/unemployedz/screencord@main/dist/manifest.json`

If Kettu asks for a raw manifest URL instead, use:

`https://raw.githubusercontent.com/unemployedz/screencord/main/dist/manifest.json`

## Use

1. Install the manifest URL in Kettu's plugin/add-on interface.
2. Join a Discord voice or video call.
3. Open ScreenCord's settings and tap **Refresh call stats**.
4. The settings page displays endpoint, ping, and quality fields only when the client exposes them. Discord/Kettu internal APIs vary, so some fields may be unavailable.

## Limitations and privacy

- This is a JavaScript plugin; it cannot add Discord's native iOS screen-broadcast extension or repair native screen sharing.
- It does not enumerate or display local/remote participant IP addresses.
- The current implementation is a best-effort diagnostic view. It does not yet patch Discord's voice layer or add a `.voiceip` chat command.

## License

MIT
