
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

class PageLikeMe extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1
        };
    }
    static navigationOptions = {
        headerTitle: "谁喜欢我",
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
        requestData('https://app.jiaowangba.com/belike?page=1', (res) => {
            if (res.status == 'success') {
                // console.log(JSON.stringify(res));
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
        requestData('https://app.jiaowangba.com/belike?page=' + (this.state.page + 1), (res) => {
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

    comFlatList() {
        if (this.state.data) {
            let data = Object.assign([], this.state.data);
            return (
                <View style={styles.pageLikeWho.flatView}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => "" + item + index}
                        ref={"flat"}
                        renderItem={({item, index})=>{
                            if (item.users_i == null){
                                return;
                            }
                            let src = require('../images/headDef.jpg');
                            if (item.users_i.avatar){
                                src = {uri: 'https://cdn.jiaowangba.com/' + item.users_i.avatar};
                            }

                            return (
                                <TouchableOpacity style={styles.pageLikeWho.flatTouch} onPress={() => this.props.navigation.navigate('PageBaseData', item.users_i)}>
                                    <View style={styles.pageLikeWho.flatItemView}>
                                        <Image resizeMode="cover" style={ styles.pageLikeWho.heartImg}
                                               source={src}/>
                                        <View style={styles.pageLikeWho.itemTextView}>
                                            <View style={{flex:1, flexDirection:"row", justifyContent:'space-between'}}>
                                                <Text style={styles.pageLikeWho.realname}>{item.users_i.nickname}</Text>
                                                <Text style={styles.pageLikeWho.timeago}>{item.like_time}</Text>
                                            </View>
                                            <Text style={styles.pageLikeWho.liveage}>{(item.users_i.age!="Unknown")?(item.users_i.age + "岁" + "&nbsp;&nbsp;"):"" }{item.users_i.live}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                            return <Text>{index}</Text>
                        }}
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
                        onEndReachedThreshold={styles.isIOS?(-1):0.1}
                        onEndReached={(info) => {
                            this.loadMore();
                        } }
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
                    <Text style={styles.homePage.title}>谁喜欢我</Text>
                </View>
                {this.comFlatList()}
            </View>
        );
    }
}



export default PageLikeMe;
