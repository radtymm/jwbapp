import React from 'react';
import {
    ScrollView, RefreshControl, Alert, TextInput, View,
    Text, FlatList, TouchableOpacity, Image
} from 'react-native';
import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request.js';
import storage from '../libs/storage';


class PageChangePwd extends React.Component {

    constructor(props, context) {
        super(props, context);
        let {params} = this.props.navigation.state;
        // console.log(JSON.stringify(params));
        this.state = {
            oldPwd:'',
            newPwd:'',
            conNewPwd:'',
        };
    }

    componentDidMount() {

    }

    componentWillUnmount(){

    }

    handleChangeText(){
        if (this.state.oldPwd == '') {
            Alert.alert('提示', '请输入原密码');
            return;
        }
        if (this.state.newPwd == '') {
            Alert.alert('提示', '请输入新密码');
            return;
        }
        if (this.state.newPwd.length < 6) {
            Alert.alert('提示', '密码长度不能小于6位');
            return;
        }
        if (this.state.newPwd != this.state.conNewPwd) {
            Alert.alert('提示', '两次新密码输入不一致');
            return;
        }
        requestData('https://app.jiaowangba.com/change_password?current_password=' + this.state.oldPwd + '&new_password=' + this.state.newPwd, (ress)=>{
            if (ress) {
                Alert.alert('提示', ress.msg);
                if (ress.status == 'success') {
                    requestData('https://app.jiaowangba.com/chat/user_details', (res)=>{
                        if (res.status == 'success') {
                            let telPwd = {};
                            telPwd.isLogin = true;
                            telPwd.tel = global.tel;
                            telPwd.pwd = this.state.newPwd;
                            global.pwd = telPwd.pwd;

                            storage.save('isLogin', JSON.stringify(telPwd));
                            storage.save('loginUP', JSON.stringify(res.code));
                            console.log('reqsuccess');
                            this.reqLoginHX(res.code.uuid, res.code.password);
                        }
                    });
                }
            }
        });

    }

    reqLoginHX(uuid, pwd){
        global.peruuid = uuid;
        global.perpwd = pwd;
        let options = {
            apiUrl: WebIM.config.apiURL,
            user: uuid,
            pwd: pwd,
            appKey: WebIM.config.appkey
        };
        WebIM.conn.open(options);
        // this.props.navigation.navigate('Tab');
    }

    render() {

        return (
            <View style={[styles.live.container, {backgroundColor:"#fff"}]}>
                <View style={styles.PagePerInfo.title}>
                    {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>修改密码</Text>
                </View>
                <ScrollView style={styles.pageChangePwd.changeView}>
                    <TextInput onChangeText={(pwd)=>this.setState({oldPwd:pwd})} style={styles.pageChangePwd.changeText} secureTextEntry={true} underlineColorAndroid="transparent" placeholderTextColor="#929292" placeholder="旧密码" ></TextInput>
                    <TextInput onChangeText={(pwd)=>this.setState({newPwd:pwd})} style={styles.pageChangePwd.changeText} secureTextEntry={true} underlineColorAndroid="transparent" placeholderTextColor="#929292" placeholder="新密码" ></TextInput>
                    <TextInput onChangeText={(pwd)=>this.setState({conNewPwd:pwd})} style={styles.pageChangePwd.changeText} secureTextEntry={true} underlineColorAndroid="transparent" placeholderTextColor="#929292" placeholder="再次输入新密码" ></TextInput>
                    <TouchableOpacity style={styles.pageChangePwd.submitTouch} onPress={()=>this.handleChangeText()}>
                        <Text style={styles.pageChangePwd.submitText}>提交</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

export default PageChangePwd;
