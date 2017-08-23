import React from 'react';
import {
    StyleSheet, Alert, View, Text, Animated, Easing, ImageBackground, Modal, Clipboard,
    Button,
    FlatList,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Image
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request.js';
import DeviceInfo from 'react-native-device-info';
import { createAnimatableComponent, Image as AnimatableImage} from 'react-native-animatable';
const AnimatableView = createAnimatableComponent(View);
import CachedImage from 'react-native-cached-image';

class PageBaseData extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isVisibleModal:false,
        };
    }

    componentDidMount() {
        let that = this;
        requestData('https://app.jiaowangba.com/info?id='+this.props.navigation.state.params.id, (res)=>{
            if (res.status == 'success') {
                that.setState({data:res, is_like:res.code.is_like});
                console.log(JSON.stringify(global.perInfo));
            }else {
                Alert.alert("提示", "网络异常");
            }
        });
    }

    renderFlatListItem(data){
        return (
            <FlatList
                keyExtractor={(item, index) => "" + item + index}
                data={data}
                renderItem={({item}) =>
                    <View style={styles.PageBaseData.item}>
                        <Text style={styles.PageBaseData.titleDetail}>{item.title}</Text>
                        <Text style={styles.PageBaseData.content}>{(item.content!="null"?item.content:"")}</Text>
                    </View>
                }
            />
        );
    }

    renderFlatList() {
        if (this.state.data) {
            let params = this.state.data.code;
            let data1 = [
                {title: '出生年月', content: params.birthdate},
                {title: '居住：', content: params.live,},
                {title: '职业：', content: params.occupation,},
                {title: '收入：', content: params.income,},
                {title: '婚况：', content: params.marry,},
                {title: '身高：', content: params.height!="null"?params.height + '厘米':"",},
                {title: '体重：', content: params.weight!="null"?params.weight + '公斤':"",},
                {title: '住房：', content: params.house,},
                {title: '上线时间：', content: params.time,},
            ];
            let data2 = [

            ];
            return (
                <View style={styles.PageBaseData.flatView}>
                    <View style={styles.PageBaseData.oneFlatView}>
                        {this.renderFlatListItem(data1)}
                    </View>
                </View>
            );
        }
        return <View style={styles.homePage.flatView}/>;
    }

    renderIdea(){
        let ComIdea = <View/>;

        if (this.state.data) {

            let params = this.state.data.code;
            if ((this.state.data.code.idea != "null") && (this.state.data.code.idea != "")) {
                ComIdea = <View style={{borderBottomColor:"#ebebeb", borderBottomWidth:1}}>
                    <View style={styles.PageBaseData.loveStory}>
                        <Text style={styles.PageBaseData.loveText}>爱情宣言</Text>
                    </View>
                    <View style={styles.PageBaseData.loveStoryContent}>
                        <Text style={styles.PageBaseData.loveStoryText}>{this.state.data.code.idea}</Text>
                    </View>
                </View>;
            }
        }
        return ComIdea;
    }

    reqLike(){

        if (this.state.data){
            let that = this;
            requestData('https://app.jiaowangba.com/add_ilike?id=' + this.state.data.code.id, (res) => {
                if (res.status == "success") {
                    if (res.code == 1) {
                        this.state.data.code.like_i_total = this.state.data.code.like_i_total + 1;
                        this.setState({is_like:true, data:this.state.data});
                    } else {
                        this.state.data.code.like_i_total = this.state.data.code.like_i_total - 1;
                        this.setState({is_like:false, data:this.state.data});
                    }
                }
            });
        }
    }

    renderHeadImg(){
        let code = this.state.data?this.state.data.code:{};
        let {params} = this.props.navigation.state;
        let imageSrc = require("../images/headDef.jpg");
        if (params && params.avatar != null){
            imageSrc = {uri: 'https://cdn.jiaowangba.com/' + params.avatar, cache:'force-cache'};
        }

        let isvip = <View/>;
        if (params && (params.is_vip != "No")){
            isvip = <Image style={styles.PageBaseData.isvip} source={require('../images/isvip.png')}/>;
        }

        let imgLike = require('../images/likeother.png');
        if (this.state.is_like){
            imgLike = require('../images/liked_before.png');
        }

        return <View style={styles.PageBaseData.headView}>
            <CachedImage resizeMode="cover"  style={styles.PageBaseData.headImage} source={imageSrc}/>
            {isvip}
            <View style={styles.PageBaseData.nameIdView}>
                <Text style={styles.PageBaseData.nicknameText}>{this.state.data?code.nickname:""}</Text>
                <View style={styles.PageBaseData.topCenterView}>
                    <Text style={styles.PageBaseData.imageTextLike}>{this.state.data?((code.age!="Unknown"?(code.age+"岁 · "):"")+(code.height!="null"?(code.height+"cm · "):"")+code.education):""}</Text>
                    <Text style={styles.PageBaseData.imageTextLike}>{this.state.data?this.state.data.code.like_i_total:"0"}个人心动</Text>
                </View>
                <Text style={styles.PageBaseData.imageTextLike}>ID: {params.id}</Text>
            </View>
            <TouchableOpacity style={styles.PageBaseData.likeBtn} onPress={()=>this.reqLike()}>
                <Image resizeMode="contain" style={styles.PageBaseData.likeImg} source={imgLike}/>
            </TouchableOpacity>
        </View>;
    }

    renderBaseData(){
        let imgLike = require('../images/like_pre.png');
        if (this.state.is_like){
            imgLike = require('../images/liked_before.png');
        }


        return <View style={styles.PageBaseData.contentView}>
            {this.renderIdea()}
            <View style={styles.PageBaseData.loveStory}>
                <Text style={styles.PageBaseData.loveText}>基本资料</Text>
            </View>
            {this.renderFlatList()}
        </View>
    }

    copyStr(string){
      Clipboard.setString(string);
    }

    renderModal(){
        if (!this.state.data) {
            return;
        }
        let params = this.state.data.code;
        let imageSrc = require("../images/headDef.jpg");
        if (params && params.avatar != null){
            imageSrc = {uri: 'https://cdn.jiaowangba.com/' + params.avatar, cache:'force-cache'};
        }
        return <Modal transparent={true} animationType="slide" visible={this.state.isVisibleModal} onRequestClose={()=>this.setState({isVisibleModal:false})}>
            <View style={styles.PageBaseData.modalView}>
                <View style={styles.PageBaseData.modalContent}>
                    <View style={styles.PageBaseData.modalHead}>
                        <CachedImage style={styles.PageBaseData.modalHeadImg} source={imageSrc}/>
                        <Text style={styles.PageBaseData.modalClose} onPress={()=>this.setState({isVisibleModal:false})}>×</Text>
                    </View>
                    <View style={styles.PageBaseData.modalWechatView}>
                        <Text style={styles.PageBaseData.modalName}>{params.nickname}的微信号</Text>
                        <Text style={styles.PageBaseData.modalWechat}>{(params.wechat!='null')?params.wechat:"该用户未提交微信号"}</Text>
                        <TouchableOpacity onPress={()=>this.copyStr(params.wechat)} style={styles.PageBaseData.modalCopyTouch}>
                            <Text style={styles.PageBaseData.modalCopy}>复制微信号</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    }

    handleWetchat(){
        if (this.state.data.code.is_vip == "N2o") {
            Alert.alert("提示", "VIP用户可查看微信号");
        }else {
            this.setState({isVisibleModal:true});
        }
    }

    render() {
        return (
            <View style={{flex:1}}>
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>{this.props.navigation.state.params.nickname}</Text>
                </View>
                <ScrollView style={{flex:1, }}>
                    {this.renderHeadImg()}
                    {this.renderBaseData()}
                </ScrollView>
                <View style={styles.PageBaseData.bottomBtn}>
                    <TouchableOpacity style={styles.PageBaseData.bottomTouch} onPress={()=>{(global.perInfo && this.state.data)?this.props.navigation.navigate("ChatScreen", this.state.data.code):null;}}>
                        <Image style={styles.PageBaseData.bottomImage} resizeMode="contain" source={require('../images/chartother.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.PageBaseData.bottomTouch} onPress={()=>{this.handleWetchat();}}>
                        <Image style={styles.PageBaseData.bottomImage} resizeMode="contain" source={require('../images/wetchatother.png')}/>
                    </TouchableOpacity>
                </View>
                {this.renderModal()}
            </View>

        );
    }
}


export default PageBaseData;
