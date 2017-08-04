/**
 * Created by Administrator on 2017/7/16/016.
 */
import React from 'react';
import {
    StyleSheet, Alert, Animated,
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

class PageLuck extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            animScale:new Animated.Value(1),
        };
    }
    static navigationOptions = {
        headerTitle: "遇见缘分",
        headerStyle:{backgroundColor:"#e74f7b", height:0}
    };

    componentDidMount() {

        requestData('https://app.jiaowangba.com/luck', (res) => {
            if (res.status == "success") {
                this.setState({dataNext:res.code, });
                this.reqData();
            }else {
                Alert.alert('提示', '网络异常');
            }
        });
    }

    reqData(isGood){
        let that = this;
        if (isGood == "good"){
            requestData('https://app.jiaowangba.com/add_ilike?id=' + this.state.data.id, (res) => {

            });
        }
        let data = Object.assign({}, this.state.dataNext);
        that.setState({data:data});
        requestData('https://app.jiaowangba.com/luck', (res) => {
            if (res.status == "success") {
                let data = Object.assign({}, this.state.dataNext);
                that.setState({dataNext:res.code});
            }
        });
    }

    renderBody(){
        if (!this.state.data) {
            return;
        }
        let imageSrc = {uri: 'http://cdn.jiaowangba.com/' + this.state.data.avatar};
        let imgBad = require("../images/unlike.png");
        return (<View style={styles.pageLuck.bodyView}>
            <TouchableOpacity style={styles.pageLuck.headTouch} onPress={()=>{this.props.navigation.navigate("PageBaseData" , this.state.data)}}>
                <View style={styles.pageLuck.contentView}>
                    <Image style={styles.pageLuck.headImageLuck} source={imageSrc}/>
                    <View style={styles.pageLuck.nameView}>
                        <Text style={styles.pageLuck.nameText}>{this.state.data.nickname?this.state.data.nickname:""}</Text>
                    </View>
                    <View style={styles.pageLuck.ageLiveEduView}>
                        <View style={styles.pageLuck.ageView}><Text style={styles.pageLuck.ageLiveEdu}>{(this.state.data.age=="Unknown")?"100岁":(this.state.data.age+'岁')}</Text></View>
                        <View style={styles.pageLuck.liveView}><Text style={styles.pageLuck.ageLiveEdu}>{this.state.data.live}</Text></View>
                        <View style={styles.pageLuck.eduView}><Text style={styles.pageLuck.ageLiveEdu}>{this.state.data.education}</Text></View>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.pageLuck.bottomView}/>
            <View style={[styles.pageLuck.bottomView, {width:styles.setScaleSize(580),}]}/>
            <View style={styles.pageLuck.heartView}>
                <TouchableOpacity onPress={()=>{this.reqData("bad")}}>
                    <View>
                        <Image style={styles.pageLuck.heartImg} source={imgBad}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.reqData("good")}}>
                    <View>
                        <Image style={styles.pageLuck.heartImg} source={require("../images/like.png")}/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>);

    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:"#f5f5f5"}}>
                <ScrollView style={{flex:1,}}>
                    <View style={styles.PagePerInfo.title}>
                        <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                            <View style={styles.PagePerInfo.titleBackIcon}/>
                        </TouchableOpacity>
                        <Text style={styles.homePage.title}>遇见缘分</Text>
                    </View>
                    {this.renderBody()}
                </ScrollView>
            </View>
        );
    }
}



export default PageLuck;
