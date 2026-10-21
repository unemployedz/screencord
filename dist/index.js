(() => {
  const { React, ReactNative } = vendetta.metro.common;
  const { View, Text, ScrollView, TouchableOpacity, StyleSheet } = ReactNative;
  const styles = StyleSheet.create({
    root:{flex:1,backgroundColor:"#0b0b0d",padding:18},
    title:{color:"#fff",fontSize:24,fontWeight:"800",marginBottom:6},
    sub:{color:"#a7a7ad",fontSize:14,lineHeight:20,marginBottom:18},
    card:{backgroundColor:"#17171b",borderColor:"#2a2a30",borderWidth:1,borderRadius:14,padding:14,marginBottom:10},
    label:{color:"#92929b",fontSize:12,marginBottom:5},
    value:{color:"#fff",fontSize:17,fontWeight:"700"},
    button:{backgroundColor:"#5865f2",padding:14,borderRadius:12,alignItems:"center",marginTop:8},
    buttonText:{color:"#fff",fontSize:15,fontWeight:"700"},
    note:{color:"#a7a7ad",fontSize:12,lineHeight:18,marginTop:14}
  });
  function lookup(props){try{return vendetta.metro.findByProps(...props)}catch(_){return null}}
  function diagnostics(){
    const vs=lookup(["getVoiceChannelId"]),rtc=lookup(["getPing","getRTCConnectionState"]),con=lookup(["getConnection"]);
    let channel=null,ping=null,state="Unavailable";
    try{channel=vs?.getVoiceChannelId?.()??null}catch(_){}
    try{ping=rtc?.getPing?.()??null;state=rtc?.getRTCConnectionState?.()??state}catch(_){}
    if(ping==null){try{const c=con?.getConnection?.();ping=c?.ping??c?.rtt??null;state=c?.state??state}catch(_){}}
    if(typeof ping!=="number"||!Number.isFinite(ping))ping=null;
    return {connected:!!channel,ping:ping===null?null:Math.round(ping),state:String(state)};
  }
  function App(){
    const [tick,setTick]=React.useState(0),d=diagnostics();
    const quality=d.ping===null?"Not exposed":d.ping<100?"Good":d.ping<180?"Fair":"High latency";
    function row(label,value){return React.createElement(View,{style:styles.card},React.createElement(Text,{style:styles.label},label),React.createElement(Text,{style:styles.value},value))}
    return React.createElement(ScrollView,{style:styles.root},
      React.createElement(Text,{style:styles.title},"ScreenCord"),
      React.createElement(Text,{style:styles.sub},"Voice call diagnostics · refresh while connected to a call."),
      row("CALL STATUS",d.connected?"Connected":"Not connected"),row("CONNECTION STATE",d.state),
      row("PING",d.ping===null?"Unavailable in this Kettu build":d.ping+" ms"),row("QUALITY ESTIMATE",quality),
      React.createElement(TouchableOpacity,{style:styles.button,onPress:()=>setTick(tick+1)},React.createElement(Text,{style:styles.buttonText},"Refresh diagnostics")),
      React.createElement(Text,{style:styles.note},"Only values exposed by your current client can be shown. ScreenCord does not collect other participants' IP addresses. The .voiceip chat command is not claimed as working until Kettu's command API is verified.")
    );
  }
  return {onLoad(){try{vendetta.ui?.toasts?.showToast?.("ScreenCord loaded")}catch(_){}},onUnload(){},settings:App};
})()
