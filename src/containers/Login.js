import React from 'react';
import {StyleSheet, ScrollView, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity, Modal,
    TouchableHighlight, Image, TextInput, BackHandler, ToastAndroid, AsyncStorage } from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import Swiper from 'react-native-swiper';
import WebIM from '../../WebIM';
import storage from '../libs/storage';
import { connect } from 'react-redux';
import {initMsgData, msgData, msgList} from '../redux/action/actions';
import JPushModule from 'jpush-react-native';
import SQLite from '../components/SQLite';
let sqLite = new SQLite();

class Login extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            msgData:{},
        };

        this.reqLogout = this.reqLogout.bind(this);
        if(!global.db){
          global.db = sqLite.open();
        }
        sqLite.createTable();
        sqLite.createTableMessageList();
        this._get('loginUP');
    }

    componentDidMount(){
        this.initMsgData();
        if(!styles.isIOS) this.jpush();
        this.reqLogin(true);
    }

    componentWillUnmount() {
        sqLite.close();
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
        storage.save('isLogin', 'true');
        this.initMsgData();
        let options = {
            apiUrl: WebIM.config.apiURL,
            user: uuid,
            pwd: pwd,
            appKey: WebIM.config.appkey
        };
        this.props.navigation.navigate('Tab');
        WebIM.conn.open(options);
    }

    reqLogin(isFirst){
        requestData(`https://app.jiaowangba.com/login?telephone=${this.state.tel}&password=${this.state.pwd}`, (res)=>{
            if (res.type) {
                alert("错误", res.target._response);
            }
            if (res.status == "success") {
                storage.save('loginUP', JSON.stringify(res.code));
                console.log('reqsuccess');
                this.reqLoginHX(res.code.uuid, res.code.password);
            }else if (res.status == "redirect") {
                console.log('reqredirect');
                this.reqLoginHX(this.state.msgData.uuid, this.state.msgData.password);
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
                storage.save('isLogin', 'false');
                global.WebIM.conn.close();
            }
        });
    }

    // 获取本地聊天记录
    initMsgData() {
        //开启数据库
        if(!global.db){
          global.db = sqLite.open();
        }
        global.db.transaction((tx)=>{
          tx.executeSql("select * from user WHERE selfUuid = '" + global.peruuid + "' ", [], (tx, results)=>{
            let len = results.rows.length;
            let msgData = [];
            for(let i=0; i < len; i++){
              let u = results.rows.item(i);
              msgData.push(u)

            }
            this.props.dispatch(initMsgData(msgData));
          });
        },(error)=>{//打印异常信息
          console.warn(error);
        });
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
                        <Text style={styles.pageLogin.forgetpwdText} onPress={()=>{this.props.navigation.navigate("PageRegister", {logout:()=>that.reqLogout()})}}>用户注册</Text>
                    </View>
                </View>
            </View>
        );
    }

}

const mapStateToProps = state => ({
    msgData: state.msgData,
})

export default connect(mapStateToProps)(Login);
