import React from 'react';
import {
     ScrollView,  Alert, View, Text, Button,  TouchableOpacity,
     Image, TextInput,
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import Swiper from 'react-native-swiper';

class PageForgetPwd extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            tel:"",
            pwd:"",
            code:"",
            disabledCode:false,
            countDown:0,
        };
    }

    componentDidMount() {

    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    handleGetCode(){
        let that = this;
        requestData("https://app.jiaowangba.com/forgot_password_send_sms.html?telephone=" + this.state.tel, (res)=>{
            Alert.alert("提示", res.msg);
            if (res.status == 'success') {
                this.setState({disabledCode:true, countDown:59});
                this.interval = setInterval(function () {
                    if (that.state.countDown == 0) {
                        that.setState({disabledCode:false});
                        clearInterval(that.interval);
                    }else {
                        that.setState({countDown:that.state.countDown-1});
                    }
                }, 1000);
            }
        });
    }

    handleSubmit(){
        if (this.state.tel == "") {
            Alert.alert("提示", "请输入手机号");
            return;
        }
        if (this.state.pwd == "") {
            Alert.alert("提示", "请输入密码");
            return;
        }
        if (this.state.pwd.length < 6) {
            Alert.alert("提示", "密码不能小于6位");
            return;
        }
        if (this.state.code == "") {
            Alert.alert("提示", "请输入验证码");
            return;
        }
        requestData("https://app.jiaowangba.com/forgot_password.html?telephone="+this.state.tel+"&code="+this.state.code+"&password="+this.state.pwd, (res)=>{

            Alert.alert("提示", res.msg);
        })
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
            <View style={{flex: 1,}} >
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
              <View style={styles.PageRegister.containerView}>
                <ScrollView style={{flex: 1,}}>
                    <View style={styles.PageRegister.container}>
                        <View style={styles.pageLogin.inputView}>
                            <TextInput onChangeText={(tel) => this.setState({tel: tel})} underlineColorAndroid="transparent"
                               placeholderTextColor="#fff" keyboardType='numeric' placeholder="输入手机号"
                               style={styles.pageLogin.input}/>
                        </View>
                        <View style={styles.pageForgetPwd.codeView}>
                            <View style={[styles.pageForgetPwd.inputView, {marginTop:styles.setScaleSize(50)}]}>
                                <TextInput onChangeText={(code) => this.setState({code: code})}
                                   underlineColorAndroid="transparent" placeholderTextColor="#fff" placeholder="输入验证码"
                                   style={styles.pageForgetPwd.inputCode}/>
                            </View>
                            <TouchableOpacity disabled={this.state.disabledCode} style={[styles.pageForgetPwd.getCode,]} onPress={()=>{this.handleGetCode()}}>
                                <View><Text style={styles.pageForgetPwd.submitText}>获取验证码{this.state.countDown==0?"":'('+this.state.countDown+'秒)'}</Text></View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.pageLogin.inputView, {marginTop:styles.setScaleSize(50)}]}>
                            <TextInput onChangeText={(pwd) => this.setState({pwd: pwd})} secureTextEntry={true}
                               underlineColorAndroid="transparent" placeholderTextColor="#fff" placeholder="设置新密码"
                               style={styles.pageLogin.input}/>
                        </View>
                        <TouchableOpacity onPress={()=>{this.handleSubmit()}} style={[styles.pageLogin.submit, {marginTop:styles.setScaleSize(150)}]}>
                            <View><Text style={styles.pageLogin.submitText}>提交</Text></View>
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity onPress={() => {this.props.navigation.goBack(null)}}
                                              style={styles.PageRegister.backLogin}>
                                <Text style={styles.PageRegister.submitText}>返回登录</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
              </View>
            </View>
        );
    }
}


export default PageForgetPwd;
