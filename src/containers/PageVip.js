
import React from 'react';
import {
    StyleSheet, Alert, TextInput, ImageBackground,
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

    componentDidMount() {
    }

    renderDetail() {
        let detail = [
            {image: require('../images/wetchart.png'), title: "查看微信",},
            {image: require('../images/charfree.png'), title: "免费聊天",},
            {image: require('../images/ilikewho.png'), title: "我喜欢谁", },
            {image: require('../images/vipcenter.png'), title: "尊享标志", },
            {image: require('../images/wholikeme.png'), title: "谁喜欢我", },
        ];

        return detail.map((item, index) => {

            return (
                <View style={styles.pageVip.detailView} key={index}>
                    <View style={styles.pageVip.detailContent}>
                        <Image style={styles.pageVip.detailImg}
                               source={item.image} resizeMode="contain"/>
                           <Text style={{fontSize:styles.setScaleSize(34), color:'#444'}}>{item.title}</Text>
                    </View>
                </View>
            );
        });
    }

    renderIsVip(){
        let {params} = this.props.navigation.state;
        return (
            <View style={styles.pageVip.vipView}>
                <Image resizeMode="stretch" style={styles.pageVip.vipImg} source={require("../images/vipcard.png")}>
                    <View style={styles.pageVip.vipTextRowView}>
                        <View>
                            <Text style={styles.pageVip.vipTextName}>{params.nickname}</Text>
                            <Text style={styles.pageVip.vipText1}>{(params.is_vip == "No")?"您暂时未加入VIP":"交往吧会员"}</Text>
                        </View>
                        <Text style={styles.pageVip.vipText2}>ID:{params.id}</Text>
                    </View>
                    <View style={[styles.pageVip.vipTextRowView, { paddingTop:styles.setScaleSize(130),}]}>
                        <Text style={styles.pageVip.vipText3}>会员到期时间:{params.vip_end_time}</Text>
                    </View>
                </Image>
            </View>
        );
    }

    render() {

        return (
            <View style={{flex: 1, backgroundColor:"#fff"}}>
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>开通会员</Text>
                </View>
                <ScrollView style={{flex: 1, backgroundColor:"#fff"}}>
                    {this.renderIsVip()}
                    <View style={styles.pageVip.titleView}>
                        <Text style={styles.pageVip.titleText}>VIP会员特权</Text>
                    </View>
                    {this.renderDetail()}
                </ScrollView>
            </View>
        );
    }
}



export default PageVip;
