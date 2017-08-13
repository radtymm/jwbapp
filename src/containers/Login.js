import React from 'react';
import {StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, } from 'react-native';
import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';
import PageBaseData from './PageBaseData';
import jwbapp from './App';
import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import Swiper from 'react-native-swiper';
// import WebIM from '../../WebIM';



class Login extends React.Component {

    static navigationOptions = {
      headerTitle:"登录",
      headerStyle:styles.homePage.headerStyle,
    };



    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    }

    componentDidMount(){
        requestData(`https://app.jiaowangba.com/login?telephone=${this.state.tel}&password=${this.state.pwd}`, (res)=>{
            if (res.status != "error") {
                this.props.navigation.navigate('Tab');
                return;
            }
        });

        // console.log(WebIM);
        // console.log(WebIM.conn);
        // console.log(WebIM.conn.listen);
        // WebIM.conn.listen({
        //     onOpened: function ( message ) {          //连接成功回调
        //         // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        //         // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        //         // 则无需调用conn.setPresence();
        //         console.log("----------");
        //     },
        //     onClosed: function ( message ) {console.log("----------"); },         //连接关闭回调
        //     onTextMessage: function ( message ) {console.log("----------"); },    //收到文本消息
        //     onEmojiMessage: function ( message ) {console.log("----------"); },   //收到表情消息
        //     onPictureMessage: function ( message ) {console.log("----------"); }, //收到图片消息
        //     onCmdMessage: function ( message ) {console.log("----------"); },     //收到命令消息
        //     onAudioMessage: function ( message ) {console.log("----------"); },   //收到音频消息
        //     onLocationMessage: function ( message ) {console.log("----------"); },//收到位置消息
        //     onFileMessage: function ( message ) {console.log("----------"); },    //收到文件消息
        //     onVideoMessage: function (message) {
        //         var node = document.getElementById('privateVideo');
        //         var option = {
        //             url: message.url,
        //             headers: {
        //               'Accept': 'audio/mp4'
        //             },
        //             onFileDownloadComplete: function (response) {
        //                 var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
        //                 node.src = objectURL;
        //             },
        //             onFileDownloadError: function () {
        //                 console.log('File down load error.')
        //             }
        //         };console.log("----------");
        //         WebIM.utils.download.call(conn, option);
        //     },   //收到视频消息
        //     onPresence: function ( message ) {console.log("----------"); },       //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
        //     onRoster: function ( message ) {console.log("----------"); },         //处理好友申请
        //     onInviteMessage: function ( message ) {console.log("----------"); },  //处理群组邀请
        //     onOnline: function () {console.log("----------"); },                  //本机网络连接成功
        //     onOffline: function () {console.log("----------"); },                 //本机网络掉线
        //     onError: function ( message ) {console.log("----------"); },          //失败回调
        //     onBlacklistUpdate: function (list) {       //黑名单变动
        //         // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        //         console.log(list);console.log("----------");
        //     },
        //     onReceivedMessage: function(message){console.log("----------"); },    //收到消息送达客户端回执
        //     onReadMessage: function(message){console.log("----------"); },        //收到消息已读回执
        //     onCreateGroup: function(message){console.log("----------"); },        //创建群组成功回执（需调用createGroupNew）
        //     onMutedMessage: function(message){console.log("----------"); }        //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
        // });
        //
        //
        // var options = {
        //     username: 'username',
        //     password: 'password',
        //     nickname: 'nickname',
        //     appKey: WebIM.config.appkey,
        //     success: function () { console.log("success"); },
        //     error: function () {console.log("error"); },
        //     apiUrl: WebIM.config.apiURL
        //   };
        //   WebIM.conn.registerUser(options);
    }

      handleLogin(){
          let that = this;
          if (!this.state.tel || this.state.tel=="") {
              Alert.alert('提示', '手机号码不能为空，请重新填写',
                  [{text: 'OK', onPress: () => null},],
                  { cancelable: false }
              )
              return;
          }
          if (!this.state.pwd || this.state.pwd=="") {
              Alert.alert('提示', '密码不能为空，请重新填写',
                  [{text: 'OK', onPress: () => null},],
                  { cancelable: false }
              )
              return;
          }
          requestData(`https://app.jiaowangba.com/login?telephone=${this.state.tel}&password=${this.state.pwd}`, (res)=>{
              if (res.status != "error") {
                  that.props.navigation.navigate('Tab');
                  return;
              }
              Alert.alert('提示', res.msg,
                  [{text: 'OK', onPress: () => null},],
                  { cancelable: false }
              );
          });
      }

      renderImg(){
          let imageViews=[];
          let srcImg = [require('../images/img0.jpg'), require('../images/img1.jpg'), require('../images/img2.jpg'), ];
          for(let i=0;i < 3;i++){
              imageViews.push(
                  <Image key={i} resizeMode="cover" style={{height:styles.HEIGHT, width:styles.WIDTH,}} source={srcImg[i]} />
              );
          }
          return imageViews;
      }

      render() {

        return (
          <View style={{flex:1,}}>
              <Swiper height={styles.HEIGHT} width={styles.WIDTH}
                    loop={styles.isIOS?false:true}
                    showsButtons={false}
                    showsPagination={false}
                    index={0}
                    autoplayTimeout={5}
                    autoplay={true}
                    horizontal={true}
                    >
                 {this.renderImg()}
             </Swiper>
            <View style={styles.pageLogin.container}>
              <View style={styles.pageLogin.inputView}>
                  <TextInput onChangeText={(tel)=>this.setState({tel:tel})} underlineColorAndroid="transparent" placeholderTextColor="#fff" keyboardType='numeric' placeholder="手机号" style={styles.pageLogin.input} />
              </View>
              <View style={[styles.pageLogin.inputView, {marginTop:styles.setScaleSize(50)}]}>
                  <TextInput onChangeText={(pwd)=>this.setState({pwd:pwd})} secureTextEntry={true} underlineColorAndroid="transparent" placeholderTextColor="#fff" placeholder="密码" style={styles.pageLogin.input} />
              </View>
              <TouchableOpacity onPress={()=>this.handleLogin()} style={styles.pageLogin.submit}>
                <View><Text style={styles.pageLogin.submitText}>登录</Text></View>
              </TouchableOpacity>
                <View style={styles.pageLogin.forgetpwd}>
                    <Text style={styles.pageLogin.forgetpwdText} onPress={()=>Alert.alert("提示", "请加客服微信:hunlian21", [{text:"OK", onPress:()=>null}])}>忘记密码</Text>
                    <Text style={styles.pageLogin.forgetpwdText} onPress={()=>{this.props.navigation.navigate("PageRegister")}}>用户注册</Text>
                </View>
            </View>
          </View>
        );
      }
}


export default Login;
