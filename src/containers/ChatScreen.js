import React from 'react';
import {
    StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, Animated, Easing, RefreshControl, KeyboardAvoidingView, AsyncStorage,
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';
import WebIM from '../../WebIM';
import storage from '../libs/storage';

class ChatScreen extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.storageKey = this.props.navigation.state.params.id + "&" + global.perInfo.id;
        this.state = {
            isRefreshing:false,
            msgData:[],
        };
        this.webIMConnection();
    }

    componentDidMount() {
        this._get(this.storageKey);
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
        this.refs.flat.scrollToEnd({animated:true});
    }

    handleSendMessage(message){
        let id = WebIM.conn.getUniqueId();                 // 生成本地消息id
        let msg = new WebIM.message('txt', id);      // 创建文本消息

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
                onSubmitEditing={()=>this.handleSendMessage(this.state.message)}
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

        let ComFlat = (
            <View style={{flex:1}}>
                <FlatList
                    data={this.state.msgData}
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
                    getItemLayout={(data,index)=>(
                        {length: (styles.WIDTH + styles.setScaleSize(78)), offset: (styles.WIDTH + styles.setScaleSize(78)) * index, index}
                    )}
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
