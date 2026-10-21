# ScreenCord — Discord WebRTC call plugin (Kettu)

Shows **Discord voice/video WebRTC** connection info while you are in a call:

- Voice server **hostname / endpoint**
- Ping & quality (from `RTCConnectionStore` when available)
- Optional local/remote ICE candidate IPs if the runtime exposes `RTCPeerConnection`
- Chat command **`.voiceip`** (configurable)

## Not for screen share

iOS full-screen share still needs Discord’s native Broadcast Extension. This plugin only reads **call** WebRTC stats.

## Install

```
https://raw.githubusercontent.com/unemployedz/screencord/main/dist/manifest.json
```

```
https://cdn.jsdelivr.net/gh/unemployedz/screencord@main/dist/manifest.json
```

Paste **one line**, no trailing slash, no line break.

## Use

1. Join a Discord voice call or VC.
2. Type `.voiceip` in chat **or** open plugin settings → Refresh stats.
3. Toast / settings show host, ping, quality, any discovered IPs.

## License

MIT
