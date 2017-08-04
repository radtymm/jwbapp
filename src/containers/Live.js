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

let firstClick = 0;

class Live extends React.Component {

    static navigationOptions = ({navigation, screenProps}) =>({
        headerTitle: "同城",
        headerStyle: styles.homePage.headerStyle,
        tabBarLabel: ()=><TouchableOpacity onPress={()=>{
            navigation.navigate("Live");
            navigation.state.param();}}>
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
    }

    componentDidMount() {
        this.handleRefresh();
        this.props.navigation.state.param = this.handleDoublePressTab; //({navigatePress :this.handleDoublePressTab, title:"live"})
    }

    componentWillUnmount(){
        firstClick = null;
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
    scrollTotop()
    {
        this.refs.flat.scrollToIndex({viewPosition: 0, index: Number(0)});
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
                                    <View style={styles.homePage.item}>
                                        <Image resizeMode="cover" style={ styles.live.headImage}
                                           source={{uri: 'http://cdn.jiaowangba.com/' + item.avatar}}/>
                                        <View style={styles.live.realnameView}>
                                            <Text style={styles.live.realname}>{item.nickname}</Text>
                                            <View style={styles.live.imgInnerView}>
                                                <View style={[styles.live.innerViewAge, ]}><Text style={styles.live.innerText}>{item.age != 'Unknown'? item.age + "岁" : "100岁"}</Text></View>
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
                                title="Loading..."
                                titleColor="#00ff00"
                                colors={['#ff0000', '#00ff00', '#0000ff']}
                                progressBackgroundColor="#ccc"
                            />
                        }
                        ListHeaderComponent={
                            <View style={styles.live.liveIn}>
                                <Image style={styles.live.liveInImg} source={require('../images/livein.png')}/>
                                <Text style={[styles.live.titleText, {fontSize:18, marginLeft:8}]}>厦门市</Text>
                            </View>
                        }
                        onEndReached={()=>this.loadMore()}
                        onEndReachedThreshold={0.1}
                    />
                </View>
            );
        }
        return <View style={styles.homePage.flatView}/>;
    }

    render() {
        return (
            <View style={{flex: 1,}}>
                {this.comFlatList()}
            </View>
        );
    }
}



export default Live;
