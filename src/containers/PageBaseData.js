import React from 'react';
import {
    StyleSheet, Alert, View, Text, Animated, Easing, ImageBackground,
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

class PageBaseData extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    }

    componentDidMount() {
        let that = this;
        requestData('https://app.jiaowangba.com/info?id='+this.props.navigation.state.params.id, (res)=>{
            if (res.status == 'success') {
                that.setState({data:res, is_like:res.code.is_like});

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
                        <Text style={styles.PageBaseData.content}>{item.content}</Text>
                    </View>
                }
            />
        );
    }

    renderFlatList() {
        if (this.state.data) {
            console.log(JSON.stringify(this.state.data.code));
            let params = this.state.data.code;
            let data1 = [
                {title: '出生年月', content: params.birthdate},
                {title: '工作类型', content: "工作类型？？"},
                {title: '是否购房', content: "购房？？"},
                {title: '是否购车', content: "购车？？？", },
            ];
            let data2 = [
                {title: '微信：', content: params.wechat,},
                // {title: '手机：', content: params.telephone,},
                {title: '婚况：', content: params.marry,},
                {title: '居住：', content: params.live,},
                {title: '家乡：', content: params.hometown,},
                {title: '学历：', content: params.education,},
                {title: '身高：', content: params.height?params.height + '厘米':"",},
                {title: '体重：', content: params.weight?params.weight + '公斤':"",},
                {title: '职业：', content: params.occupation,},
                {title: '收入：', content: params.income,},
                {title: '住房：', content: params.house,},
                {title: '上线时间：', content: params.time,},
            ];
            return (
                <View style={styles.PageBaseData.flatView}>
                    <View style={styles.PageBaseData.oneFlatView}>
                        {this.renderFlatListItem(data1)}
                    </View>
                    <View style={styles.PageBaseData.oneFlatView}>
                        {this.renderFlatListItem(data2)}
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
            if ((this.state.data.code.idea != null) && (this.state.data.code.idea != "")) {
                ComIdea = <View>
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
                        this.setState({is_like:true});
                    } else {
                        this.setState({is_like:false});
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
            <Image resizeMode="cover"  style={styles.PageBaseData.headImage} source={imageSrc}/>
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
            <View style={styles.PageBaseData.loveStory}>
                <Text style={styles.PageBaseData.loveText}>基本资料</Text>
            </View>
            {this.renderFlatList()}
            {this.renderIdea()}
        </View>
    }

    render() {

        return (
            <View style={{flex:1}}>
                <View style={styles.PagePerInfo.title}>
                    {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
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
                    <TouchableOpacity style={styles.PageBaseData.bottomTouch}>
                        <Image style={styles.PageBaseData.bottomImage} resizeMode="contain" source={require('../images/chartother.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.PageBaseData.bottomTouch}>
                        <Image style={styles.PageBaseData.bottomImage} resizeMode="contain" source={require('../images/wetchatother.png')}/>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}


export default PageBaseData;
