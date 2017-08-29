import React from 'react';
import {StyleSheet, ScrollView, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity, Modal,
    TouchableHighlight, Image, TextInput, BackHandler, ToastAndroid, AsyncStorage } from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import Swiper from 'react-native-swiper';
import WebIM from '../../WebIM';
import storage from '../libs/storage';
import { connect } from 'react-redux';
import {initMsgData, msgData} from '../redux/action/actions';
import JPushModule from 'jpush-react-native';

global.WebIM = WebIM;

class Login extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            msgData:{},
            isVisibleModal:false,
        };

        this.reqLogout = this.reqLogout.bind(this);
        this._get('loginUP');
        this.webIMConnection();
    }

    componentDidMount(){
        this.initMsgData();
        this.jpush();
    }

    componentWillUnmount() {

    }

    jpush(){
        if(!styles.isIOS) JPushModule.initPush();
        console.log("jpush");
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

    webIMConnection(){
        let that = this;
        WebIM.conn.listen({
            onOpened: function ( message ) {          //连接成功回调
                // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
                // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
                // 则无需调用conn.setPresence();
                console.log('loginsuccess');
                that.setState({isVisibleModal:false});
                that.props.navigation.navigate('Tab');
            },
            onClosed: function ( message ) {
                console.log("onClosed");
                requestData("https://app.jiaowangba.com/login_out", (res)=>{
                    if (res.status != 'error') {
                    }
                });
                this.setState({isVisibleModal:true});
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
                  Alert.alert('错误', '请重新登录');
                //   NavigationActions.login()
                  return;
                }
                // 8: offline by multi login
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
                  console.log('WEBIM_CONNCTION_SERVER_ERROR');
                  Alert.alert('错误', '请重新登录');
                //   NavigationActions.login()
                  return;
                }
                if (error.type == 1) {
                  let data = error.data ? error.data.data : ''
                  Alert.alert('Error', 'offline by multi login')
                //   store.dispatch(LoginActions.loginFailure(error))
                }
            },
            onTextMessage: function ( message ) {
                console.log(JSON.stringify(message));
                message.isOther = true;
                message.msgType = 'txt';
                that.props.dispatch(msgData(message));
            },    //收到文本消息
            onPictureMessage: function ( message ) {
                console.log(JSON.stringify(message));
                message.isOther = true;
                message.msgType = 'img';
                // that.handleRefreshMessage({path:message.url}, true, 'img');
                that.props.dispatch(msgData(message));
            }, //收到图片消息
        });
    }

    reqLogin(isFirst){

        requestData(`https://app.jiaowangba.com/login?telephone=${this.state.tel}&password=${this.state.pwd}`, (res)=>{
            if (res.type) {
                alert("错误", res.target._response);
            }
            if (res.status == "success") {
                storage.save('loginUP', JSON.stringify(res.code));
                console.log('reqsuccess');
                global.peruuid = res.code.uuid;
                let options = {
                    apiUrl: WebIM.config.apiURL,
                    user: res.code.uuid,
                    pwd: res.code.password,
                    appKey: WebIM.config.appkey
                };
                WebIM.conn.open(options);
            }else if (res.status == "redirect") {
                console.log('reqredirect');
                global.peruuid = this.state.msgData.uuid;
                let options = {
                    apiUrl: WebIM.config.apiURL,
                    user: this.state.msgData.uuid,
                    pwd: this.state.msgData.password,
                    appKey: WebIM.config.appkey
                };
                WebIM.conn.open(options);
                this.setState({isVisibleModal:false});
                this.props.navigation.navigate('Tab');
            }else {
                this.reqLogout();
                if (isFirst) {
                    return;
                }
                Alert.alert('提示', res.msg,
                    [{text: 'OK', onPress: () => null},],
                    { cancelable: false }
                );
            }
        });
    }

    reqLogout(){
        requestData("https://app.jiaowangba.com/login_out", (res)=>{
            if (res.status != 'error') {
            }
        });
        global.WebIM.conn.close();
        this.setState({isVisibleModal:true});
    }

    // 获取本地聊天记录
    async initMsgData() {
        try {// try catch 捕获异步执行的异常
            var value = await AsyncStorage.getItem('msgData');
            if (value !== null){
                this.props.dispatch(initMsgData(JSON.parse(value)));
            } else {
                this.props.dispatch(initMsgData({}));
                console.log('消息记录为空');
            }
            this.reqLogin(true);
        } catch (error) {
            console.log('_get() error: ', error.message);
        }
    }

    async _get(key) {
        try {// try catch 捕获异步执行的异常
            var value = await AsyncStorage.getItem(key);
            if (value !== null){
                this.setState({msgData:JSON.parse(value)});
            } else {
                this.setState({msgData:{}});
            }
        } catch (error) {
            console.log('_get() error: ', error.message);
        }
    }

    handleLogin(){
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
            );
            return;
        }
        this.reqLogin();
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
        let that = this;
        return (
            <View style={{flex:1, backgroundColor:"#fff"}}>
                <Modal transparent={false} animationType="fade" visible={this.state.isVisibleModal} onRequestClose={()=>false}>
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
                        <View style={[styles.pageLogin.inputView, {marginTop:styles.setScaleSize(30)}]}>
                            <TextInput onChangeText={(pwd)=>this.setState({pwd:pwd})} secureTextEntry={true} underlineColorAndroid="transparent" placeholderTextColor="#fff" placeholder="密码" style={styles.pageLogin.input} />
                        </View>
                        <TouchableOpacity onPress={()=>this.handleLogin()} style={styles.pageLogin.submit}>
                            <View><Text style={styles.pageLogin.submitText}>登录</Text></View>
                        </TouchableOpacity>
                        <View style={styles.pageLogin.forgetpwd}>
                            <Text style={styles.pageLogin.forgetpwdText} onPress={()=>Alert.alert("提示", "请加客服微信:hunlian21", [{text:"OK", onPress:()=>null}])}>忘记密码</Text>
                            <Text style={styles.pageLogin.forgetpwdText} onPress={()=>{this.setState({isVisibleModal:false});this.props.navigation.navigate("PageRegister", {logout:()=>that.reqLogout()})}}>用户注册</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

}

const mapStateToProps = state => ({
    msgData: state.msgData,
})

export default connect(mapStateToProps)(Login);
