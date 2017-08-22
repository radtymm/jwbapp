import React from 'react';
import {
    StyleSheet, ScrollView,  Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity, Platform,
    TouchableWithoutFeedback, Image, TextInput, PermissionsAndroid, Animated, Easing, RefreshControl, KeyboardAvoidingView, AsyncStorage,
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
        console.log(JSON.stringify(this.props.navigation.state.params));
        this.state = {
            isRefreshing:false,
            msgData:[],
            message:"",
            showAudio:false,
            currentTime: 0.0,                                                   //开始录音到现在的持续时间
            recording: false,                                                   //是否正在录音
            stoppedRecording: false,                                            //是否停止了录音
            finished: false,                                                    //是否完成录音
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',          //路径下的文件名
            hasPermission: undefined,                                           //是否获取权限
        };
        this.webIMConnection();
    }

    componentDidMount() {
        this._get(this.storageKey);

        // requestData("https://app.jiaowangba.com/chat/user_details?id="+this.props.navigation.state.params.id, (res)=>{
        //     if (res.status != 'error') {
        //         console.log(JSON.stringify(res));
        //     }
        // })

        // 页面加载完成后获取权限
        this.checkPermission().then((hasPermission) => {
          this.setState({ hasPermission });

          //如果未授权, 则执行下面的代码
          if (!hasPermission) return;
          this.prepareRecordingPath(this.state.audioPath);

          AudioRecorder.onProgress = (data) => {
            this.setState({currentTime: Math.floor(data.currentTime)});
          };

          AudioRecorder.onFinished = (data) => {
            if (Platform.OS === 'ios') {
              this.finishRecording(data.status === "OK", data.audioFileURL);
            }
          };
        })

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

    pickSingle( circular=false) {
        ImageCropPicker.openPicker({
            width: styles.WIDTH + 500,
            height: styles.WIDTH + 500,
            // compressImageQuality:1,
            hideBottomControls: false,
            cropping: true,
        }).then(image => {
            this.sendImage(image);
        }).catch(e => {
            console.log(e);
        });
    }

    sendImage(response){
        // console.log(WebIM.utils);
        var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
        var msg = new WebIM.message('img', id);        // 创建图片消息

        let source = null;
        if (Platform.OS === 'ios') {
          source = {path: response.path.replace('file://', ''), isStatic: true};
        } else {
          source = {path: response.path, isStatic: true};
        }
        response.path = source.path;

        var option = {
            apiUrl: WebIM.config.apiURL,
            file: {
              data: {
                uri: response.path, type: 'application/octet-stream', name: response.filename
              }
            },
            to: '13003995110',                       // 接收消息对象
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

    // 录音
    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
          SampleRate: 22050,
          Channels: 1,
          AudioQuality: "Low",            //录音质量
          AudioEncoding: "aac",           //录音格式
          AudioEncodingBitRate: 32000     //比特率
        });
    }

    checkPermission() {
        if (styles.isIOS ) {
          return Promise.resolve(true);
        }

        const rationale = {
          'title': '获取录音权限',
          'message': 'XXX正请求获取麦克风权限用于录音,是否准许'
        };

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
          .then((result) => {
            // alert(result);     //结果: granted ,    PermissionsAndroid.RESULTS.GRANTED 也等于 granted
            return (result === true || PermissionsAndroid.RESULTS.GRANTED)
          })
    }

    async record() {
        // 如果正在录音
        if (this.state.recording) {
          alert('正在录音中!');
          return;
        }

        //如果没有获取权限
        if (!this.state.hasPermission) {
          alert('没有获取录音权限!');
          return;
        }

        //如果暂停获取停止了录音
        if(this.state.stoppedRecording){
          this.prepareRecordingPath(this.state.audioPath);
        }

        this.prepareRecordingPath(this.state.audioPath);
        this.setState({recording: true});

        try {
          const filePath = await AudioRecorder.startRecording();
        } catch (error) {
          console.error(error);
        }
    }

    async stopRecord() {
        // 如果没有在录音
        if (!this.state.recording) {
          alert('没有录音, 无需停止!');
          return;
        }

        this.setState({stoppedRecording: true, recording: false});

        try {
          const filePath = await AudioRecorder.stopRecording();

          if (Platform.OS === 'android') {
            this.finishRecording(true, filePath);
          }
          return filePath;
        } catch (error) {
          console.error(error);
        }

    }

    playRecord() {
        // 使用 setTimeout 是因为, 为避免发生一些问题 react-native-sound中
        console.log('begin');

        console.log("-");
          let sound = new Sound(this.state.audioPath, '', (error) => {
            if (error) {
              console.log('failed to load the sound', error);
            }
          });
          console.log("++");
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            sound.play((success) => {
              if (success) {
                  console.log("+++++");
                console.log('successfully finished playing');
              } else {
                console.log('playback failed due to audio decoding errors');
              }
            });
        }, 100);
    }

    finishRecording(didSucceed, filePath) {
      this.setState({ finished: didSucceed });
      console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
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

    handleRefresh() {
        // this.setState({isRefreshing: true})
        // setTimeout(() => {
        //   ()=>this.setState({isRefreshing: false})
        // }, 1000);
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
        if (this.state.showAudio) {
            return;
        }
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
        let ComIsAudio = <View/>
        if (this.state.showAudio) {
            ComIsAudio = <TouchableOpacity style={styles.chatScreen.audioTouch}
                onPressOut={()=>this.stopRecord()}
                onPressIn={()=>this.record()}
                onPress={()=>console.log("onPress")}>
                    <Text>按住说话</Text>
                </TouchableOpacity>;
        }else {
            ComIsAudio = <TextInput style={styles.chatScreen.msgTextIpt} underlineColorAndroid="transparent"
                numberOfLines={3} multiple={true} ref="textMsg"
                defaultValue={this.state.message}
                onChangeText={(text)=>this.handleChangeText(text)}
                onFocus={()=>this.handleFocus()}
                onBlur={()=>this.handleBlur()}
                onSubmitEditing={()=>this.handleSendMessage(this.state.message)}
            />
        }
        return <View style={styles.chatScreen.barView}>
            <TouchableOpacity style={styles.chatScreen.voiceTouch}
                onPress={()=>this.setState({showAudio:!this.state.showAudio})}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/home.png')}/>
            </TouchableOpacity>
            {ComIsAudio}
            <TouchableOpacity style={styles.chatScreen.emojiView} onPress={() => this.handleShowEmoji()}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/home.png')}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatScreen.otherTouch} onPress={()=>this.pickSingle()}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/home.png')}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatScreen.otherTouch} onPress={()=>this.playRecord()}>
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
