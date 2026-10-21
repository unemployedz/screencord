# ScreenCord

A Kettu/Vendetta-style plugin intended to show local Discord voice diagnostics.

## Install

Use the folder URL below (the new `plugin` directory avoids the old cached `dist` path):

```
https://cdn.jsdelivr.net/gh/unemployedz/screencord@main/plugin/
```

## Use

1. Remove the old ScreenCord plugin from Kettu.
2. Install the folder URL above.
3. Enable the plugin and join a voice channel.
4. Try `.voiceip` in a channel where Kettu commands are available, or open plugin settings.

The command integration depends on the command API exposed by your specific Kettu build. Ping is shown only when Discord exposes it through a discoverable module.

## Privacy

This plugin does not send diagnostic data to a server and does not collect or display other participants' IP addresses.
