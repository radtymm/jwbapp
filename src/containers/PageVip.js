
import React from 'react';
import {
    StyleSheet, Alert,
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


    render() {
        let {params} = this.props.navigation.state;
        let isVipTime = params.vip_time == null? "您暂时未加入VIP" : params.vip_time;

        return (
            <ScrollView style={{flex: 1, backgroundColor:"#fff"}}>
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <Text style={styles.PageBaseData.title}>&lt;</Text>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>开通会员</Text>
                </View>
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
                                <Text style={styles.pageVip.vipText3}>{isVipTime}</Text>
                                <View style={{flexDirection:"row", }}>
                                    <Text style={styles.pageVip.vipText4}>{params.nickname}</Text>
                                    <Text style={styles.pageVip.vipText5}>{params.gender == 1 ? "先生" : "女士"}</Text>
                                </View>
                            </View>
                        </View>
                    </Image>
                </View>
                <View style={styles.pageVip.titleView}>
                    <Text style={styles.pageVip.titleText}>VIP会员特权</Text>
                </View>
                {this.comFlatList()}
            </ScrollView>
        );
    }
}



export default PageVip;
