(()=>{
const ui=vendetta.ui;
const metro=vendetta.metro;
const {React,ReactNative}=metro.common;
const {Text,View,ScrollView,Pressable,StyleSheet}=ReactNative;
const h=React.createElement;
const styles=StyleSheet.create({
 root:{flex:1,backgroundColor:"#111214",padding:16},
 title:{color:"#fff",fontSize:22,fontWeight:"700",marginBottom:6},
 subtitle:{color:"#b5bac1",fontSize:13,lineHeight:19,marginBottom:16},
 card:{backgroundColor:"#1e1f22",borderRadius:14,padding:14,marginBottom:10},
 label:{color:"#b5bac1",fontSize:12,marginBottom:5},
 value:{color:"#f2f3f5",fontSize:15,fontWeight:"600"},
 button:{backgroundColor:"#5865f2",padding:13,borderRadius:10,alignItems:"center",marginTop:8,marginBottom:12},
 buttonText:{color:"#fff",fontWeight:"700"},
 foot:{color:"#949ba4",fontSize:12,lineHeight:18,marginTop:8}
});
let snapshot={status:"Not checked",endpoint:"Unavailable",ping:"Unavailable",quality:"Unavailable",detail:"Tap Refresh while connected to a Discord voice call."};
function findStore(){
 const candidates=["getRTCConnectionState","getRTCConnection","getVoiceStateForChannel","getVoiceState"];
 for(const method of candidates){
  try{const store=metro.findByProps?.(method);if(store&&typeof store[method]==="function")return {store,method};}catch{}
 }
 return null;
}
function refresh(){
 snapshot={status:"Checking",endpoint:"Unavailable",ping:"Unavailable",quality:"Unavailable",detail:"Looking for Discord's active call connection data."};
 try{
  const found=findStore();
  if(!found){snapshot={status:"Store not exposed by this Kettu build",endpoint:"Unavailable",ping:"Unavailable",quality:"Unavailable",detail:"This client did not expose a supported voice connection store. No participant IP addresses are collected."};return;}
  let value;try{value=found.store[found.method]();}catch{}
  const source=(typeof value==="string"?value:"")+" "+(()=>{try{return JSON.stringify(value)||""}catch{return ""}})();
  const endpoint=(source.match(/(?:hostname|endpoint|address|host)["']?\s*[:=]\s*["']?([a-z0-9.-]+\.[a-z]{2,}(?::\d+)?)/i)||[])[1];
  const ping=(source.match(/(?:ping|rtt)["']?\s*[:=]\s*["']?(\d+(?:\.\d+)?)\s*"?/i)||[])[1];
  const quality=(source.match(/(?:quality|packetLoss|jitter)["']?\s*[:=]\s*["']?([a-z0-9.% -]+)/i)||[])[1];
  snapshot={status:value?"Connection data found":"No active call data found",endpoint:endpoint||"Not exposed by this client",ping:ping?ping+" ms":"Not exposed by this client",quality:quality||"Not exposed by this client",detail:value?"Values are read only when the client exposes them. Some Discord builds hide these fields.":"Join a voice call, then refresh."};
 }catch{snapshot={status:"Could not read connection data",endpoint:"Unavailable",ping:"Unavailable",quality:"Unavailable",detail:"The client API changed or blocked access. Try again after joining a call."};}
}
function Item({label,value}){return h(View,{style:styles.card},h(Text,{style:styles.label},label),h(Text,{style:styles.value},value));}
function Settings(){const [version,setVersion]=React.useState(0);const doRefresh=()=>{refresh();setVersion(v=>v+1);};return h(ScrollView,{style:styles.root,contentContainerStyle:{paddingBottom:24}},h(Text,{style:styles.title},"ScreenCord"),h(Text,{style:styles.subtitle},"Voice call connection diagnostics for Kettu. Refresh while connected to a Discord voice or video call."),h(Pressable,{style:styles.button,onPress:doRefresh},h(Text,{style:styles.buttonText},"Refresh call stats")),h(Item,{label:"Connection",value:snapshot.status}),h(Item,{label:"Voice endpoint",value:snapshot.endpoint}),h(Item,{label:"Ping",value:snapshot.ping}),h(Item,{label:"Quality",value:snapshot.quality}),h(Text,{style:styles.foot},snapshot.detail),h(Text,{style:styles.foot},"Privacy: this plugin does not enumerate or display local/remote participant IP addresses. It only reads connection fields exposed by the client."));}
return{onLoad:function(){try{ui.toasts&&ui.toasts.showToast("ScreenCord loaded — open plugin settings and refresh during a call");}catch{}},onUnload:function(){},settings:Settings};
})()
