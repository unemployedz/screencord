(() => {
  const common = vendetta.metro.common;
  const React = common.React;
  const { ScrollView, Text, StyleSheet } = common.ReactNative;
  const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#111214", padding: 18 },
    title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 8 },
    text: { color: "#b5bac1", fontSize: 14, lineHeight: 21, marginBottom: 10 },
    label: { color: "#fff", fontSize: 15, fontWeight: "700", marginTop: 12, marginBottom: 4 },
    value: { color: "#dbdee1", fontSize: 14, lineHeight: 20 },
    warn: { color: "#f0b232", fontSize: 13, lineHeight: 19, marginTop: 14 }
  });

  function findModule(props) {
    try { return vendetta.metro.findByProps(...props); } catch (_) { return null; }
  }

  function diagnostics() {
    let channelId = null, ping = null, state = "Unavailable";
    try { channelId = findModule(["getVoiceChannelId"])?.getVoiceChannelId?.() ?? null; } catch (_) {}
    try {
      const rtc = findModule(["getRTCConnectionState", "getPing"]);
      ping = rtc?.getPing?.() ?? null;
      state = rtc?.getRTCConnectionState?.() ?? state;
    } catch (_) {}
    const latency = typeof ping === "number" && Number.isFinite(ping) ? Math.round(ping) : null;
    return {
      connected: channelId != null,
      state: String(state),
      ping: latency,
      quality: latency == null ? "Unavailable" : latency < 100 ? "Good" : latency < 180 ? "Fair" : "High latency"
    };
  }

  function formatDiagnostics() {
    const d = diagnostics();
    return [
      "ScreenCord — Voice diagnostics",
      "Call: " + (d.connected ? "connected" : "not detected"),
      "Connection state: " + d.state,
      "Ping: " + (d.ping == null ? "unavailable in this Kettu build" : d.ping + " ms"),
      "Estimated quality: " + d.quality,
      "No participant IP addresses are collected."
    ].join("\n");
  }

  function Settings() {
    const d = diagnostics();
    return React.createElement(ScrollView, { style: styles.root },
      React.createElement(Text, { style: styles.title }, "ScreenCord"),
      React.createElement(Text, { style: styles.text }, "Local voice connection diagnostics. No external requests or remote logging."),
      React.createElement(Text, { style: styles.label }, "Call"),
      React.createElement(Text, { style: styles.value }, d.connected ? "Connected" : "Not detected"),
      React.createElement(Text, { style: styles.label }, "Connection state"),
      React.createElement(Text, { style: styles.value }, d.state),
      React.createElement(Text, { style: styles.label }, "Ping"),
      React.createElement(Text, { style: styles.value }, d.ping == null ? "Unavailable" : d.ping + " ms"),
      React.createElement(Text, { style: styles.label }, "Quality estimate"),
      React.createElement(Text, { style: styles.value }, d.quality),
      React.createElement(Text, { style: styles.warn }, "Ping depends on diagnostics exposed by your Kettu/Discord build.")
    );
  }

  let unregister = null;
  return {
    onLoad() {
      try {
        const commands = common.commands;
        if (commands && typeof commands.registerCommand === "function") {
          unregister = commands.registerCommand({
            name: "voiceip",
            description: "Show local voice connection diagnostics",
            execute: () => ({ content: formatDiagnostics() })
          });
        } else {
          vendetta.ui?.toasts?.showToast?.("ScreenCord: this Kettu build does not expose the command API");
        }
      } catch (_) {
        try { vendetta.ui?.toasts?.showToast?.("ScreenCord: command registration failed"); } catch (_) {}
      }
    },
    onUnload() {
      try { if (typeof unregister === "function") unregister(); } catch (_) {}
    },
    settings: Settings
  };
})()
