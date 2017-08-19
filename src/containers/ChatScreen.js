import React from 'react';
import {
    StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableWithoutFeedback, Image, TextInput, Animated, Easing, RefreshControl, KeyboardAvoidingView, AsyncStorage,
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import WebIM from '../../WebIM';
import storage from '../libs/storage';
import EmojiPicker, { EmojiOverlay } from 'react-native-emoji-picker';
import CachedImage from 'react-native-cached-image';

class ChatScreen extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.storageKey = this.props.navigation.state.params.id + "&" + global.perInfo.id;
        this.state = {
            isRefreshing:false,
            msgData:[],
            message:"",
        };
        this.webIMConnection();
    }

    componentDidMount() {
        this._get(this.storageKey);
    }

    componentWillUnmount(){
        clearTimeout(this.timeout);
    }

    webIMConnection(){
        let that = this;
        global.WebIM.conn.listen({
            onTextMessage: function ( message ) {
                console.log(JSON.stringify(message));
                that.handleRefreshMessage(message.data, true);
            },    //收到文本消息
            onEmojiMessage: function ( message ) {},   //收到表情消息
            onPictureMessage: function ( message ) {}, //收到图片消息
            onAudioMessage: function ( message ) {},   //收到音频消息
        });
    }

    // 获取
    async _get(key) {
        try {// try catch 捕获异步执行的异常
            var value = await AsyncStorage.getItem(key);
            if (value !== null){
                console.log('_get() success: ' ,value);
            } else {
                console.log('_get() no data');
            }
            this.setState({msgData:JSON.parse(value)});

        } catch (error) {
            console.log('_get() error: ', error.message);
        }
    }

    handleRefresh() {
        this.setState({isRefreshing: true})
        setTimeout(() => {
          ()=>this.setState({isRefreshing: false})
        }, 1000);
    }

    handleRefreshMessage(msg, isOther){
        let msgData = Object.assign([], this.state.msgData);
        msgData.push({message:msg, isOther:isOther});
        this.setState({msgData:msgData});
        storage.save(this.storageKey, JSON.stringify(msgData));
        this.handleScrollToEnd();
    }

    handleScrollToEnd(){
        this.refs.flat.scrollToEnd({animated: false})
    }

    handleSendMessage(message){
        let id = WebIM.conn.getUniqueId();                 // 生成本地消息id
        let msg = new WebIM.message('txt', id);      // 创建文本消息
        this.setState({message:"", showPicker:false});
        this.handleRefreshMessage(message, false);
        msg.set({
            msg: message,                  // 消息内容
            to: '13003995110',                          // 接收消息对象（用户id）
            roomType: false,
            success: function (id, serverMsgId) {
                console.log('send private text Success');
            },
            fail: function(e){
                console.log("Send private text error");
            }
        });
        msg.body.chatType = 'singleChat';
        WebIM.conn.send(msg.body);
    }

    handleChangeText(text){
        if(this.state.msgData.length == 0){
            return;
        }
        this.setState({message:text});
    }

    handleEmojiSelected(emoji){
        this.setState({message:this.state.message + emoji});
    }

    handleShowEmoji(){
        this.refs.textMsg.blur();
        this.setState({showPicker: true});
    }

    handleFocus(){
        clearTimeout(this.timeout);
        this.timeout = styles.isIOS?setTimeout(()=>this.refs.flat.scrollToEnd({animated: false}), 100):null;
    }

    handleBlur(){
        clearTimeout(this.timeout);
        this.timeout = styles.isIOS?setTimeout(()=>this.refs.flat.scrollToEnd({animated: false}), 100):null;
    }

    renderItem(item, index){
        let {params} = this.props.navigation.state;
        let headImage = {uri: 'https://cdn.jiaowangba.com/' + params.avatar, cache:'force-cache'};
        if (!item.isOther) {
            headImage = {uri: 'https://cdn.jiaowangba.com/' + global.perInfo.avatar, cache:'force-cache'};
        }

        return (
            <View style={[styles.chatScreen.itemView, {justifyContent:!item.isOther?'flex-end':'flex-start'}]}>
                {item.isOther?<CachedImage style={styles.chatScreen.headImg} source={headImage}/>:<View/>}
                <Text style={[styles.chatScreen.msgText, {textAlign:!item.isOther?'left':'left'}]}>{item.message}</Text>
                {!item.isOther?<CachedImage style={styles.chatScreen.headImg} source={headImage}/>:<View/>}
            </View>
        );
    }

    renderBar(){
        return <View style={styles.chatScreen.barView}>
            <TouchableOpacity style={styles.chatScreen.voiceTouch}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/home.png')}/>
            </TouchableOpacity>
            <TextInput style={styles.chatScreen.msgTextIpt} underlineColorAndroid="transparent"
                numberOfLines={3} multiple={true} ref="textMsg"
                defaultValue={this.state.message}
                onChangeText={(text)=>this.handleChangeText(text)}
                onFocus={()=>this.handleFocus()}
                onBlur={()=>this.handleBlur()}
                onSubmitEditing={()=>this.handleSendMessage(this.state.message)}
            />
            <TouchableOpacity style={styles.chatScreen.emojiView} onPress={() => this.handleShowEmoji()}>
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

        let ComFlat = (
            <View style={{flex:1}}>
            <TouchableWithoutFeedback onPress={()=>this.setState({showPicker:false})}>
                <FlatList
                    data={this.state.msgData}
                    keyExtractor = {(item, index) => ""+index}
                    ref={"flat"}
                    keyboardDismissMode="on-drag"

                    getItemLayout={(data,index)=>(
                        {length: (styles.setScaleSize(125)), offset: (styles.setScaleSize(125)) * index, index}
                    )}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                />
                </TouchableWithoutFeedback>
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
                <View style={{height: this.state.showPicker?150:0, }} >
                    <EmojiPicker
                      style={{
                        height: 150,
                        backgroundColor: '#f4f4f4'
                      }}
                      hideClearButton={true}
                      horizontal={true}
                      onEmojiSelected={(emoji)=>this.handleEmojiSelected(emoji)}
                      />
                  </View>
            </View>
        );
    }
}


export default ChatScreen;
