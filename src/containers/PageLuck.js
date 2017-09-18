/**
 * Created by Administrator on 2017/7/16/016.
 */
import React from 'react';
import {
    StyleSheet, Alert, Animated, ActivityIndicator, ImageBackground,
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
import CachedImage from 'react-native-cached-image';
import SwipeCards from 'react-native-swipe-cards';


class PageLuck extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            cards: [],
            outOfCards: false,
        };
        this.data = {};
        this.reqData = this.reqData.bind(this);
    }

    componentDidMount() {
        requestData('https://app.jiaowangba.com/luck', (res) => {
            if (res.status == "success") {
                this.setState({dataNext:res.code, cards:[res.code]});
                this.index = -1;
                this.reqData();
            }else {
                Alert.alert('提示', '网络异常');
            }
        });
    }

    reqData(isGood){
        let that = this;
        this.index++;
        if (isGood == "good"){
            requestData('https://app.jiaowangba.com/add_ilike?id=' + this.state.data.id, (res) => {

            });
        }
        this.data = Object.assign({}, this.state.dataNext);
        that.setState({data:this.data});
        requestData('https://app.jiaowangba.com/luck', (res) => {
            if (res.status == "success") {
                that.setState({dataNext:res.code});
                this.setState({
                  cards: this.state.cards.concat(res.code),
                })
            }else {
                that.setState({dataNext:{}});
            }
            alert(JSON.stringify(res))
        });
    }

    renderPerson(){
        let data = this.data;
        let imageSrc = {uri: 'https://cdn.jiaowangba.com/' + data.avatar};
        return (
            <TouchableOpacity style={styles.pageLuck.headTouch} onPress={()=>{this.props.navigation.navigate("PageBaseData" , data)}}>
                <View style={styles.pageLuck.contentView}>
                    <CachedImage onLoadStart={()=>this.setState({load:'loading'})}
                        onLoad={()=>this.setState({load:'loadSuccess'})}
                        onError={()=>this.setState({load:'loadError'})}
                        style={styles.pageLuck.headImageLuck} source={imageSrc}/>
                    {(data.is_vip == "No")?<View/>:(<Image style={styles.minePage.isvip} source={require('../images/isvip.png')}/>)}
                    <View style={styles.pageLuck.nameView}>
                        <Text style={styles.pageLuck.nameText}>{data.nickname?data.nickname:""}</Text>
                    </View>
                    <View style={styles.pageLuck.ageLiveEduView}>
                        {(!data.age)?<View/>:<View style={styles.pageLuck.ageView}><Text style={styles.pageLuck.ageLiveEdu}>{(data.age+'岁')}</Text></View>}
                        <View style={styles.pageLuck.liveView}><Text style={styles.pageLuck.ageLiveEdu}>{data.live}</Text></View>
                        <View style={styles.pageLuck.eduView}><Text style={styles.pageLuck.ageLiveEdu}>{data.education}</Text></View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderBody(){
        if (!this.state.cards) {
            return;
        }
        return (<View style={styles.pageLuck.bodyView}>
            <View style={styles.pageLuck.headTouch}>
                <SwipeCards
                  cards={this.state.cards}
                  loop={false}

                  renderCard={() => this.renderPerson()}
                  renderNoMoreCards={() => this.renderPerson()}
                  showYup={true}
                  yupView={()=><Image style={styles.pageLuck.heartImg} source={require("../images/like.png")}/>}
                  showNope={true}
                  handleYup={() => this.reqData("good")}
                  handleNope={() => this.reqData("bad")}
                  cardRemoved={()=>{console.log(111);}}
                />
            </View>
            <View style={styles.pageLuck.bottomView}/>
            <View style={[styles.pageLuck.bottomView, {width:styles.setScaleSize(580),}]}/>
            <View style={styles.pageLuck.heartView}>
                <TouchableOpacity onPress={()=>{this.reqData("bad")}}>
                    <View>
                        <Image style={styles.pageLuck.heartImg} source={require("../images/unlike.png")}/>
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
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>遇见缘分</Text>
                </View>
                <ScrollView style={{flex:1,}}>
                    {this.renderBody()}
                </ScrollView>
            </View>
        );
    }
}



export default PageLuck;
