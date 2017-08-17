import {StyleSheet, Dimensions, PixelRatio, Platform} from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
let isIOS = (Platform.OS === 'ios');
let fontScale = PixelRatio.getFontScale();
let pixelRatioGet = PixelRatio.get();
const defaultPixel = 2;
const w2 = 750 / defaultPixel;
const h2 = 1334 / defaultPixel;
const scale = Math.min(HEIGHT / h2, WIDTH / w2);   //获取缩放比例

let setSizeText = (size)=>{
    size = Math.round((size * scale + 0.5) * pixelRatioGet / fontScale);
    return size / defaultPixel;
}
let setScaleSize = (size)=>{
    size = Math.round(size * scale + 0.5);
    return size / defaultPixel;
}


const homePage = StyleSheet.create({
    icon: {width: 30, height: 30,},
    flatViewImage: { width: (WIDTH - setScaleSize(62))/2, height: (WIDTH - setScaleSize(62))/2,  borderRadius:setScaleSize(10),},
    flatViewOne: {flex:1, backgroundColor: "#fff",},
    livein:{width:setScaleSize(30), height:setScaleSize(38), marginLeft:setScaleSize(15), marginRight:setScaleSize(10), position:"absolute", bottom:setScaleSize(15)},
    isvip:{width:setScaleSize(150), height:setScaleSize(150),  position:"absolute", top:setScaleSize(-5),},
    liveCity:{fontSize:setScaleSize(22), marginBottom:setScaleSize(15),  color:"#fff",  position:"absolute", bottom:setScaleSize(15), left:setScaleSize(55)},
    flatViewTouch: {flex:1, paddingTop: setScaleSize(20)},
    iosTab: {height:setScaleSize(20), backgroundColor: "#e74f7b"},
    centerView: {height:50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e74f7b',},
    title: {fontSize: setScaleSize(34),  textAlign: 'center', color: '#fff',},
    flatView: {flex: 11, padding: 5, backgroundColor: '#efefef'},
    upImageTouch:{position:'absolute', bottom:40, right:50, width: 36, height: 36, borderRadius:18, },
    upImage: {width: 36, height: 36, borderRadius:18, },
    container: {flex: 1, backgroundColor: "#fff", flexDirection:'column',},
    liveage: {fontSize: 14, color: '#666', padding: 5,},
    realName: {fontSize: setScaleSize(24),  color: '#333', marginTop:setScaleSize(30),},
    liveAgeMarry:{fontSize: setScaleSize(22),  color: '#888', marginTop:setScaleSize(20), marginBottom:setScaleSize(10), flexWrap:'wrap' },
    headImage: {height: WIDTH, width: WIDTH,},
    headerTitleStyle: {color: '#fff', backgroundColor: 'yellow',},
    headerStyle: {backgroundColor: "#e74f7b", height: 0, justifyContent: 'center',},
    item: { margin:5,  backgroundColor: '#fff', width: Dimensions.get('window').width-10, },
});
const minePage = StyleSheet.create({
    flex: {flex: 1, backgroundColor:"#fff"},
    name:{fontSize:setScaleSize(38), textAlign:'left', color:'#444', },
    id:{fontSize:setScaleSize(28), textAlign:'left', color:'#444'},
    nameId:{ marginLeft:setScaleSize(40), height:setScaleSize(120), justifyContent:'space-around', alignItems:"flex-start"},
    isvip:{width:setScaleSize(200), height:setScaleSize(200),  position:"absolute", top:setScaleSize(-5),},
    arrMine: {flex: 1,},
    oneLineView:{flex:1, flexDirection: 'row', paddingLeft:setScaleSize(40), paddingTop:setScaleSize(12), paddingBottom:setScaleSize(28),  alignItems:"center", },
    spare:{backgroundColor:"#f5f5f5", width:WIDTH, height:setScaleSize(20)},
    iconImg:{width:setScaleSize(50),height:setScaleSize(50), marginRight:setScaleSize(30) },
    vipView: {backgroundColor:"orange",width:150, height:30, justifyContent:"center", alignItems:"center", transform:[{rotate:'-45deg'}], position:'absolute',  left:-40, top:20},
    vipText: {color: "#fff",fontSize:16, },
    icon: {width: 28, height: 28,},
    headImage: {flex: 1,},
});
const live = StyleSheet.create({
    flatListView: {flex: 11, backgroundColor: '#f5f5f5'},
    liveIn: {flexDirection:"row", height:50, backgroundColor: '#e74f7b', justifyContent: "center", alignItems: 'center',},
    container: {flex: 1, backgroundColor: "#ccc", flexDirection:'column',},
    isvip:{width:setScaleSize(200), height:setScaleSize(200),  position:"absolute", top:setScaleSize(-5),},
    icon: {width: 30, height: 30,},
    liveInImg:{ width:setScaleSize(32), height:setScaleSize(42), position:'absolute', left:setScaleSize(30), bottom:(25 - setScaleSize(21)),},
    item: {width: (WIDTH / 2), backgroundColor: "red",},
    itemView: { backgroundColor: '#fff', width: (WIDTH-setScaleSize(40)), },
    headImage: {width:(WIDTH - setScaleSize(40)), height:(WIDTH - setScaleSize(40))},
    imgInnerView:{ flexDirection:"row",},
    innerText:{color:"#fff",  fontSize:setScaleSize(24),},
    innerViewAge:{marginLeft:setScaleSize(20), marginBottom:setScaleSize(20), height:setScaleSize(36), width:setScaleSize(80), justifyContent:'center', alignItems:'center',backgroundColor:"#669ce3", borderRadius:setScaleSize(4), },
    innerViewEdu:{marginLeft:setScaleSize(20), marginBottom:setScaleSize(20), height:setScaleSize(36), width:setScaleSize(100), justifyContent:'center', alignItems:'center',backgroundColor:"#32ad19", borderRadius:setScaleSize(4), },
    innerViewMar:{marginLeft:setScaleSize(20), marginBottom:setScaleSize(20), height:setScaleSize(36), width:setScaleSize(80), justifyContent:'center', alignItems:'center',backgroundColor:"#d5519e", borderRadius:setScaleSize(4), },
    realname: {fontSize: setScaleSize(28),  color: '#333', margin: setScaleSize(20),},
    realnameView:{ },
    flatTouch:{overflow:'hidden', marginLeft:setScaleSize(20), marginRight:setScaleSize(20), marginTop:setScaleSize(30), },
    // sectionParentView: {flex: 1, },
    titleTotalView: {height: 100, backgroundColor: '#e74f7b',},
    messageTitleTotalView: {backgroundColor: '#e74f7b',},
    titleText: {color:"white", fontSize:setScaleSize(34), },
    titleTextView: {textAlign: "center",},
    titleTextQQ: {backgroundColor: 'orange', flex: 1, justifyContent: 'center', paddingLeft: 10,},
    message: {backgroundColor: '#ffefd2', flexDirection:'row',alignItems: "center", height: 50,  paddingLeft: 10, paddingRight:10,},
    messageText: {color: '#2f9e43', marginLeft: 10, fontSize:16},
    titleTextWechat: {flex: 1, justifyContent: 'center', paddingLeft: 10,},
    flatViewImage: {width: (WIDTH-40) / 2, height: (WIDTH-40) / 2, borderRadius:10, },
    flatView: {backgroundColor: "#fff", padding: 10},
});
const tabbar = StyleSheet.create({
    container: {flex: 1,},
    icon: {width: 22, height: 22,},
    iconTextTouch:{flex:1, justifyContent: 'center', alignItems: 'center', },
});
const pageLuck = StyleSheet.create({
    heartView: { marginTop:setScaleSize(80),  flexDirection:'row', justifyContent:'space-around', alignItems:'center'},
    heartImg: {width: setScaleSize(152), height: setScaleSize(152), marginLeft:setScaleSize(15), marginRight:setScaleSize(15), },
    bodyView:{padding:setScaleSize(20), alignItems:"center", },
    bottomView:{borderWidth:2, borderColor:"#ebebeb", borderTopWidth:0, shadowColor:"#ebebeb", shadowRadius:setScaleSize(4), shadowOffset:{width:setScaleSize(4), height:setScaleSize(2),}, width:setScaleSize(660), height:setScaleSize(20), backgroundColor:"#fff", borderBottomLeftRadius:setScaleSize(8),  borderBottomRightRadius:setScaleSize(8),},
    headTouch:{borderRadius:setScaleSize(8),borderWidth:2, borderColor:"#ebebeb"},
    headImageLuck:{borderTopLeftRadius:setScaleSize(10), borderTopRightRadius:setScaleSize(10), width:(WIDTH - setScaleSize(40)), height:(WIDTH - setScaleSize(40)), alignItems:'center', justifyContent:"center"},
    nameView:{margin:setScaleSize(20)},
    nameText:{fontSize:setScaleSize(34), color:"#333"},
    ageLiveEduView:{marginLeft:setScaleSize(20), marginBottom:setScaleSize(30), flexDirection:'row', },
    ageLiveEdu:{fontSize:setScaleSize(24), color:'#fff'},
    ageView:{marginRight:setScaleSize(10), backgroundColor:"#669ce3", height:setScaleSize(36), borderRadius:setScaleSize(4), paddingLeft:setScaleSize(16), paddingRight:setScaleSize(16)},
    liveView:{marginRight:setScaleSize(10), backgroundColor:"#ffb234", height:setScaleSize(36), borderRadius:setScaleSize(4), paddingLeft:setScaleSize(16), paddingRight:setScaleSize(16)},
    eduView:{backgroundColor:"#32ad19", height:setScaleSize(36), borderRadius:setScaleSize(4), paddingLeft:setScaleSize(16), paddingRight:setScaleSize(16)},
    contentView:{shadowColor:"#ebebeb", shadowRadius:setScaleSize(4), shadowOffset:{width:setScaleSize(0), height:setScaleSize(2),}, backgroundColor:"#fff", borderRadius:setScaleSize(10)},

});
const pageLikeWho = StyleSheet.create({
    flatView:{flex:1, padding:setScaleSize(20), paddingTop:0, backgroundColor:"#fff"},
    flatTouch:{},
    flatItemView: {paddingTop:setScaleSize(20), paddingBottom:setScaleSize(20), borderBottomWidth:1, borderBottomColor:"#ebebeb",  width:(WIDTH - setScaleSize(40)),  flexDirection:'row',  alignItems:'center'},
    heartImg: {width: setScaleSize(120), height: setScaleSize(120),},
    realname: {color:"#333", fontSize:setScaleSize(28),},
    liveage: {color:"#888", fontSize:setScaleSize(24),},
    timeago: {color:"#888", fontSize:setScaleSize(22),},
    itemTextView: {flex:1, height: setScaleSize(120), paddingTop:setScaleSize(10), marginLeft:setScaleSize(20), justifyContent:"space-between"},
});
const pageVip = StyleSheet.create({
    titleView: { borderBottomWidth:1, borderBottomColor:"#ebebeb", paddingVertical:setScaleSize(40), paddingLeft:setScaleSize(55), width:WIDTH, justifyContent:'center',  alignItems:'flex-start'},
    titleText: {fontSize: setScaleSize(34), color: "#c19d6d", },
    vipView: {backgroundColor:"#f5f5f5", paddingVertical:setScaleSize(40), paddingHorizontal:setScaleSize(55),  justifyContent:"center", alignItems:'center'},
    vipImg:{width:(WIDTH - setScaleSize(110)), height:(WIDTH - setScaleSize(110))*361/640, justifyContent:'flex-start', alignItems:"center" },
    vipTextRowView:{width:(WIDTH - setScaleSize(110)), backgroundColor:"transparent", flexDirection:'row', paddingHorizontal:setScaleSize(40), paddingTop:setScaleSize(40), justifyContent:'space-between',},
    vipTextName:{fontSize:setScaleSize(48), color:"#fff", marginBottom:setScaleSize(20),},
    vipText1:{fontSize:setScaleSize(34), color:"#fff9e6",  },
    vipText2:{fontSize:setScaleSize(28), color:"#9e855d",  },
    vipText3:{fontSize:setScaleSize(28), color:"#fff9e6",  },
    addQQ:{color:"rgb(153,153,153)", fontSize:setScaleSize(30)},
    wechatText:{color:"rgb(153,153,153)", fontSize:setScaleSize(30), textAlign:'center', marginTop:setScaleSize(30)},
    qq:{color:"rgb(51,51,51)", width:(WIDTH - setScaleSize(47)), textAlign:'center', fontSize:setScaleSize(40), marginTop:setScaleSize(30)},
    wechatNum:{ padding:setScaleSize(18), paddingLeft:setScaleSize(40), },
    vipNumView:{ padding:setScaleSize(18), paddingLeft:setScaleSize(18)},
    vipNumTextInp:{ fontSize:setScaleSize(35),},
    openView:{padding:15, backgroundColor:"#eee"},
    openTouch:{ backgroundColor:"#ff6700",padding:10, borderRadius:5, alignItems:"center"},
    openText:{ color:"#fff", fontSize:setScaleSize(35),},
    detailView:{height:setScaleSize(152), backgroundColor:"#fff", paddingLeft:setScaleSize(40),},
    detailContent:{flex:1, flexDirection: 'row', paddingLeft:setScaleSize(15), borderBottomColor:"#ebebeb", borderBottomWidth:1, alignItems:"center"},
    detailImg:{width:setScaleSize(50), marginRight:setScaleSize(30),},
});
const PageBaseData = StyleSheet.create({
    contentView:{paddingHorizontal:setScaleSize(20), backgroundColor:"#fff"},
    loveStory: {paddingLeft: setScaleSize(10), paddingTop: setScaleSize(30), paddingBottom: setScaleSize(10), },
    loveText:{color:"#444", fontSize:setScaleSize(30)},
    loveStoryText:{color:"#888", fontSize:setScaleSize(26)},
    loveStoryContent: {paddingRight: setScaleSize(10), paddingLeft: setScaleSize(10), paddingBottom: setScaleSize(200), justifyContent: 'center',},
    isvip:{width:setScaleSize(180), height:setScaleSize(180),  position:"absolute", left:setScaleSize(20), top:setScaleSize(20),},
    nicknameText:{fontSize:setScaleSize(34), color:"#444",},
    nameIdView:{marginTop:setScaleSize(30), paddingLeft:setScaleSize(10), paddingRight:setScaleSize(32), paddingBottom:setScaleSize(30), borderBottomColor:"#ebebeb", borderBottomWidth:1},
    topCenterView:{flexDirection:"row", justifyContent:"space-between", marginVertical:setScaleSize(20), },
    centerView: {flexDirection:"row", height:50, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#e74f7b',},
    bottomBtn: {position:"absolute", width:WIDTH, bottom:setScaleSize(70), backgroundColor:"transparent", flexDirection:"row", justifyContent:"center", alignItems:"center"},
    likeBtn:{width:setScaleSize(94), height:setScaleSize(94), position:'absolute', right:setScaleSize(80), top:WIDTH-setScaleSize(67),},
    likeImg:{width:setScaleSize(94), height:setScaleSize(94),},
    titleDetail:{color:"#444", fontSize:setScaleSize(26), },
    bottomTouch:{ height:setScaleSize(114), backgroundColor:"transparent", width:setScaleSize(114), borderRadius:setScaleSize(57), marginHorizontal:setScaleSize(30), justifyContent:"center", alignItems:"center",},
    bottomImage:{height:setScaleSize(114), width:setScaleSize(114), },
    imageTextView:{position:"absolute", bottom:20,left:20},
    bottomText:{fontSize:20, marginLeft:5},
    imageTextName:{fontSize:25, marginBottom:15, color:"#fff", },
    imageTextLike:{color:"#888", fontSize:setScaleSize(28), },
    oneFlatView:{paddingBottom:setScaleSize(30), borderBottomColor:"#ebebeb", borderBottomWidth:1,},
    itemSeparator: {backgroundColor: "#ccc", height: 1,},
    item: {alignItems: "center",justifyContent: "space-between",flexDirection: "row", paddingLeft: setScaleSize(10), paddingTop: setScaleSize(30), },
    scrollView: {flex: 1, backgroundColor: "#fff"},
    headView:{padding:setScaleSize(20), paddingBottom:0, backgroundColor:"#fff"},
    headImage: {height: WIDTH-setScaleSize(40), width: WIDTH-setScaleSize(40), borderRadius:setScaleSize(12), },
    headImageLuck: { height: WIDTH-60, width: WIDTH-60,},
    content: {fontSize:setScaleSize(26), paddingRight: setScaleSize(10), color:"#888"},
    modalView:{backgroundColor:"#0005",  flex:1, justifyContent:"center", alignItems:"center", },
    modalContent:{backgroundColor:"#fff", borderRadius:setScaleSize(10),  width:setScaleSize(600), height:setScaleSize(740), },
    modalHead:{borderTopLeftRadius:setScaleSize(10), borderTopRightRadius:setScaleSize(10), backgroundColor:"#FF5D62", width:setScaleSize(600), height:setScaleSize(250), alignItems:'center', justifyContent:"center", },
    modalHeadImg:{width:setScaleSize(134), height:setScaleSize(134), borderRadius:setScaleSize(67), borderWidth:2, borderColor:"#FFF"},
    modalClose:{position:'absolute', right:setScaleSize(25), top:setScaleSize(5), color:"#FFF", fontSize:setScaleSize(50)},
    modalWechatView:{justifyContent:"space-around", alignItems:"center", flex:1,},
    modalName:{fontSize:setScaleSize(30), color:"#222"},
    modalWechat:{fontSize:setScaleSize(45), color:"#111"},
    modalCopyTouch:{width:setScaleSize(216), borderRadius:setScaleSize(8), height:setScaleSize(66), justifyContent:"center", alignItems:"center", backgroundColor:"#ff4f66"},
    modalCopy:{fontSize:setScaleSize(25), color:"#fff"},
});
const pageLogin = StyleSheet.create({
    container: {width: WIDTH, height:HEIGHT, paddingTop:setScaleSize(234), paddingLeft: setScaleSize(85), paddingRight: setScaleSize(85), justifyContent: 'flex-start',  backgroundColor: "rgba(0, 0, 0, 0.4)",  position:'absolute', top:0, },
    input: {height:setScaleSize(75), fontSize: setScaleSize(35), color: "#fff", paddingBottom: setScaleSize(20), paddingLeft:0, },
    inputView:{borderBottomWidth: 1, borderBottomColor: '#fff',  },
    icon: {width: 26, height: 26,},
    submit: {marginTop: setScaleSize(100),borderRadius:setScaleSize(2), borderWidth: 1,borderColor: "#fff",height: setScaleSize(90),justifyContent: "center",alignItems: "center",},
    submitText: {textAlign: "center", color: "#fff", fontSize: setScaleSize(35),},
    forgetpwd: {flexDirection: "row", justifyContent: "space-between", marginTop: setScaleSize(30),},
    forgetpwdText:{height:setScaleSize(60),  fontSize:setScaleSize(28), color:"#fff", },
});
const PageRegister = StyleSheet.create({
    containerView: {width: WIDTH, height:HEIGHT, justifyContent: 'flex-start',  backgroundColor: "rgba(0, 0, 0, 0.4)",  position:'absolute', top:0, },
    container: {flex:1, paddingTop:setScaleSize(234), paddingLeft: setScaleSize(85), paddingRight: setScaleSize(85), justifyContent: 'flex-start',},
    sexBtnView: {height: setScaleSize(90), flexDirection: "row",  marginTop: setScaleSize(50)},
    sexText: {textAlign: "center", alignItems: "center", color:'#fff', fontSize:setScaleSize(30)},
    submitText: { height:setScaleSize(60),  textAlign: "center", color: "#fff", fontSize: setScaleSize(28),},
    boyView: {flex:1, borderWidth:1, borderColor:"#fff", borderRadius:2, alignItems: "center", justifyContent: "center"},
    backLogin:{marginTop: setScaleSize(30), justifyContent: "center",  alignItems: "flex-end",},});
const PagePerInfo = StyleSheet.create({
    title: {height: 50, justifyContent:"center", alignItems:"center", flexDirection: "row", width: WIDTH,  backgroundColor:"#e74f7b"},
    flatItemView:{flexDirection:"row", marginLeft:setScaleSize(20), marginRight:setScaleSize(20),  backgroundColor:"#fff", alignItems:"center",justifyContent:"space-between", borderBottomWidth:1,borderBottomColor:"#ebebeb", },
    titleleftView:{marginTop:setScaleSize(40), marginBottom:setScaleSize(40), },
    itemTitle: {fontSize:setScaleSize(28), color:"#333", marginLeft:setScaleSize(10)},
    itemContentText: {fontSize:15, margin:1, },
    titleBack:{position:"absolute", left:setScaleSize(30), paddingVertical:setScaleSize(15), width:setScaleSize(80),},
    titleRight:{position:"absolute", right:setScaleSize(30), },
    titleBackIcon:{marginLeft:setScaleSize(10), height:setScaleSize(30), width:setScaleSize(30), borderColor:"#fff", borderBottomWidth:3, borderLeftWidth:3, transform:[{rotateZ:'45deg'}]},
    // areaView:{borderWidth:2, borderColor:"#ccc", position:'absolute', top:100, left: 20, maxWidth: WIDTH - 40, backgroundColor:"#fff",},
    footView:{marginTop:setScaleSize(40), flexDirection:"row", justifyContent:"center"},
    footBtnText:{fontSize:setScaleSize(24), color:"#E7507D",},
    areaProView:{width:69, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5", padding:5, margin:1, },
    introduce:{paddingLeft:setScaleSize(20),height:setScaleSize(280), flex:1, borderWidth:1, borderColor:"#ebebeb", color:"#888", alignItems:"flex-start", justifyContent:"flex-start", fontSize:setScaleSize(28)},
    footerView:{ padding:setScaleSize(20), paddingTop:setScaleSize(40), paddingBottom:setScaleSize(40),},
    footBtn:{width:setScaleSize(260), marginLeft:setScaleSize(10), marginRight:setScaleSize(10), height:setScaleSize(88), borderWidth:1, borderColor:"#E7507D", borderRadius:setScaleSize(4), justifyContent:"center", alignItems:"center",},
    itemTextInput:{padding:0, fontSize:setScaleSize(28), height:setScaleSize(50),  color:"#888", width:150, textAlign:"right", alignItems:'flex-end', },
    areaDate:{fontSize:setScaleSize(28), color:"#888", },
    picker:{ padding:0,backgroundColor:"#238" , width:100, height:setScaleSize(70),  flex:1, justifyContent:"flex-end", alignItems:'flex-end', },
    pickerItem:{padding:0,margin:0, backgroundColor:"#631", height:setScaleSize(70), },
    pickerArea:{padding:0,  width:120, color:"rgb(85, 85, 85)",},
});
const pageChangePwd = StyleSheet.create({
    changeView:{padding:setScaleSize(40), paddingTop:setScaleSize(35), flex:1, justifyContent:"flex-start"},
    changeText:{color:"#333", paddingVertical:setScaleSize(24), paddingLeft:setScaleSize(18), fontSize:setScaleSize(34), marginBottom:setScaleSize(40), backgroundColor:"#e5e5e5"},
    submitTouch:{borderRadius:setScaleSize(8), height:setScaleSize(94), backgroundColor:"#2FB9C3", justifyContent:"center", alignItems:"center"},
    submitText:{color:"#fff", fontSize:setScaleSize(30)},
});
const chatScreen = StyleSheet.create({
    itemView:{minHeight:setScaleSize(80), flexDirection:"row", alignItems:"center",  margin:setScaleSize(20),},
    headImg:{width:setScaleSize(50), height:setScaleSize(50), marginHorizontal:setScaleSize(20)},
    msgText:{backgroundColor:"#fff", maxWidth:WIDTH/2, fontSize:setScaleSize(25), color:"#333", textAlign:'right', padding:setScaleSize(8), borderRadius:setScaleSize(18), borderWidth:1, borderColor:"#333"},
    barView:{flexDirection:"row", justifyContent:"space-around", alignItems:"center", backgroundColor:"#f6f3fa", height:setScaleSize(116), width:WIDTH, borderBottomWidth:1, borderTopWidth:1, borderColor:"#dbdbdb", },
    voiceImg:{width:setScaleSize(66), height:setScaleSize(66), },
    msgTextIpt:{width:setScaleSize(466), height:setScaleSize(80), backgroundColor:"#fcfcfc", borderColor:"#dce5de", borderWidth:1, borderRadius:setScaleSize(8), },
});
const styles = {
    PageRegister: PageRegister,
    PagePerInfo:PagePerInfo,
    pageLogin: pageLogin,
    PageBaseData: PageBaseData,
    homePage: homePage,
    minePage: minePage,
    live: live,
    tabbar: tabbar,
    pageChangePwd: pageChangePwd,
    WIDTH: WIDTH,
    HEIGHT: HEIGHT,
    pageLuck:pageLuck,
    pageLikeWho:pageLikeWho,
    pageVip:pageVip,
    chatScreen:chatScreen,
    setScaleSize:setScaleSize,
    setSizeText:setSizeText,
    isIOS:isIOS,
};
export default styles;
