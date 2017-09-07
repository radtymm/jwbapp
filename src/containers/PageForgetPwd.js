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

        };
    }

    componentDidMount() {

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
                        <View style={[styles.pageLogin.inputView, {marginTop:styles.setScaleSize(50)}]}>
                            <TextInput onChangeText={(pwd) => this.setState({pwd: pwd})} secureTextEntry={true}
                               underlineColorAndroid="transparent" placeholderTextColor="#fff" placeholder="设置新密码"
                               style={styles.pageLogin.input}/>
                        </View>
                        <View style={styles.pageForgetPwd.codeView}>
                            <View style={[styles.pageForgetPwd.inputView, {marginTop:styles.setScaleSize(50)}]}>
                                <TextInput onChangeText={(userName) => this.setState({userName: userName})}
                                   underlineColorAndroid="transparent" placeholderTextColor="#fff" placeholder="输入验证码"
                                   style={styles.pageForgetPwd.inputCode}/>
                            </View>
                            <TouchableOpacity style={[styles.pageForgetPwd.getCode,]}>
                                <View><Text style={styles.pageForgetPwd.submitText}>获取验证码</Text></View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[styles.pageLogin.submit, {marginTop:styles.setScaleSize(150)}]}>
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
