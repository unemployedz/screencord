(()=>{
const metro=vendetta.metro,patcher=vendetta.patcher,storage=vendetta.plugin.storage,ui=vendetta.ui;
const {findByProps,findByStoreName}=metro;
const {React,ReactNative}=metro.common;
const {after,before}=patcher;
const {showToast}=ui.toasts||{};
const {View,Text,ScrollView,TouchableOpacity,StyleSheet,Switch}=ReactNative;

const unpatches=[];

function ensure(){
  if(storage.forceEnable===undefined)storage.forceEnable=true;
  if(storage.patchExperiments===undefined)storage.patchExperiments=true;
  if(storage.showToasts===undefined)storage.showToasts=true;
}

function toast(m){
  if(!storage.showToasts)return;
  try{showToast&&showToast(String(m).slice(0,140))}catch(e){}
}

function patchPermissionHelpers(){
  const candidates=[
    findByProps("canStream","canUseGoLive"),
    findByProps("canGoLive"),
    findByProps("canScreenShare"),
    findByProps("getMaxSimultaneousStreams"),
    findByProps("isScreenShareSupported"),
    findByProps("canUseMobileScreenshare")
  ];
  let n=0;
  for(const mod of candidates){
    if(!mod)continue;
    for(const key of Object.keys(mod)){
      if(typeof mod[key]!=="function")continue;
      const k=key.toLowerCase();
      if(!(k.includes("stream")||k.includes("golive")||k.includes("screenshare")||k.includes("share")))continue;
      try{
        unpatches.push(after(key,mod,function(_a,res){
          if(!storage.forceEnable)return res;
          if(typeof res==="boolean")return true;
          return res;
        }));
        n++;
      }catch(e){}
    }
  }
  return n;
}

function patchExperiments(){
  if(!storage.patchExperiments)return 0;
  let n=0;
  const exp=findByProps("getGuildExperimentBucket","getUserExperimentBucket")
    ||findByProps("getExperimentBucket")
    ||findByStoreName("ExperimentStore");
  if(exp){
    for(const key of ["getGuildExperimentBucket","getUserExperimentBucket","getExperimentBucket"]){
      if(typeof exp[key]==="function"){
        try{
          unpatches.push(after(key,exp,function(args,res){
            try{
              const name=String(args&&args[0]||"").toLowerCase();
              if(name.includes("screen")||name.includes("golive")||name.includes("stream")||name.includes("mobile_go")){
                if(typeof res==="number"&&res===0)return 1;
              }
            }catch(e){}
            return res;
          }));
          n++;
        }catch(e){}
      }
    }
  }
  const flags=findByProps("isTreatmentsEnabled")||findByProps("hasFeature");
  if(flags&&flags.hasFeature){
    try{
      unpatches.push(after("hasFeature",flags,function(args,res){
        const f=String(args&&args[0]||"").toLowerCase();
        if(storage.forceEnable&&(f.includes("screen")||f.includes("stream")||f.includes("golive")))return true;
        return res;
      }));
      n++;
    }catch(e){}
  }
  return n;
}

function install(){
  while(unpatches.length){try{unpatches.pop()()}catch(e){}}
  const a=patchPermissionHelpers();
  const b=patchExperiments();
  toast("ScreenCord: JS gates patched ("+(a+b)+") — native capture still OS-level");
}

const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:"#111214"},
  pad:{padding:16,paddingBottom:40},
  title:{fontSize:20,fontWeight:"700",color:"#fff",marginBottom:8},
  warn:{fontSize:14,color:"#f23f43",lineHeight:20,marginBottom:12},
  body:{fontSize:14,color:"#b5bac1",lineHeight:20,marginBottom:10},
  h:{fontSize:15,fontWeight:"700",color:"#f2f3f5",marginTop:12,marginBottom:6},
  row:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingVertical:10,borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:"#2b2d31"},
  rowLabel:{color:"#f2f3f5",fontSize:15,flex:1,paddingRight:8},
  btn:{backgroundColor:"#5865f2",padding:14,borderRadius:8,alignItems:"center",marginTop:14},
  btnText:{color:"#fff",fontWeight:"700",fontSize:16}
});

function Settings(){
  ensure();
  const[,tick]=React.useState(0);
  const refresh=function(){tick(function(x){return x+1})};
  return React.createElement(ScrollView,{style:styles.root,contentContainerStyle:styles.pad},
    React.createElement(Text,{style:styles.title},"ScreenCord"),
    React.createElement(Text,{style:styles.warn},
      "A Kettu plugin CANNOT make full-device screen share work if iOS/Android capture is broken. That needs Discord’s native Broadcast Extension (iOS) or MediaProjection (Android), which live outside JavaScript."
    ),
    React.createElement(Text,{style:styles.body},
      "What you’re seeing (“only some apps / they don’t work”) is the system picker listing other apps’ screen-record extensions because Discord’s own extension is missing, unsigned, or broken in a sideloaded build."
    ),
    React.createElement(Text,{style:styles.h},"What this plugin does"),
    React.createElement(Text,{style:styles.body},
      "• Forces client-side “can screenshare / go live” JS checks to true when possible\n• Nudges experiment buckets related to mobile stream/screenshare\n• Cannot capture pixels or register a ReplayKit extension"
    ),
    React.createElement(Text,{style:styles.h},"What actually fixes full screen share"),
    React.createElement(Text,{style:styles.body},
      "iOS (Kettu / sideload):\n• Official App Store Discord has a working Broadcast Upload Extension\n• Sideloaded IPA often loses or breaks that extension → picker shows random apps\n• Fix path: use official Discord for share, or a properly signed build that includes Discord’s screen-share extension + entitlements\n\nAndroid:\n• Choose Entire screen (not a single app) when prompted\n• Grant capture permission; disable battery restrictions for Discord\n• DRM apps (Netflix, etc.) will still black out"
    ),
    React.createElement(View,{style:styles.row},
      React.createElement(Text,{style:styles.rowLabel},"Force JS can-stream checks"),
      React.createElement(Switch,{value:!!storage.forceEnable,onValueChange:function(v){storage.forceEnable=v;refresh();install()}})
    ),
    React.createElement(View,{style:styles.row},
      React.createElement(Text,{style:styles.rowLabel},"Patch experiments"),
      React.createElement(Switch,{value:!!storage.patchExperiments,onValueChange:function(v){storage.patchExperiments=v;refresh();install()}})
    ),
    React.createElement(View,{style:styles.row},
      React.createElement(Text,{style:styles.rowLabel},"Toasts"),
      React.createElement(Switch,{value:!!storage.showToasts,onValueChange:function(v){storage.showToasts=v;refresh()}})
    ),
    React.createElement(TouchableOpacity,{style:styles.btn,onPress:function(){install()}},
      React.createElement(Text,{style:styles.btnText},"Re-apply patches")
    )
  );
}

return{
  onLoad:function(){ensure();install()},
  onUnload:function(){while(unpatches.length){try{unpatches.pop()()}catch(e){}}},
  settings:Settings
};
})()
