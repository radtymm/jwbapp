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

class PageRegister extends React.Component {

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
      }

      handleLogin(){
          let that = this;
          if (!this.state.userName || this.state.userName=="") {
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
          requestData(`https://app.jiaowangba.com/login?telephone=${this.state.userName}&password=${this.state.pwd}`, (res)=>{
              console.log(JSON.stringify(res));
              if (res.status != "error") {
                  const{navigator} = that.props;
                  if(navigator){
                      navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                          name: "NextComponent",
                          component: jwbapp
                      });
                  }
                  return;
              }
              Alert.alert('提示', res.msg,
                  [{text: 'OK', onPress: () => null},],
                  { cancelable: false }
              )
          });
      }

      render() {

        return (
          <ScrollView style={{flex:1,  backgroundColor: "#0ee"}}>
            <View style={styles.pageLogin.container}>
              <TextInput onChangeText={(userName)=>this.setState({userName:userName})} underlineColorAndroid="transparent" placeholderTextColor="#fff" keyboardType='numeric' placeholder="手机号" style={styles.pageLogin.input} />
              <TextInput onChangeText={(pwd)=>this.setState({pwd:pwd})} secureTextEntry={true} underlineColorAndroid="transparent" placeholderTextColor="#fff" placeholder="密码" style={styles.pageLogin.input} />
              <TouchableOpacity onPress={()=>this.handleLogin()} style={styles.pageLogin.submit}>
                <View><Text style={styles.pageLogin.submitText}>登录</Text></View>
              </TouchableOpacity>
              <View style={styles.pageLogin.forgetpwd}><Text style={[styles.pageLogin.submitText, {marginRight:20}]}>忘记密码</Text><Text style={styles.pageLogin.submitText}>用户注册</Text></View>
            </View>
          </ScrollView>
        );
      }
}


export default PageRegister;
