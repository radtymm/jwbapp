import React from 'react';
import {
    StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, Animated, Easing,
} from 'react-native';
import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';
import PageBaseData from './PageBaseData';
import jwbapp from './App';
import MinePage from './MinePage';
import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import Swiper from 'react-native-swiper';

class PageRegister extends React.Component {

    static navigationOptions = {
        headerTitle: "注册",
        headerMode: "float",

    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            BFAnim: new Animated.Value(0),
            fadeInWidth: new Animated.Value(styles.WIDTH/2-30),
            fadeInWidthgirl: new Animated.Value(styles.WIDTH/2-30),
        };
    }

    componentDidMount() {

    }

    handleAnimate(sex) {
        this.setState({sex: sex});
    }

    handleRegister() {
        let that = this;
        if (!this.state.tel || this.state.tel == "") {
            Alert.alert('提示', '手机号码不能为空，请重新填写',
                [{text: 'OK', onPress: () => null},],
                {cancelable: false}
            )
            return;
        }
        if (!this.state.pwd || this.state.pwd == "") {
            Alert.alert('提示', '密码不能为空，请重新填写',
                [{text: 'OK', onPress: () => null},],
                {cancelable: false}
            )
            return;
        }
        if (!this.state.userName || this.state.userName == "") {
            Alert.alert('提示', '昵称不能为空，请重新填写',
                [{text: 'OK', onPress: () => null},],
                {cancelable: false}
            )
            return;
        }
        if (!this.state.sex || this.state.sex == "") {
            Alert.alert('提示', '性别不能为空，请重新填写',
                [{text: 'OK', onPress: () => null},],
                {cancelable: false}
            )
            return;
        }

        requestData(`https://app.jiaowangba.com/signup?telephone=${this.state.tel}&password=${this.state.pwd}&nickname=${this.state.userName}&gender=${this.state.sex}`,
            (res) => {
                if (res.status != "error") {
                    Alert.alert("提示", "注册成功",
                        [{text: "返回登录", onPress: () => that.props.navigation.goBack(null)}]);
                    return;
                }
                Alert.alert('提示', res.msg,
                    [{text: 'OK', onPress: () => null},],
                    {cancelable: false}
                )
            });
    }

    renderImg(){
        let imageViews=[];
        let srcImg = [require('../images/img0.jpg'), require('../images/img1.jpg'), require('../images/img2.jpg'), ];
        for(let i=0;i < 3;i++){
            imageViews.push(
                <Image key={i} resizeMode="cover" style={{height:styles.HEIGHT, width:styles.WIDTH,}} source={srcImg[i]}/>
            );
        }
        return imageViews;
    }

    render() {

        return (
            <View style={{flex: 1, backgroundColor:"#0e6"}} >
              <Swiper height={styles.HEIGHT} width={styles.WIDTH}
                    loop={false}
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
                               placeholderTextColor="#fff" keyboardType='numeric' placeholder="手机号"
                               style={styles.pageLogin.input}/>
                        </View>
                        <View style={[styles.pageLogin.inputView, {marginTop:styles.setScaleSize(50)}]}>
                            <TextInput onChangeText={(pwd) => this.setState({pwd: pwd})} secureTextEntry={true}
                               underlineColorAndroid="transparent" placeholderTextColor="#fff" placeholder="密码"
                               style={styles.pageLogin.input}/>
                        </View>
                        <View style={[styles.pageLogin.inputView, {marginTop:styles.setScaleSize(50)}]}>
                            <TextInput onChangeText={(userName) => this.setState({userName: userName})}
                               underlineColorAndroid="transparent" placeholderTextColor="#fff" placeholder="昵称"
                               style={styles.pageLogin.input}/>
                        </View>
                        <View style={styles.PageRegister.sexBtnView}>
                            <TouchableOpacity style={{flex:1}} onPress={() => this.handleAnimate("1")}>
                                <View style={ [styles.PageRegister.boyView, {
                                    backgroundColor: this.state.sex == "1"?"blue":"transparent"
                                }]}>
                                    <Text style={styles.PageRegister.sexText}>男</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{width:styles.setScaleSize(20)}}/>
                            <TouchableOpacity style={{flex:1}} onPress={() => this.handleAnimate("0")}>
                                <View style={ [styles.PageRegister.boyView, {
                                    backgroundColor: this.state.sex == "0"?"red":"transparent"
                                }]}>
                                    <Text style={styles.PageRegister.sexText}>女</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => this.handleRegister()} style={[styles.pageLogin.submit, {marginTop:styles.setScaleSize(50)}]}>
                            <View><Text style={styles.pageLogin.submitText}>注册</Text></View>
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}
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


export default PageRegister;
