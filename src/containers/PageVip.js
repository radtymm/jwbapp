
import React from 'react';
import {
    StyleSheet, Alert, TextInput,
    View,
    Text,
    Button,
    SectionList,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

import {StackNavigator, TabNavigator} from 'react-navigation';
import  PageBaseData from './PageBaseData';
import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request';

class PageVip extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1
        };
    }
    static navigationOptions = {
        headerTitle: "尊贵VIP",
        headerStyle:{backgroundColor:"#e74f7b", height:0}
    };

    componentDidMount() {
    }

    reqData(){

    }

    comFlatList() {
        let arrMine = [
            {image: require('../images/chat_list1.png'), title: "免费聊天",},
            {image: require('../images/good.png'), title: "我喜欢谁",},
            {image: require('../images/vip.png'), title: "尊贵标志", },
            {image: require('../images/whogood.png'), title: "谁喜欢我", },
        ];

        return arrMine.map((item, index) => {

            return (
                <View style={styles.minePage.arrMine} key={index}>
                    <View style={{flex:1,backgroundColor: '#ccc',height:1,}}/>
                    <View style={{flex:1, flexDirection: 'row', height:48, alignItems:"center"}}>
                        <Image style={{width:30,height:30,marginLeft:20, marginRight:20 }}
                               source={item.image}/>
                           <Text style={{fontSize:20, color:'#3a3a3a'}}>{item.title}</Text>
                    </View>
                </View>
            );
        });
    }

    renderIsVip(){
        let {params} = this.props.navigation.state;
        let isVipTime = (params.is_vip=="N2o")? "您暂时未加入VIP" : params.vip_end_time;
        if (params.is_vip=="N2o") {
            return (
                <View style={styles.pageVip.noVipView}>
                    <View style={styles.pageVip.wechatNum}>
                        <Text style={styles.pageVip.addQQ}>加入QQ群，免费获取会员邀请码：</Text>
                        <Text style={styles.pageVip.qq}>158062176</Text>
                        <View style={{flexDirection:"row", justifyContent:"center"}}>
                            <Text style={styles.pageVip.wechatText}>办理VIP，加客服微信：</Text>
                            <Text style={[styles.pageVip.wechatText, {color:"#000"}]}>4647352</Text>
                        </View>
                    </View>
                    <View style={{width:styles.WIDTH, height:20, backgroundColor:"#eee"}}/>
                    <View style={styles.pageVip.vipNumView}>
                        <TextInput placeholder="输入会员邀请码" underlineColorAndroid="transparent" style={styles.pageVip.vipNumTextInp}/>
                    </View>
                    <View style={styles.pageVip.openView}>
                        <TouchableOpacity style={styles.pageVip.openTouch}>
                            <Text style={styles.pageVip.openText}>开通VIP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }else {
            return (
                <View style={styles.pageVip.vipView}>
                    {/*<Image style={styles.pageVip.vipImg1} source={require("../images/card.png")}/>
                    <Image style={styles.pageVip.vipImg2} source={require("../images/card.png")}/>*/}
                    <Image style={styles.pageVip.vipImg3} source={require("../images/card.png")}>
                        <View style={styles.pageVip.vipTextView}>
                            <View style={styles.pageVip.vipTextRowView}>
                                <Text style={styles.pageVip.vipText1}>ID:{params.id}</Text>
                                <Text style={styles.pageVip.vipText2}>交往吧会员</Text>
                            </View>
                            <View style={styles.pageVip.vipTextRowView}>
                                <Text style={styles.pageVip.vipText3}>会员截止时间</Text>
                                <Text style={styles.pageVip.vipText3}>{isVipTime}</Text>
                                <View style={{flexDirection:"row", }}>
                                    <Text style={styles.pageVip.vipText4}>{params.nickname}</Text>
                                    <Text style={styles.pageVip.vipText5}>{params.gender == 1 ? "先生" : "女士"}</Text>
                                </View>
                            </View>
                        </View>
                    </Image>
                </View>
            );
        }
    }

    render() {
        let {params} = this.props.navigation.state;
        let isVipTime = (params.is_vip=="No")? "您暂时未加入VIP" : params.vip_end_time;

        return (
            <ScrollView style={{flex: 1, backgroundColor:"#fff"}}>
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>开通会员</Text>
                </View>
                {this.renderIsVip()}
                <View style={styles.pageVip.titleView}>
                    <Text style={styles.pageVip.titleText}>VIP会员特权</Text>
                </View>
                {this.comFlatList()}
            </ScrollView>
        );
    }
}



export default PageVip;
