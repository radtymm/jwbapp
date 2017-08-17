import React from 'react';
import {
    StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, Animated, Easing, RefreshControl,
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';

class ChatScreen extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isRefreshing:false
        };
    }

    componentDidMount() {

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

        return (
            <View style={[styles.chatScreen.itemView, {justifyContent:!item.isOther?'flex-end':'flex-start'}]}>
                {item.isOther?<Image style={styles.chatScreen.headImg} source={item.headImage}></Image>:<View/>}
                <Text style={[styles.chatScreen.msgText, {textAlign:!item.isOther?'right':'left'}]}>{item.message}</Text>
                {!item.isOther?<Image style={styles.chatScreen.headImg} source={item.headImage}></Image>:<View/>}
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
                onFocus={()=>this.handleFocus()}
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

    render() {
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
        return (
            <View style={{flex: 1, backgroundColor:"#f5f5f5"}} >
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>{"this.props.navigation.state.params.nickname"}</Text>
                </View>
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
    }
}


export default ChatScreen;
