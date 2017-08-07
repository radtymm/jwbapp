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

      render() {

        return (
          <View style={{flex:1,}}>
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
