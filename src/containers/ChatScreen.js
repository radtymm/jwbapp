import React from 'react';
import {
     Modal, ScrollView, DeviceEventEmitter, Clipboard, Keyboard, View, Text, FlatList, TouchableOpacity, Platform,
    TouchableWithoutFeedback, Image, TextInput, RefreshControl,
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, } from '../libs/request.js';
import WebIM from '../../WebIM';
// import EmojiPicker from 'react-native-emoji-picker';
import CachedImage from 'react-native-cached-image';
// import {AudioRecorder, AudioUtils} from 'react-native-audio';
// import Sound from 'react-native-sound';
import ImageCropPicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import {msgData, msgList} from '../redux/action/actions';
import dateShow from '../libs/myFun';
import SQLite from '../components/SQLite';
let sqLite = new SQLite();
let firstClick = 0;

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
        this.subscription = DeviceEventEmitter.addListener('finishinsert', ()=>this.selectMsgData());
        this.selectMsgData();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
        setTimeout(()=>this.handleScrollToEnd(), 100);
        this.handleScrollToEnd();
        global.chartId = global.peruuid + "&&" + this.props.navigation.state.params.uuid;
    }

    componentDidUpdate(){
        if (this.state.isShowCopyDel > -1) {
            return;
        }
        if (this.state.scrollToEnd) {
            this.setState({scrollToEnd:false});
        }
        setTimeout(()=>this.handleScrollToEnd(), 100);
    }

    componentWillUnmount(){
        this.subscription.remove();
        clearTimeout(this.timeout);
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
        firstClick = null;
        global.chartId = -1;
    }

    selectMsgData(){
        //开启数据库
        if(!global.db){
          global.db = sqLite.open();
        }
        //查询
        global.db.transaction((tx)=>{
          tx.executeSql("select * from user WHERE otherUuid = '" + this.props.navigation.state.params.uuid + "' AND selfUuid = '" + global.peruuid + "' ", [], (tx, results)=>{
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
            // compressImageQuality:1,
            cropping: false,
        }).then(image => {
            this.handleSendImage(image, 'img');
        }).catch(e => {
            console.log(e);
        });
    }

    pickSingleWithCamera() {
        ImageCropPicker.openCamera({
            width: styles.WIDTH * 2 + 500,
            height: styles.WIDTH * 2 + 500,
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
        message.delay = dateNow.toJSON();
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
        if (message == '') {
            return;
        }
        this.setState({message:"", showPicker:false});
        let id = WebIM.conn.getUniqueId();                 // 生成本地消息id
        let msg = new WebIM.message('txt', id);      // 创建文本消息
        this.handleRefreshMessage(message, false, 'txt');
        // this.setState({message:"", showPicker:false});

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

    handleCopyDel(index){
        this.setState({isShowCopyDel:index});
        this.selectMsgData();
    }

    handleDel(item){
        //开启数据库
        if(!global.db){
          global.db = sqLite.open();
        }
        global.db.transaction((tx)=>{
          tx.executeSql("delete from USER WHERE id = '" + item.id + "' ",[],()=>{
              this.handleCopyDel(-1);
          });
        });
    }

    handleCopy(item, index){
        Clipboard.setString(item.data);
        this.handleCopyDel(-1);
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
        let sendTime = dateShow(item.delay);

        let copyDelStyle = (item.isOther=='true')?({left:styles.setScaleSize(100),}):({right:styles.setScaleSize(100),});
        let copyDel = <View style={[styles.chatScreen.copyDel, copyDelStyle]}>
                <TouchableOpacity onPress={()=>{this.handleDel(item)}}>
                    <View style={styles.chatScreen.copyDelView}>
                        <Text style={styles.chatScreen.copyDelText}>删除</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.handleCopy(item, index)}}>
                    <View style={styles.chatScreen.copyDelView}>
                        <Text style={styles.chatScreen.copyDelText}>复制</Text>
                    </View>
                </TouchableOpacity>
            </View>;

        return (
            <TouchableWithoutFeedback onPress={()=>{this.setState({showPicker:false, isShowCopyDel:-1});this.selectMsgData();}}>
                <View style={{marginVertical:styles.setScaleSize(20)}}>
                    <View style={styles.chatScreen.timeBorView}>
                        <View style={styles.chatScreen.timeView}><Text style={styles.chatScreen.timeText}>
                            {sendTime}
                        </Text></View>
                    </View>
                    <View onLayout={(event, index)=>{this.handleItemLayoutHeight(event, index)}}
                         style={[styles.chatScreen.itemView, {justifyContent:!(item.isOther=='true')?'flex-end':'flex-start', }]}>
                        {(item.isOther=='true')?<CachedImage style={styles.chatScreen.headImg} source={headImage}/>:<View/>}
                        <TouchableWithoutFeedback onPressIn={()=>{
                                this.copyDel=setTimeout(()=>this.handleCopyDel(index), 500);
                            }} onPressOut={()=>{clearTimeout(this.copyDel)}}>
                            <View>
                                {ComMsg}
                            </View>
                        </TouchableWithoutFeedback>
                        {(item.msgType=='txt')?(!(item.isOther=='true')?<View style={styles.chatScreen.tipView}/>:<View style={styles.chatScreen.tipOtherView}/>):<View/>}
                        {!(item.isOther=='true')?<CachedImage style={styles.chatScreen.headImg} source={headImage}/>:<View/>}
                    </View>
                    {this.state.isShowCopyDel==index?copyDel:<View/>}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    openMycamera(){
        let timestamp = (new Date()).valueOf();
        if (timestamp - firstClick > 2000) {
            firstClick = timestamp;
            this.pickSingle();
        } else {
            return;
        }

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
            <TouchableOpacity style={styles.chatScreen.otherTouch} onPress={()=>this.openMycamera()}>
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
                    <Text style={styles.homePage.title}>{this.props.navigation.state.params.nickname}</Text>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
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
                {/*<View style={{height: height, }} >
                    <EmojiPicker
                      style={{
                        height: this.state.showPicker?150:0,
                        backgroundColor: '#f4f4f4'
                      }}
                      hideClearButton={true}
                      horizontal={true}
                      onEmojiSelected={(emoji)=>this.handleEmojiSelected(emoji)}
                      />
                </View>*/}
                {this.renderModalImg()}
            </View>
        );
    }
}

export default connect(ChatScreen.mapStateToProps)(ChatScreen);
