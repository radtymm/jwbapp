import React from 'react';
import {
    StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, Animated, Easing, RefreshControl, KeyboardAvoidingView,
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import WebIM from '../../WebIM';

class ChatScreen extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isRefreshing:false
        };
    }

    componentDidMount() {
        console.log(JSON.stringify());
    }

    handleRefresh() {
        this.setState({isRefreshing: true})
        setTimeout(() => {
          ()=>this.setState({isRefreshing: false})
        }, 1000);
    }

    handleFocus(){
        console.log("12");
        setTimeout(()=>this.refs.flat.scrollToEnd({animated:false}), 2000);
    }

    handleSendMessage(){
        console.log();
    }

    handleChangeText(text){
        this.setState({message:text});
    }

    renderItem(item, index){
        let {params} = this.props.navigation.state;
        let headImage = {uri: 'https://cdn.jiaowangba.com/' + params.avatar, cache:'force-cache'};
        if (!item.isOther) {
            headImage = {uri: 'https://cdn.jiaowangba.com/' + global.perInfo.avatar, cache:'force-cache'};
        }

        return (
            <View style={[styles.chatScreen.itemView, {justifyContent:!item.isOther?'flex-end':'flex-start'}]}>
                {item.isOther?<Image style={styles.chatScreen.headImg} source={headImage}></Image>:<View/>}
                <Text style={[styles.chatScreen.msgText, {textAlign:!item.isOther?'right':'left'}]}>{item.message}</Text>
                {!item.isOther?<Image style={styles.chatScreen.headImg} source={headImage}></Image>:<View/>}
            </View>
        );
    }

    renderBar(){
        return <View style={styles.chatScreen.barView}>
            <TouchableOpacity style={styles.chatScreen.voiceTouch}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/home.png')}/>
            </TouchableOpacity>
            <TextInput style={styles.chatScreen.msgTextIpt} underlineColorAndroid="transparent"
                numberOfLines={3} multiple={true}
                onChangeText={(text)=>this.handleChangeText(text)}
                onFocus={()=>{this.timeout = styles.isIOS?setTimeout(()=>this.refs.flat.scrollToEnd({animated: false}), 100):null;}}
                onBlur={()=>{this.timeout = styles.isIOS?setTimeout(()=>this.refs.flat.scrollToEnd({animated: false}), 100):null;}}

                onSubmitEditing={()=>this.handleSendMessage()}
            />
            <TouchableOpacity style={styles.chatScreen.emojiView}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/home.png')}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatScreen.otherTouch}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/home.png')}/>
            </TouchableOpacity>
        </View>;
    }

    renderFlatList(){
        let {params} = this.props.navigation.state;
        let headImage = {uri: 'https://cdn.jiaowangba.com/' + params.avatar, cache:'force-cache'};

        let data = [
            {headImage:require('../images/home.png'), message:"asdasdasdsdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd", isOther:true},
            {headImage:require('../images/home.png'), message:"asdasdasdsdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd", isOther:true},
            {headImage:require('../images/home.png'), message:"asdasdasd", isOther:false},
            {headImage:require('../images/home.png'), message:"asdasdasd", isOther:true},
            {headImage:require('../images/home.png'), message:"asdasdasd", isOther:true},
            {headImage:require('../images/home.png'), message:"asdasdasd", isOther:true},
            {headImage:require('../images/home.png'), message:"asdasdasd", isOther:true},
            {headImage:require('../images/home.png'), message:"asdasdasd", isOther:false},
            {headImage:require('../images/home.png'), message:"asdasdasd", isOther:true},
        ];


        let ComFlat = (
            <View style={{flex:1}}>
                <FlatList
                    data={data}
                    keyExtractor = {(item, index) => ""+index}
                    ref={"flat"}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={()=>this.handleRefresh()}
                            tintColor="#ff0000"
                            title="加载中..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ccc"
                        />
                    }
                    renderItem={({item, index}) => this.renderItem(item, index)}
                />
                {this.renderBar()}
            </View>
        );

        if (styles.isIOS) {
            return <KeyboardAvoidingView style={{flex:1}} behavior="padding">
                {ComFlat}
            </KeyboardAvoidingView>;
        }
        return ComFlat;
    }

    render() {

        return (
            <View style={{flex: 1, backgroundColor:"#f5f5f5"}} >
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>{this.props.navigation.state.params.nickname}</Text>
                </View>
                {this.renderFlatList()}

            </View>
        );
    }
}


export default ChatScreen;
