# ScreenCord

Kettu helper for Discord **mobile screen share**.

## Hard limit (read this)

Full-device screen share is **not** implemented in JavaScript.

| Layer | Who controls it |
|-------|-----------------|
| Share button / experiments | Discord JS (plugin can patch) |
| Actual pixels of your screen | **iOS ReplayKit Broadcast Extension** or **Android MediaProjection** (native) |

If the system picker only lists random apps and they “don’t work”, Discord’s **native** screen-share extension is missing or broken in your build (very common on **sideloaded / Kettu iOS** IPAs). No plugin can inject a Broadcast Upload Extension into the app.

### Real fixes

**iOS**
1. Use **App Store Discord** when you need reliable full-screen share, **or**
2. Use an IPA that still ships Discord’s screen broadcast extension and is signed with matching entitlements/App Group.

**Android**
1. Choose **Entire screen** (not a single app) when prompted.
2. Grant capture permission; disable aggressive battery kill for Discord.
3. DRM apps (Netflix, etc.) will stay black — OS/app policy, not Discord alone.

## What ScreenCord *does*

- Force some client-side `canStream` / screenshare capability checks to allow the button
- Nudge related experiment buckets when present

## Install

```
https://cdn.jsdelivr.net/gh/unemployedz/screencord@main/dist/manifest.json
```

or

```
https://raw.githubusercontent.com/unemployedz/screencord/main/dist/manifest.json
```

## License

MIT
