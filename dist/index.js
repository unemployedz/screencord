(() => {
  const { React, ReactNative } = vendetta.metro.common;
  const { Text, ScrollView, StyleSheet } = ReactNative;
  const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#111214", padding: 18 },
    title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 8 },
    sub: { color: "#b5bac1", fontSize: 14, lineHeight: 21, marginBottom: 14 },
    section: { color: "#fff", fontSize: 16, fontWeight: "700", marginTop: 14, marginBottom: 6 },
    line: { color: "#dbdee1", fontSize: 14, lineHeight: 22 },
    note: { color: "#f0b232", fontSize: 13, lineHeight: 19, marginTop: 14 }
  });

  function safeModule(props) {
    try { return vendetta.metro.findByProps(...props); } catch (_) { return null; }
  }

  function readDiagnostics() {
    const voice = safeModule(["getVoiceChannelId"]);
    const media = safeModule(["getRTCConnectionState", "getPing"]);
    const connection = safeModule(["getConnection"]);
    let channel = null, ping = null, state = null;
    try { channel = voice?.getVoiceChannelId?.() ?? null; } catch (_) {}
    try { ping = media?.getPing?.() ?? null; } catch (_) {}
    try { state = media?.getRTCConnectionState?.() ?? null; } catch (_) {}
    if (ping == null) {
      try {
        const conn = connection?.getConnection?.();
        ping = conn?.ping ?? conn?.rtt ?? null;
        state = state ?? conn?.state ?? null;
      } catch (_) {}
    }
    const validPing = typeof ping === "number" && Number.isFinite(ping) ? Math.round(ping) : null;
    let quality = "Unavailable";
    if (validPing !== null) quality = validPing < 100 ? "Good" : validPing < 180 ? "Fair" : "High latency";
    return {
      inCall: Boolean(channel),
      ping: validPing,
      state: state == null ? "Unknown" : String(state),
      quality
    };
  }

  function resultText() {
    const d = readDiagnostics();
    if (!d.inCall) return "ScreenCord: You do not appear to be connected to a voice channel.";
    return "ScreenCord voice diagnostics\nCall: connected\nConnection state: " + d.state +
      "\nPing: " + (d.ping === null ? "Unavailable" : d.ping + " ms") +
      "\nQuality estimate: " + d.quality +
      "\nRemote participant IP addresses are not collected or displayed.";
  }

  function Settings() {
    const d = readDiagnostics();
    return React.createElement(ScrollView, { style: styles.root },
      React.createElement(Text, { style: styles.title }, "ScreenCord"),
      React.createElement(Text, { style: styles.sub }, "Voice connection diagnostics for your current Discord session."),
      React.createElement(Text, { style: styles.section }, "Call status"),
      React.createElement(Text, { style: styles.line }, d.inCall ? "Connected to a voice channel" : "Not connected to a voice channel"),
      React.createElement(Text, { style: styles.section }, "Connection state"),
      React.createElement(Text, { style: styles.line }, d.state),
      React.createElement(Text, { style: styles.section }, "Ping"),
      React.createElement(Text, { style: styles.line }, d.ping === null ? "Unavailable on this client build" : d.ping + " ms"),
      React.createElement(Text, { style: styles.section }, "Estimated quality"),
      React.createElement(Text, { style: styles.line }, d.quality),
      React.createElement(Text, { style: styles.note }, "Values depend on which diagnostics Kettu exposes in your Discord build. ScreenCord does not collect or display other call participants' IP addresses.")
    );
  }

  let unregisterCommand = null;
  return {
    onLoad() {
      try {
        const commands = vendetta.api?.commands;
        if (commands?.registerCommand) {
          unregisterCommand = commands.registerCommand({
            name: "voiceip",
            description: "Show ScreenCord voice connection diagnostics",
            execute: () => ({ content: resultText() })
          });
        } else {
          try { vendetta.ui?.toasts?.showToast?.("ScreenCord loaded; this Kettu build does not expose command registration."); } catch (_) {}
        }
      } catch (e) {
        try { vendetta.ui?.toasts?.showToast?.("ScreenCord loaded, but command registration failed."); } catch (_) {}
      }
    },
    onUnload() {
      try { if (typeof unregisterCommand === "function") unregisterCommand(); } catch (_) {}
    },
    settings: Settings
  };
})()
