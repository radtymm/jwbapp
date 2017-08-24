import React from 'react';
import {
    StyleSheet, Modal, ScrollView, Keyboard, LayoutAnimation, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity, Platform,
    TouchableWithoutFeedback, PermissionsAndroid, CameraRoll, Image, TextInput, Animated, Easing, RefreshControl, KeyboardAvoidingView, AsyncStorage,
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import WebIM from '../../WebIM';
import storage from '../libs/storage';
import EmojiPicker, { EmojiOverlay } from 'react-native-emoji-picker';
import CachedImage from 'react-native-cached-image';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import ImageCropPicker from 'react-native-image-crop-picker';


class ChatScreen extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.storageKey = this.props.navigation.state.params.id + "&" + global.perInfo.id;
        // console.log(JSON.stringify(this.props.navigation.state.params));
        this.state = {
            msgData:[],
            scrollToEnd:false,
            message:"",
            showPicker:false,
            isVisibleModal:false,
        };
        this.webIMConnection();
    }

    componentDidMount() {
        this._get(this.storageKey);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    }

    componentWillUnmount(){
        clearTimeout(this.timeout);
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
    }

    keyboardDidShow = (e) => {
      // Animation chatTypes easeInEaseOut/linear/spring
    //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    //   let newSize = Metrics.screenHeight - e.endCoordinates.height
      console.log(e.endCoordinates.height);
    //   this.setState({
    //     keyboardHeight: e.endCoordinates.height,
    //     visibleHeight: newSize,
    //   })
        this.setState({keyboardHeight: e.endCoordinates.height,});
    }

    keyboardDidHide = (e) => {
      // Animation chatTypes easeInEaseOut/linear/spring
    //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    //   this.setState({
    //     keyboardHeight: 0,
    //     visibleHeight: Metrics.screenHeight,
    //   })
        this.setState({keyboardHeight: 0,});
    }

    componentDidUpdate(){
        if (this.state.scrollToEnd) {
            this.setState({scrollToEnd:false});
        }
        setTimeout(()=>this.handleScrollToEnd(), 100);
    }

    webIMConnection(){
        let that = this;
        global.WebIM.conn.listen({
            onTextMessage: function ( message ) {
                console.log("chat");
                that.handleRefreshMessage(message.data, true, 'txt');
            },    //收到文本消息
            onPictureMessage: function ( message ) {
                that.handleRefreshMessage({path:message.url}, true, 'img');
            }, //收到图片消息
        });
    }

    pickSingle( circular=false) {
        ImageCropPicker.openPicker({
            width: styles.WIDTH * 2,
            height: styles.WIDTH * 2,
            cropping: false,
        }).then(image => {
            this.handleSendImage(image, 'img');
        }).catch(e => {
            console.log(e);
        });
    }

    pickSingleWithCamera() {
        ImageCropPicker.openCamera({
            width: styles.WIDTH * 2,
            height: styles.WIDTH * 2,
            cropping: false,
        }).then(image => {
            this.handleSendImage(image, 'img');
        }).catch(e => {
            console.log(e);
        });
    }

    // 获取本地聊天记录
    async _get(key) {
        try {// try catch 捕获异步执行的异常
            var value = await AsyncStorage.getItem(key);
            if (value !== null){
                this.setState({msgData:JSON.parse(value)});
            } else {
                this.setState({msgData:[]});
            }

        } catch (error) {
            console.log('_get() error: ', error.message);
        }
    }

    handleRefreshMessage(msg, isOther, type){
        let msgData = Object.assign([], this.state.msgData);
        msgData.push({message:msg, isOther:isOther, type:type,});
        this.setState({msgData:msgData, scrollToEnd:true});
        storage.save(this.storageKey, JSON.stringify(msgData));
        this.handleScrollToEnd();
    }

    handleScrollToEnd(){
        this.refs.flat.scrollToEnd({animated: false});
    }

    handleSendMessage(message){
        let id = WebIM.conn.getUniqueId();                 // 生成本地消息id
        let msg = new WebIM.message('txt', id);      // 创建文本消息
        this.setState({message:"", showPicker:false});
        this.handleRefreshMessage(message, false, 'txt');
        msg.set({
            msg: message,                  // 消息内容
            to: this.props.navigation.state.params.uuid,      // 接收消息对象（用户id）
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

    handleSendImage(response, type){
        // console.log(WebIM.utils);
        var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
        var msg = new WebIM.message(type, id);        // 创建图片消息

        let source = null;
        if (Platform.OS === 'ios') {
          source = {path: response.path.replace('file://', ''), isStatic: true};
        } else {
          source = {path: response.path, isStatic: true};
        }
        response.path = source.path;
        this.handleRefreshMessage(response, false, type);

        var option = {
            apiUrl: WebIM.config.apiURL,
            file: {
              data: {
                uri: response.path, type: 'application/octet-stream', name: response.filename
              }
            },
            to: this.props.navigation.state.params.uuid,                       // 接收消息对象
            roomType: false,
            chatType: 'singleChat',
            onFileUploadError: function (e) {      // 消息上传失败
                console.log(e);
                console.log('onFileUploadError');
            },
            onFileUploadComplete: function () {   // 消息上传成功
                console.log('onFileUploadComplete');
            },
            success: function () {                // 消息发送成功
                console.log('Success');
            },
            flashUpload: WebIM.flashUpload
        };
        msg.set(option);
        WebIM.conn.send(msg.body);
    }

    handleChangeText(text){
        this.setState({message:text});
    }

    handleEmojiSelected(emoji){
        this.setState({message:this.state.message + emoji});
    }

    handleShowEmoji(){
        if (this.state.showPicker) {
            this.refs.textMsg.focus();
        }else {
            this.refs.textMsg.blur();
        }
        this.setState({showPicker: !this.state.showPicker});
    }

    handleItemLayoutHeight(event, index){
        // console.log(event.nativeEvent.layout.height);
    }

    renderItem(item, index){
        let {params} = this.props.navigation.state;
        let headImage = {uri: 'https://cdn.jiaowangba.com/' + params.avatar + '?imageView2/1/w/250/h/250/interlace/1/q/96|imageslim', cache:'force-cache'};
        if (!item.isOther) {
            headImage = {uri: 'https://cdn.jiaowangba.com/' + global.perInfo.avatar + '?imageView2/1/w/250/h/250/interlace/1/q/96|imageslim', cache:'force-cache'};
        }

        let ComMsg = <View/>;
        if (item.type == 'txt') {
            ComMsg = <Text style={styles.chatScreen.msgText}>{item.message}</Text>;
        }else if (item.type == 'img') {
            ComMsg = (
                <TouchableOpacity onPress={()=>this.setState({isVisibleModal:true, imgPath:item.message.path})}>
                    <CachedImage style={{width:100,height:100}} source={{uri:item.message.path}} />
                </TouchableOpacity>
            );
        }

        return (
            <TouchableWithoutFeedback onPress={()=>this.setState({showPicker:false})}>
                <View onLayout={(event, index)=>{this.handleItemLayoutHeight(event, index)}}
                     style={[styles.chatScreen.itemView, {justifyContent:!item.isOther?'flex-end':'flex-start', }]}>
                    {item.isOther?<CachedImage style={styles.chatScreen.headImg} source={headImage}/>:<View/>}
                    {ComMsg}
                    {!item.isOther?<CachedImage style={styles.chatScreen.headImg} source={headImage}/>:<View/>}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderBar(){
        return <View style={styles.chatScreen.barView}>
            <TouchableOpacity style={styles.chatScreen.emojiView} onPress={() => this.handleShowEmoji()}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/home.png')}/>
            </TouchableOpacity>
            <TextInput style={styles.chatScreen.msgTextIpt} underlineColorAndroid="transparent"
                numberOfLines={3} multiple={true} ref="textMsg"
                defaultValue={this.state.message}
                onChangeText={(text)=>this.handleChangeText(text)}
                onFocus={()=>this.setState({scrollToEnd:true, showPicker:false})}
                onBlur={()=>this.setState({scrollToEnd:true})}
                onSubmitEditing={()=>this.handleSendMessage(this.state.message)}
                returnKeyLabel="发送"
                returnKeyType="send"
            />
            <TouchableOpacity style={styles.chatScreen.otherTouch} onPress={()=>this.pickSingle()}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/home.png')}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatScreen.otherTouch} onPress={()=>this.pickSingleWithCamera()}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/home.png')}/>
            </TouchableOpacity>
        </View>;
    }

    renderFlatList(){
        let {params} = this.props.navigation.state;
        let headImage = {uri: 'https://cdn.jiaowangba.com/' + params.avatar, cache:'force-cache'};

        let ComFlat = (
            <View style={{flex:1}}>
                <FlatList
                    data={this.state.msgData}
                    keyExtractor = {(item, index) => ""+index}
                    ref={"flat"}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                />
                {this.renderBar()}
            </View>
        );

        return ComFlat;
    }

    renderModalImg(){
        return (
            <Modal transparent={false} animationType="fade" visible={this.state.isVisibleModal} onRequestClose={()=>this.setState({isVisibleModal:false})}>
                <TouchableOpacity style={{flex:1}} onPress={()=>this.setState({isVisibleModal:false})}>
                    <View style={styles.chatScreen.modalView}>
                        <CachedImage resizeMode="contain" style={{width:styles.WIDTH, height:styles.HEIGHT}} source={{uri:this.state.imgPath}} />
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    render() {
        let height = 0;
        if (styles.isIOS) {
            height = (this.state.keyboardHeight==0)?(this.state.showPicker?150:0):this.state.keyboardHeight;
        }else {
            height = this.state.showPicker?150:0;
        }
        return (
            <View style={{flex: 1, backgroundColor:"#fff"}} >
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>{this.props.navigation.state.params.nickname}</Text>
                </View>
                {this.renderFlatList()}
                <View style={{height: height, }} >
                    <EmojiPicker
                      style={{
                        height: this.state.showPicker?150:0,
                        backgroundColor: '#f4f4f4'
                      }}
                      hideClearButton={true}
                      horizontal={true}
                      onEmojiSelected={(emoji)=>this.handleEmojiSelected(emoji)}
                      />
                </View>
                {this.renderModalImg()}
            </View>
        );
    }
}


export default ChatScreen;
