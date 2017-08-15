import React from 'react';
import {
    StyleSheet, ScrollView, RefreshControl, Alert, Picker, TextInput, KeyboardAvoidingView,
    View,
    Text,
    Button,
    FlatList,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
    Image
} from 'react-native';
import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request.js';


class PageChangePwd extends React.Component {

    constructor(props, context) {
        super(props, context);
        let {params} = this.props.navigation.state;
        // console.log(JSON.stringify(params));
        this.state = {

        };
    }

    componentDidMount() {

    }

    componentWillUnmount(){

    }

    handleChangeText(){

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
                    <TextInput style={styles.pageChangePwd.changeText} secureTextEntry={true} underlineColorAndroid="transparent" placeholderTextColor="#929292" placeholder="旧密码" ></TextInput>
                    <TextInput style={styles.pageChangePwd.changeText} secureTextEntry={true} underlineColorAndroid="transparent" placeholderTextColor="#929292" placeholder="新密码" ></TextInput>
                    <TextInput style={styles.pageChangePwd.changeText} secureTextEntry={true} underlineColorAndroid="transparent" placeholderTextColor="#929292" placeholder="再次输入新密码" ></TextInput>
                    <TouchableOpacity style={styles.pageChangePwd.submitTouch} onPress={()=>this.handleChangeText()}>
                        <Text style={styles.pageChangePwd.submitText}>提交</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

export default PageChangePwd;
