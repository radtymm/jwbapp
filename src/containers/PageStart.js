import React from 'react';
import {
    StyleSheet, ScrollView, Alert, View, AsyncStorage, BackHandler, ToastAndroid,
} from 'react-native';

import styles from '../styleSheet/Styles';
import storage from '../libs/storage';
import WebIM from '../../WebIM';
import {requestData, requestDataPost,} from '../libs/request.js';
import { connect } from 'react-redux';
import {initMsgData, msgData, msgList} from '../redux/action/actions';
import Sound from 'react-native-sound';
import PushNotification from 'react-native-push-notification';
import JPushModule from 'jpush-react-native';


global.WebIM = WebIM;

class PageStart extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

        };
        this.handleReceiveMsg = this.handleReceiveMsg.bind(this);
        this.reqLoginHX = this.reqLoginHX.bind(this);
        this._get = this._get.bind(this);
        this.notificationConfig = this.notificationConfig.bind(this);
    }

    componentDidMount() {
        this.webIMConnection();
        if(!styles.isIOS) this.notificationConfig();
        // if(!styles.isIOS) this.jpush();
        global.appState = 'active';
    }

    notificationConfig(){
        let that = this;
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
                console.log( 'TOKEN:', token );
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
                console.log( 'NOTIFICATION:', notification );
                that.props.navigation.navigate("MyNotificationsScreen");
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
              * (optional) default: true
              * - Specified if permissions (ios) and token (android and ios) will requested or not,
              * - if not, you must call PushNotificationsHandler.requestPermissions() later
              */
            requestPermissions: true,
        });
    }

    webIMConnection(){

        let that = this;
        WebIM.conn.listen({
            onOpened: function ( message ) {          //连接成功回调
                // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
                // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
                // 则无需调用conn.setPresence();
                console.log('loginsuccess');
            },
            onClosed: function ( message ) {
                console.log("onClosed");
                that.reqLogout();
            },         //连接关闭回调
            onError: (error) => {
                console.log(error)
                // 16: server-side close the websocket connection
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
                  console.log('WEBIM_CONNCTION_DISCONNECTED', WebIM.conn.autoReconnectNumTotal, WebIM.conn.autoReconnectNumMax);
                  if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
                    return;
                  }
                  let options = {
                      apiUrl: WebIM.config.apiURL,
                      user: global.peruuid,
                      pwd: global.perpwd,
                      appKey: WebIM.config.appkey
                  };
                  WebIM.conn.open(options);
                //   NavigationActions.login()
                  return;
                }
                // 8: offline by multi login
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
                  console.log('WEBIM_CONNCTION_SERVER_ERROR');
                  Alert.alert('错误', '您的账号在其他设备上登录', [
                      {text:'确定', onPress:()=>{
                          that.reqLogout();
                          that.props.navigation.navigate("Login");
                      }}
                  ]);
                  return;
                }
                if (error.type == 1) {
                  let data = error.data ? error.data.data : ''
                //   Alert.alert('Error', 'offline by multi login')
                //   store.dispatch(LoginActions.loginFailure(error))
                    Alert.alert('错误', '请重新登录2'+ JSON.stringify(error), [
                        {text:'确定', onPress:()=>{
                            that.reqLogout();
                            that.props.navigation.navigate("Login");
                        }}
                    ]);
                }
            },
            onTextMessage: function ( message ) {
                console.log(JSON.stringify(message));
                that.handleReceiveMsg(message, 'txt');
            },    //收到文本消息
            onPictureMessage: function ( message ) {
                console.log(JSON.stringify(message));
                that.handleReceiveMsg(message, 'img');
            }, //收到图片消息
        });
        this._get();

    }

    reqLogout(){
        requestData("https://app.jiaowangba.com/login_out", (res)=>{
            if (res.status != 'error') {
                storage.save('isLogin', 'false');
                global.WebIM.conn.close();
            }
        });
    }

    async _get() {
        try {// try catch 捕获异步执行的异常
            let value = await AsyncStorage.getItem('isLogin');
            value = JSON.parse(value);
            console.log(value);
            if (!value.isLogin){
                console.log(JSON.stringify(value));
                this.props.navigation.navigate('Login');
            } else {
                requestData(`https://app.jiaowangba.com/login?telephone=${value.tel}&password=${value.pwd}`, (res)=>{
                    if (res.type) {
                        this.props.navigation.navigate('Login');
                    }
                    if (res.status == "success") {
                        global.tel = value.tel;
                        global.pwd = value.pwd;
                        this.reqLoginHX(res.code.uuid, res.code.password);
                    }else if (res.status == "redirect") {
                        console.log('reqredirect');
                        this._getUuid();
                    }else {
                        this.props.navigation.navigate('Login');
                    }
                });

                // this.props.navigation.navigate('Tab');
            }
        } catch (error) {
            console.log('_get() error: ', error.message);
        }
    }

    async _getUuid (){
        try {// try catch 捕获异步执行的异常
            var value = await AsyncStorage.getItem('loginUP');
            if (value !== null){
                global.peruuid = JSON.parse(value).uuid;
                this.reqLoginHX(JSON.parse(value).uuid, JSON.parse(value).password);
            } else {
            }
        } catch (error) {
            console.log('_get() error: ', error.message);
        }
    }

    async _play() {
        // console.log(Sound.MAIN_BUNDLE);
        // console.log(Sound.DOCUMENT);
        // console.log(Sound.LIBRARY);
        // console.log(Sound.CACHES);
        setTimeout(() => {
          var sound = new Sound('message.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
            }
          });

          setTimeout(() => {
            sound.play((success) => {
              if (success) {
                console.log('successfully finished playing');
              } else {
                console.log('playback failed due to audio decoding errors');
              }
            });
          }, 100);
        }, 100);
    }

    jpush(){
        JPushModule.initPush();
        // 在收到点击事件之前调用此接口
        JPushModule.notifyJSDidLoad((resultCode) => {
            if (resultCode === 0) {
            }
        });
        JPushModule.addReceiveNotificationListener((map) => {
            console.log("alertContent: " + map.alertContent);
            console.log("extras: " + map.extras);
            // var extra = JSON.parse(map.extras);
            // console.log(extra.key + ": " + extra.value);
        });

        JPushModule.addReceiveOpenNotificationListener((map) => {
            console.log("Opening notification!");
            console.log("map.extra: " + map.key);
        });

    }

    reqLoginHX(uuid, pwd){
        global.peruuid = uuid;
        global.perpwd = pwd;
        let options = {
            apiUrl: WebIM.config.apiURL,
            user: uuid,
            pwd: pwd,
            appKey: WebIM.config.appkey
        };
        WebIM.conn.open(options);
        this.props.navigation.navigate('Tab');
    }

    handlePushNotification(){
        if (global.appState == 'active') {
            return;
        }
        PushNotification.localNotification({
            /* Android Only Properties */
            id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            // ticker: "My Notification Ticker", // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
            // subText: "请点击查看", // (optional) default: none
            color: "red", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            group: "group", // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification

            /* iOS and Android properties */
            title: "交往吧婚恋", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            message: "您收到一条新消息", // (required)
            playSound: true, // (optional) default: true
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        });
    }

    handleReceiveMsg(msg, type){
        if(!styles.isIOS) this.handlePushNotification();
        // this._play();
        let message = msg;
        let that = this;
        if (!message.delay) {
            let dateNow = new Date();
            message.delay = dateNow.toJSON();
        }

        if (type == 'txt') {
            message.url = '';
        }else if(type == 'img'){
            message.data = '';
        }

        that.props.dispatch(msgData({
            selfUuid:global.peruuid,
            otherUuid:message.from,
            isOther:'true',
            hxId:message.id,
            msgType: type,
            delay:message.delay,
            data:message.data,
            isReaded:'false',
            url:message.url,
        }));

        requestData('https://app.jiaowangba.com/info?uuid=' + message.from, (res)=>{
            if (res.status == 'success') {

                that.props.dispatch(msgList({
                    selfUuid:global.peruuid,
                    otherUuid:message.from,
                    selfAndOtherid:global.peruuid + "&&" + message.from,
                    headUrl: res.code.avatar,
                    otherName:res.code.nickname,
                    isOther:'true',
                    message:message.data,
                    time:message.delay,
                    msgType:type,
                    countNoRead:1,
                }));
            }else {
                Alert.alert("提示", "网络异常， 请重新登录");
            }
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor:"#fff"}} />
        );
    }
}


const mapStateToProps = state => ({
    msgData: state.msgData,
})

export default connect(mapStateToProps)(PageStart);
