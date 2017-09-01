import React from 'react';
import {
    StyleSheet, Modal, ScrollView, Keyboard, LayoutAnimation,  Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity, Platform,
    TouchableWithoutFeedback, PermissionsAndroid, CameraRoll, Image, TextInput, Animated, Easing, RefreshControl, KeyboardAvoidingView, AsyncStorage,
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import WebIM from '../../WebIM';
import EmojiPicker, { EmojiOverlay } from 'react-native-emoji-picker';
import CachedImage from 'react-native-cached-image';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import ImageCropPicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import {msgData, msgList} from '../redux/action/actions';
import SQLite from '../components/SQLite';
let sqLite = new SQLite();

class ChatScreen extends React.Component {

    // 映射redux中的数值到页面的Props中的值
    static mapStateToProps(state) {
        let props = {};
        props.msgData = state.msgData;
        return props;
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            msgData:[],
            scrollToEnd:false,
            message:"",
            keyboardHeight:0,
            showPicker:false,
            isVisibleModal:false,
        };
        this.handleScrollToEnd = this.handleScrollToEnd.bind(this);
        this.handleRefreshMessage = this.handleRefreshMessage.bind(this);
    }

    componentDidMount() {
        this.selectMsgData();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    }

    componentWillReceiveProps(nextProps){
        this.selectMsgData();
    }

    componentDidUpdate(){
        if (this.state.scrollToEnd) {
            this.setState({scrollToEnd:false});
        }
        setTimeout(()=>this.handleScrollToEnd(), 100);
    }

    componentWillUnmount(){
        clearTimeout(this.timeout);
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
    }

    selectMsgData(){
        //开启数据库
        if(!global.db){
          global.db = sqLite.open();
        }
        //查询
        global.db.transaction((tx)=>{
          tx.executeSql("select * from user WHERE selfUuid = '" + global.peruuid + "' AND otherUuid = '" + this.props.navigation.state.params.uuid + "' ", [], (tx, results)=>{
            let len = results.rows.length;
            let msgData = [];
            for(let i=0; i < len; i++){
              let u = results.rows.item(i);
              msgData.push(u)
              //一般在数据查出来之后，  可能要 setState操作，重新渲染页面
            }
            this.setState({msgData:msgData, len:len});
          });
        },(error)=>{//打印异常信息
          console.warn(error);
        });
    }

    keyboardDidShow = (e) => {
        this.setState({keyboardHeight: e.endCoordinates.height,});
    }

    keyboardDidHide = (e) => {
        this.setState({keyboardHeight: 0,});
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

    handleRefreshMessage(msg, isOther, type){
        let that = this;
        let message = {};
        message.isOther = isOther + "";
        message.msgType = type;
        message.otherUuid = this.props.navigation.state.params.uuid;
        message.selfUuid = global.peruuid;
        message.isReaded = 'true';
        let dateNow = new Date();
        let month = ((dateNow.getMonth()+1) < 10)?("0"+(dateNow.getMonth()+1)):(dateNow.getMonth()+1);
        let date = ((dateNow.getDate()) < 10)?("0"+dateNow.getDate()):(dateNow.getDate());
        let hour = ((dateNow.getUTCHours()) < 10)?("0"+dateNow.getUTCHours()):(dateNow.getUTCHours());
        let min = ((dateNow.getMinutes()) < 10)?("0"+dateNow.getMinutes()):(dateNow.getMinutes());
        let second = ((dateNow.getSeconds()) < 10)?("0"+dateNow.getSeconds()):(dateNow.getSeconds());
        message.delay = dateNow.getFullYear() + "-" + month + '-' + date + 'T' + hour + ':' + min + ':' + second;
        if (type == 'txt') {
            message.data = msg;
            message.url = ''
        }else if (type == 'img') {
            message.data = '';
            message.url = msg.path;
        }

        this.props.dispatch(msgData(message));

        that.props.dispatch(msgList({
            selfUuid:global.peruuid,
            otherUuid:message.otherUuid,
            selfAndOtherid:global.peruuid + "&&" + message.otherUuid,
            headUrl: that.props.navigation.state.params.avatar,
            otherName:that.props.navigation.state.params.nickname,
            isOther:message.isOther,
            message:message.data,
            time:message.delay,
            msgType:type,
            countNoRead:0,
        }));
    }

    handleScrollToEnd(){
        if (this.refs.flat && this.refs.flat.scrollToEnd) {
            this.refs.flat.scrollToEnd({animated: false});
            return;
        }
    }

    handleSendMessage(message){
        let id = WebIM.conn.getUniqueId();                 // 生成本地消息id
        let msg = new WebIM.message('txt', id);      // 创建文本消息
        this.handleRefreshMessage(message, false, 'txt');
        this.setState({message:"", showPicker:false});
        msg.set({
            msg: message,                  // 消息内容
            to: this.props.navigation.state.params.uuid,      // 接收消息对象（用户id）
            roomType: false,
            success: function (id, serverMsgId) {
                console.log('send private text Success');
                console.log(id, serverMsgId);
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
        if (!(item.isOther=='true')) {
            headImage = {uri: 'https://cdn.jiaowangba.com/' + global.perInfo.avatar + '?imageView2/1/w/250/h/250/interlace/1/q/96|imageslim', cache:'force-cache'};
        }

        let ComMsg = <View/>;
        if (item.msgType == 'txt') {
            ComMsg = <Text style={[styles.chatScreen.msgText, {backgroundColor:(item.isOther=='true')?"#ffe4ed":"#e1eed2"}]}>{item.data}</Text>;
        }else if (item.msgType == 'img') {
            let imgUrl = item.url + '?imageView2/1/w/250/h/250/interlace/1/q/96|imageslim';
            ComMsg = (
                <TouchableOpacity onPress={()=>this.setState({isVisibleModal:true, imgPath:item.url})}>
                    <CachedImage style={{width:100,height:100}} source={{uri:imgUrl}} />
                </TouchableOpacity>
            );
        }
        let sendTime = "";
        if (item.delay) {
            let hourChina = Number(item.delay.substring(11, 13));
            let hour = (8 + hourChina) > 24?(8 + hourChina - 24):(hourChina + 8);
            sendTime = item.delay.substring(5, 10) + " " + hour + item.delay.substring(13, 16);
        }

        return (
            <TouchableWithoutFeedback onPress={()=>this.setState({showPicker:false})}>
                <View style={{marginVertical:styles.setScaleSize(20)}}>
                    <View style={styles.chatScreen.timeBorView}>
                        <View style={styles.chatScreen.timeView}><Text style={styles.chatScreen.timeText}>
                            {sendTime}
                        </Text></View>
                    </View>
                    <View onLayout={(event, index)=>{this.handleItemLayoutHeight(event, index)}}
                         style={[styles.chatScreen.itemView, {justifyContent:!(item.isOther=='true')?'flex-end':'flex-start', }]}>
                        {(item.isOther=='true')?<CachedImage style={styles.chatScreen.headImg} source={headImage}/>:<View/>}
                        {ComMsg}
                        {(item.msgType=='txt')?(!(item.isOther=='true')?<View style={styles.chatScreen.tipView}/>:<View style={styles.chatScreen.tipOtherView}/>):<View/>}
                        {!(item.isOther=='true')?<CachedImage style={styles.chatScreen.headImg} source={headImage}/>:<View/>}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderBar(){
        return <View style={styles.chatScreen.barView}>
            {/*<TouchableOpacity style={styles.chatScreen.emojiView} onPress={() => this.handleShowEmoji()}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/iconEmoji.png')}/>
            </TouchableOpacity>*/}
            <TextInput style={styles.chatScreen.msgTextIpt} underlineColorAndroid="transparent"
                numberOfLines={3} multiple={true} ref="textMsg"
                defaultValue={this.state.message}
                onChangeText={(text)=>this.handleChangeText(text)}
                onFocus={()=>this.setState({scrollToEnd:true, showPicker:false})}
                onBlur={()=>this.setState({scrollToEnd:true})}
            />
            <TouchableOpacity style={styles.chatScreen.otherTouch} onPress={()=>this.pickSingle()}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/iconImage.png')}/>
            </TouchableOpacity>
            {/*<TouchableOpacity style={styles.chatScreen.otherTouch} onPress={()=>this.pickSingleWithCamera()}>
                <Image resizeMode="contain" style={styles.chatScreen.voiceImg} source={require('../images/iconCamera.png')}/>
            </TouchableOpacity>*/}
            <TouchableOpacity style={styles.chatScreen.otherTouch} onPress={()=>this.handleSendMessage(this.state.message)}>
                <View style={styles.chatScreen.sendView}><Text style={styles.chatScreen.sendText}>发 送</Text></View>
            </TouchableOpacity>
        </View>;
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
        let {params} = this.props.navigation.state;
        let headImage = {uri: 'https://cdn.jiaowangba.com/' + params.avatar, cache:'force-cache'};

        return (
            <View style={{flex: 1, backgroundColor:"#fff"}} >
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>{this.props.navigation.state.params.nickname}</Text>
                </View>
                <TouchableWithoutFeedback onPress={()=>{this.setState({showPicker:false});this.refs.textMsg.blur();}}>
                    <View style={{flex:1}}>
                        <View>
                            <FlatList
                                data={this.state.msgData}
                                keyExtractor = {(item, index) => ""+index}
                                ref={"flat"}
                                renderItem={({item, index}) => this.renderItem(item, index)}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {this.renderBar()}
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

export default connect(ChatScreen.mapStateToProps)(ChatScreen);
