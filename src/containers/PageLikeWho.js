
import React from 'react';
import {
    StyleSheet, Alert, RefreshControl,
    View,
    Text,
    Button,
    SectionList,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

import  PageBaseData from './PageBaseData';
import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request';

class PageLikeWho extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1
        };
    }
    static navigationOptions = {
        headerTitle: "我喜欢谁",
        headerStyle:{backgroundColor:"#e74f7b", height:0}
    };

    componentDidMount() {
        this.handleRefresh();
    }

    componentWillUnmount(){
        this.state = null;
    }

    //下拉刷新
    handleRefresh(){
        let that = this;
        that.setState({isRefreshing: true});
        requestData('https://app.jiaowangba.com/ilike?page=1', (res) => {
            if (res.status == 'success') {
                that.setState({data: res.code.data, page:1, isRefreshing:false});
            }else {
                that.setState({page:1, isRefreshing:false});
            }
        });
    }

    //上拉加载
    loadMore(){
        let that = this;
        that.setState({isRefreshing: true});
        requestData('https://app.jiaowangba.com/ilike?page=' + (this.state.page + 1), (res) => {
            if (that.state != null){
                if (res.status == "success" && that.state.data){
                    let data = Object.assign([], that.state.data);
                    for (let i in res.code.data){
                        data.push(res.code.data[i]);
                    }
                    that.setState({data: data, page:this.state.page+1, isRefreshing:false});
                }else {
                    that.setState({isRefreshing:false});
                }
            }
        });
    }

    // 滚动到顶部
    scrollTotop()
    {
        this.refs.flat.scrollToIndex({viewPosition: 0, index: Number(0)});
    }


    comFlatList() {
        if (this.state.data) {
            let data = Object.assign([], this.state.data);

            return (
                <View style={styles.pageLikeWho.flatView}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => "" + item + index}
                        ref={"flat"}
                        onEndReachedThreshold={styles.isIOS?(-1):0.1}
                        onEndReached={(info) => {
                            this.loadMore();
                        } }
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
                        renderItem={({item , index}) => {
                            if (item.users == null){
                                return;
                            }
                            let src = require('../images/headDef.jpg');
                            if (item.users.avatar){
                                src = {uri: 'https://cdn.jiaowangba.com/' + item.users.avatar};
                            }
                            return (
                                <TouchableOpacity style={styles.pageLikeWho.flatTouch} onPress={() => this.props.navigation.navigate('PageBaseData', item.users)}>
                                    <View style={styles.pageLikeWho.flatItemView}>
                                        <Image resizeMode="cover" style={ styles.pageLikeWho.heartImg}
                                               source={src}/>
                                        <View style={styles.pageLikeWho.itemTextView}>
                                            <View style={{flex:1, flexDirection:"row", justifyContent:'space-between'}}>
                                                <Text style={styles.pageLikeWho.realname}>{item.users.nickname}</Text>
                                                <Text style={styles.pageLikeWho.timeago}>{item.like_time}</Text>
                                            </View>
                                            <Text style={styles.pageLikeWho.liveage}>{(item.users.age!="Unknown")?(item.users.age + "岁" + "&nbsp;&nbsp;"):"" }{item.users.live}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        getItemLayout={(data, index) => (
                            // 120 是被渲染 item 的高度 ITEM_HEIGHT。
                            {length: (1 + styles.setScaleSize(290)), offset: 120 * index, index}
                        )}
                    />
                </View>
            );
        }
        return <View style={styles.homePage.flatView}/>;
    }


    render() {

        return (
            <View style={{flex: 1,}}>
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>我喜欢谁</Text>
                </View>
                {this.comFlatList()}
            </View>
        );
    }
}



export default PageLikeWho;
