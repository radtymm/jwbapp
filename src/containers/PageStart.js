import React from 'react';
import {
    StyleSheet, ScrollView, Alert, View, AsyncStorage,
} from 'react-native';

import styles from '../styleSheet/Styles';
import storage from '../libs/storage';
import WebIM from '../../WebIM';
import {requestData, requestDataPost,} from '../libs/request.js';
import { connect } from 'react-redux';
import {initMsgData, msgData, msgList} from '../redux/action/actions';

global.WebIM = WebIM;

class PageStart extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

        };
        this.handleReceiveMsg = this.handleReceiveMsg.bind(this);
        this._get = this._get.bind(this);
    }

    componentDidMount() {
        this.webIMConnection();
        this._get();
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
                  Alert.alert('错误', '请重新登录', [
                      {text:'确定', onPress:()=>{
                          that.reqLogout();
                          that.props.navigation.navigate("Login");
                      }}
                  ]);
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
                    Alert.alert('错误', '请重新登录', [
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
            var value = await AsyncStorage.getItem('isLogin');
            console.log(value);
            if (value !== "true"){
                this.props.navigation.navigate('Login');
            } else {
                this._getUuid();
                this.props.navigation.navigate('Tab');
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
            } else {
            }
        } catch (error) {
            console.log('_get() error: ', error.message);
        }
    }

    handleReceiveMsg(msg, type){
        let message = msg;
        let that = this;
        if (!message.delay) {
            let dateNow = new Date();
            let month = ((dateNow.getMonth()+1) < 10)?("0"+(dateNow.getMonth()+1)):(dateNow.getMonth()+1);
            let date = ((dateNow.getDate()) < 10)?("0"+dateNow.getDate()):(dateNow.getDate());
            let hour = ((dateNow.getUTCHours()) < 10)?("0"+dateNow.getUTCHours()):(dateNow.getUTCHours());
            let min = ((dateNow.getMinutes()) < 10)?("0"+dateNow.getMinutes()):(dateNow.getMinutes());
            let second = ((dateNow.getSeconds()) < 10)?("0"+dateNow.getSeconds()):(dateNow.getSeconds());
            message.delay = dateNow.getFullYear() + "-" + month + '-' + date + 'T' + hour + ':' + min + ':' + second;
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
                Alert.alert("提示", "网络异常");
            }
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor:"#fff"}} >
            </View>
        );
    }
}


const mapStateToProps = state => ({
    msgData: state.msgData,
})

export default connect(mapStateToProps)(PageStart);
