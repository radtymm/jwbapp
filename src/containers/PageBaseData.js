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

import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';
import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request.js';
import DeviceInfo from 'react-native-device-info';
import { createAnimatableComponent, Image as AnimatableImage} from 'react-native-animatable';
const AnimatableView = createAnimatableComponent(View);

class PageBaseData extends React.Component {
    // static navigationOptions = {
    //     headerTitle: <Text style={{color:"#fff", fontSize:20,}}>详情</Text>,
    //     headerMode:"none",
    //     headerStyle:{backgroundColor:"#e74f7b", height:0, },
    // };

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

            let params = this.state.data.code;
            let data1 = [
                {title: 'ID号：', content: params.id},
                {title: '昵称：', content: params.nickname},
                {title: '性别：', content: params.gender == "1" ? '男' : '女'},
                {title: '年龄：', content: params.age, },
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
                    {this.renderFlatListItem(data1)}
                    <View style={{marginTop:20}}>
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
                        <Text style={styles.PageBaseData.loveText}>{this.state.data.code.idea}</Text>
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
        let imageSrc = require("../images/headDef.jpg");
        if (this.props.navigation.state.params && this.props.navigation.state.params.avatar != null){
            imageSrc = {uri: 'http://cdn.jiaowangba.com/' + this.props.navigation.state.params.avatar, cache:'force-cache'};
        }
        return <ImageBackground resizeMode="cover"  style={styles.PageBaseData.headImage} source={imageSrc}>
            <View style={styles.PageBaseData.imageTextView}>
                    {/*<Text style={styles.PageBaseData.imageTextName}>{this.state.data?this.state.data.code.nickname:""}</Text>*/}
                <Text style={styles.PageBaseData.imageTextLike}>{this.state.data?this.state.data.code.like_i_total:"0"}个人对TA心动</Text>
            </View>
        </ImageBackground>
    }

    renderBaseData(){
        let imgLike = require('../images/like_pre.png');
        if (this.state.is_like){
            imgLike = require('../images/liked_before.png');
        }

        return <View>
            {this.renderIdea()}
             <View style={styles.PageBaseData.loveStory}><Text
                style={styles.PageBaseData.loveText}>基本资料</Text></View>
            {this.renderFlatList()}
            <View style={styles.PageBaseData.bottomLike}>
                <TouchableOpacity style={styles.PageBaseData.bottomTouch} onPress={()=>this.reqLike()}>
                    <Image style={styles.PageBaseData.bottomImage} source={imgLike}/>
                    <Text style={styles.PageBaseData.bottomText}>{this.state.is_like?"取消心动":"心动"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.PageBaseData.bottomTouch}>
                    <Image style={styles.PageBaseData.bottomImage} source={require('../images/chat_list.png')}/>
                    <Text style={styles.PageBaseData.bottomText}>聊天</Text>
                </TouchableOpacity>
            </View>
        </View>
    }

    render() {



        let ComHeadImage;
        let ComBaseData;
        if (!styles.isIOS && (Number(DeviceInfo.getSystemVersion()) < 5.0)) {
            ComHeadImage = this.renderHeadImg();
            ComBaseData = this.renderBaseData();
        }else {
            ComHeadImage = <AnimatableView animation="zoomInDown" delay={700} style={{backgroundColor:"#fff"}}>
                    {this.renderHeadImg()}
            </AnimatableView>
            ComBaseData = <AnimatableView animation="bounceInUp" duration={1100} delay={1400}>
                {this.renderBaseData()}
            </AnimatableView>
        }


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
                    {ComHeadImage}
                    {ComBaseData}
                </ScrollView>
            </View>

        );
    }
}


export default PageBaseData;
