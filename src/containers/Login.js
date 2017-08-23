import React from 'react';
import {StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, BackHandler, ToastAndroid } from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import Swiper from 'react-native-swiper';
import WebIM from '../../WebIM';
import storage from '../libs/storage';

global.WebIM = WebIM;

class Login extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

        };
        this.webIMConnection();
    }

    componentDidMount(){
        this.reqLogin(true);

        // 添加返回键监听
        // BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);

    }

    componentWillUnmount(){
         // 移除返回键监听
        //  BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
    }

    onBackHandler = () => {
        // if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        //     //最近2秒内按过back键，可以退出应用。
        //     return false;
        // }
        // this.lastBackPressed = Date.now();
        // ToastAndroid.show('再按一次退出应用', 2000);
        // return true;
    };

    webIMConnection(){
        let that = this;
        global.WebIM.conn.listen({
            onOpened: function ( message ) {          //连接成功回调
                // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
                // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
                // 则无需调用conn.setPresence();
                console.log('loginsuccess');
                that.props.navigation.navigate('Tab');
            },

            onError: (error) => {
              Alert.alert('登录失败', '请退出重新登录');
              if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
                // console.log('WEBIM_CONNCTION_DISCONNECTED');
                return;
              }

              if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
                // console.log('WEBIM_CONNCTION_SERVER_ERROR');
                return;
              }
              if (error.type == 1) {
                let data = error.data ? error.data.data : ''
                data && Alert.alert('Error', data)
              }
            },
        });

    }

    reqLogin(isFirst){
        // global.WebIM.conn.close();
        requestData(`https://app.jiaowangba.com/login?telephone=${this.state.tel}&password=${this.state.pwd}`, (res)=>{
            if (res.status == "success") {

                let options = {
                  apiUrl: global.WebIM.config.apiURL,
                  user: 'radtymm3',
                  pwd: '1314520',
              //   user: res.code.uuid,
              //   pwd: res.code.password,
                  success: function (token) {
                    var token = token.access_token;
                    WebIM.utils.setCookie('webim_' + encryptUsername, token, 1);
                  },
                  appKey: global.WebIM.config.appkey
                };
                global.WebIM.conn.open(options);
            }else if (res.status == "redirect") {
                this.props.navigation.navigate('Tab');
            }else {
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
                    <View style={[styles.pageLogin.inputView, {marginTop:styles.setScaleSize(30)}]}>
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
