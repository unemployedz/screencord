(()=>{
const ui=vendetta.ui, metro=vendetta.metro;
const {React,ReactNative}=metro.common;
const {Text,ScrollView,StyleSheet}=ReactNative;
const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:"#111214",padding:16},
  t:{color:"#fff",fontSize:18,fontWeight:"700",marginBottom:10},
  b:{color:"#b5bac1",fontSize:14,lineHeight:20,marginBottom:10},
  w:{color:"#f23f43",fontSize:14,lineHeight:20}
});
function Settings(){
  return React.createElement(ScrollView,{style:styles.root},
    React.createElement(Text,{style:styles.t},"ScreenCord moved"),
    React.createElement(Text,{style:styles.w},"This is no longer a screenshare-fix plugin. iOS full-screen share needs Discord’s native Broadcast Extension, which Kettu/JS cannot add."),
    React.createElement(Text,{style:styles.b},"Repo is now a WebRTC call page: open the GitHub repo index.html (or GitHub Pages) on two devices and exchange offer/answer."),
    React.createElement(Text,{style:styles.b},"https://github.com/unemployedz/screencord")
  );
}
return{
  onLoad:function(){try{ui.toasts&&ui.toasts.showToast("ScreenCord: use WebRTC page in repo — not Discord screenshare")}catch(e){}},
  onUnload:function(){},
  settings:Settings
};
})()
