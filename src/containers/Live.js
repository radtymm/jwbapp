import React from 'react';
import {
    StyleSheet, Alert, RefreshControl, 
    View, AppState,
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
import CachedImage from 'react-native-cached-image';

let firstClick = 0;

class Live extends React.Component {

    static navigationOptions = ({navigation, screenProps}) =>({
        headerTitle: "同城",
        headerStyle: styles.homePage.headerStyle,
        tabBarLabel: ()=><TouchableOpacity  onPress={()=>{
            navigation.navigate("Live");
            navigation.state.param();}}
            style={styles.tabbar.iconTextTouch}>
            <Text>同城</Text>
        </TouchableOpacity>,
        // Note: By default the icon is only shown on iOS. Search the showIcon option below.
        tabBarIcon: ({tintColor}) => (
            <TouchableOpacity onPress={()=>{
                navigation.navigate("Live");
                navigation.state.param();}}>
                <Image source={require('../images/live.png')}
                    style={[styles.tabbar.icon, {tintColor: tintColor}]} />
            </TouchableOpacity>
        ),
    });

    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            isRefreshing:false,
            data:[],
        };
        this.handleRefresh = this.handleRefresh.bind(this);
        this.scrollTotop = this.scrollTotop.bind(this);
        this.handleDoublePressTab = this.handleDoublePressTab.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    componentDidMount() {
        this.handleRefresh();
        AppState.addEventListener('change', this.handleAppStateChange);
        this.props.navigation.state.param = this.handleDoublePressTab; //({navigatePress :this.handleDoublePressTab, title:"live"})
    }

    componentWillUnmount(){
        firstClick = null;
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange(appState){
        if (appState == 'active') {
            // global.appState = active;
            let options = {
                apiUrl: WebIM.config.apiURL,
                user: global.peruuid,
                pwd: global.perpwd,
                appKey: WebIM.config.appkey
            };
            WebIM.conn.open(options);
        }
    }


    handleDoublePressTab(){
        let timestamp = (new Date()).valueOf();
        if (timestamp - firstClick > 2000) {
            firstClick = timestamp;
            return false;
        } else {
            this.scrollTotop();
            this.handleRefresh();
            return true;
        }
    }

    //下拉刷新
    handleRefresh(){
        let that = this;
        that.setState({isRefreshing: true});
        requestData('https://app.jiaowangba.com/city?page=' + this.state.page, (res) => {
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
        requestData('https://app.jiaowangba.com/city?page=' + (this.state.page + 1), (res) => {
            if (res.status == "success") {
                let data = Object.assign([], that.state.data);
                for (let i in res.code.data){
                    data.push(res.code.data[i]);
                }
                that.setState({data: data, page:this.state.page+1, isRefreshing:false});
            }else {
                that.setState({ isRefreshing:false});
                return;
            }
        });
    }

    // 滚动到顶部
    scrollTotop(){
        this.refs.flat.scrollToOffset({x: 0, y: 0, animated: true});
    }

    comFlatList() {
        if (this.state.data) {
            let data = Object.assign([], this.state.data);

            return (
                <View style={styles.live.flatListView}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => "" + item + index}
                        ref={"flat"}
                        renderItem={({item}) => {
                            return (
                                <TouchableOpacity style={styles.live.flatTouch} onPress={() => this.props.navigation.navigate('PageBaseData', item)}>
                                    <View style={styles.live.itemView}>
                                        <CachedImage resizeMode="cover" style={styles.live.headImage}
                                           source={{uri: 'https://cdn.jiaowangba.com/' + item.avatar + '?imageView2/1/w/640/h/640/interlace/1/q/100|imageslim'}}/>
                                       {(item.is_vip == "No")?<View/>:(<Image style={styles.live.isvip} source={require('../images/isvip.png')}/>)}
                                        <View style={styles.live.realnameView}>
                                            <Text style={styles.live.realname}>{item.nickname}</Text>
                                            <View style={styles.live.imgInnerView}>
                                                {item.age != 'Unknown'?<View style={[styles.live.innerViewAge, ]}><Text style={styles.live.innerText}>{item.age + "岁"}</Text></View>:<View/>}
                                                <View style={[styles.live.innerViewEdu, ]}><Text style={styles.live.innerText}>{item.education}</Text></View>
                                                <View style={[styles.live.innerViewMar, ]}><Text style={styles.live.innerText}>{item.marry ? item.marry : ""}</Text></View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
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
                        getItemLayout={(data,index)=>(
                            {length: (styles.WIDTH + styles.setScaleSize(78)), offset: (styles.WIDTH + styles.setScaleSize(78)) * index, index}
                        )}
                        onEndReached={()=>this.loadMore()}
                        onEndReachedThreshold={styles.isIOS?(-0.5):0.5}
                    />
                </View>
            );
        }
        return <View style={styles.homePage.flatView}/>;
    }

    render() {
        console.log(this.props.navigation.state.routeName);
        return (
            <View style={{flex: 1,}}>
                {styles.isIOS?<View style={styles.homePage.iosTab} onPress={()=>this.scrollTotop()}/>:<View/>}
                <View style={styles.live.liveIn}>
                    <Image style={styles.live.liveInImg} source={require('../images/livein.png')}/>
                    <Text style={[styles.live.titleText, {fontSize:18, marginLeft:8}]}>{global.perInfo?global.perInfo.live:""}</Text>
                </View>
                {this.comFlatList()}
            </View>
        );
    }
}



export default Live;
