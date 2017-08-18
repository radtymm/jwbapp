import React from 'react';
import {StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, BackHandler, ToastAndroid } from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import Swiper from 'react-native-swiper';
import WebIM from '../../WebIM';

class Login extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

        };
        this.webIMConnection();
    }

    componentDidMount(){
        requestData(`https://app.jiaowangba.com/login?telephone=${this.state.tel}&password=${this.state.pwd}`, (res)=>{
            if (res.status != "error") {
                this.props.navigation.navigate('Tab');
                return;
            }
        });

        // 添加返回键监听
        BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);

    }

    componentWillUnmount(){
         // 移除返回键监听
         BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
    }

    onBackHandler = () => {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', 2000);
        return true;
    };

    webIMConnection(){
        WebIM.conn.listen({
            onOpened: function ( message ) {          //连接成功回调
                // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
                // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
                // 则无需调用conn.setPresence();
                console.log("onOpened");
            },
            onError: (error) => {
              console.log(error)
              // 16: server-side close the websocket connection
              if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
                console.log('WEBIM_CONNCTION_DISCONNECTED');

                Alert.alert('Error', 'server-side close the websocket connection')
                return;
              }
              // 8: offline by multi login
              if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
                console.log('WEBIM_CONNCTION_SERVER_ERROR');
                Alert.alert('Error', 'offline by multi login')
                return;
              }
              if (error.type == 1) {
                let data = error.data ? error.data.data : ''
                data && Alert.alert('Error', data)
              }
            },
        });
        let options = {
          apiUrl: WebIM.config.apiURL,
          user: 'radtymm2',
          pwd: '1314520',
          appKey: WebIM.config.appkey
        };
        WebIM.conn.open(options);
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
