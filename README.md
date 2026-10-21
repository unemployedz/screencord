# ScreenCord (WebRTC)

Discord **cannot** do full-device screen share on many **sideloaded / Kettu iOS** builds because the app is missing Discord’s native **Broadcast Upload Extension**. The iOS picker then only lists other apps (TikTok, ChatGPT, Gemini, …) — those extensions do not talk to Discord.

This repo is now a **standalone WebRTC voice/video call** page (optional screen share where the browser/OS allows). No Discord plugin can fix ReplayKit.

## Use

1. Open `index.html` in a browser (two devices/people).
2. Both allow camera/mic.
3. Person A: **Create offer** → copy text → send to B.
4. Person B: paste offer → **Create answer** → send answer to A.
5. Person A: paste answer → **Apply answer**.

Same Wi‑Fi hosting example:

```bash
python3 -m http.server 8080
# other device: http://YOUR_LAN_IP:8080
```

Or enable **GitHub Pages** on this repo (root) and open the site URL.

## Limits

- **iPhone Safari**: full-screen `getDisplayMedia` is often unavailable; camera/mic calls still work.
- Desktop Chrome/Edge: screen share works best.
- Manual offer/answer = no signaling server required.

## Old Kettu plugin

Removed as primary deliverable — JS plugins cannot register an iOS Broadcast Extension.
