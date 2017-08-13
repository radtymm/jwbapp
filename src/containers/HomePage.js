import React from 'react';
import {
    StyleSheet, ScrollView, RefreshControl, Alert,
    View,
    Text,
    Button,
    FlatList,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
    Image
} from 'react-native';
import PageBaseData from './PageBaseData';
import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request.js';
import comHead from '../components/comHead';

let firstClick = 0;

class HomePage extends React.Component {

    static navigationOptions = ({navigation, screenProps}) =>({
        headerTitle: "相遇",
        headerStyle: styles.homePage.headerStyle,
        tabBarLabel: ()=><TouchableOpacity style={styles.tabbar.iconTextTouch} onPress={()=>{
            navigation.navigate("HomePage");
            navigation.state.params.navigatePress();}}>
            <Text>相遇</Text>
        </TouchableOpacity>,
        // Note: By default the icon is only shown on iOS. Search the showIcon option below.
        tabBarIcon: ({tintColor}) => (
            <TouchableOpacity onPress={()=>{
                navigation.navigate("HomePage");
                navigation.state.params.navigatePress();}}>
                <Image source={require('../images/home.png')}
                    style={[styles.tabbar.icon, {tintColor: tintColor}]} />
            </TouchableOpacity>
        ),
    });

    constructor(props, context) {
        super(props, context);

        this.state = {
            page:0,
            data:[],
            isRefreshing:false,
        };
        props.navigatePress = this.navigatePress;
        this.handleRefresh = this.handleRefresh.bind(this);
        this.scrollTotop = this.scrollTotop.bind(this);
        this.handleDoublePressTab = this.handleDoublePressTab.bind(this);
    }

    componentDidMount() {
        this.handleRefresh();
    	this.props.navigation.setParams({navigatePress:this.handleDoublePressTab, title:"qwe"});
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
        requestData('https://app.jiaowangba.com/?page=1', (res) => {
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
        requestData('https://app.jiaowangba.com/?page=' + (this.state.page + 1), (res) => {
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
        this.refs.flat.scrollToIndex({viewPosition: 0, index: 0});
    }

    renderOnePerson(item ,isRight){
        return <TouchableOpacity style={[styles.homePage.flatViewTouch, isRight?{paddingRight:styles.setScaleSize(20), paddingLeft:styles.setScaleSize(22)}:{paddingLeft:styles.setScaleSize(20)}]} onPress={() => {
            this.props.navigation.navigate("PageBaseData", item)
        }}>
            <View style={[styles.homePage.flatViewOne,]}>
                <View>
                    <Image style={styles.homePage.flatViewImage}
                           source={{uri: 'https://cdn.jiaowangba.com/' + item.avatar + '?imageView2/1/w/250/h/250/interlace/1/q/96|imageslim'}}/>
                    {(item.is_vip == "No")?<View/>:(<Image style={styles.homePage.isvip} source={require('../images/isvip.png')}/>)}
                    <Image style={styles.homePage.livein} source={require('../images/livein.png')}/>
                    <Text style={styles.homePage.liveCity}>{item.live?item.live:""}</Text>
                </View>
                <Text style={styles.homePage.realName}>{item.nickname + " "}</Text>
                <Text style={styles.homePage.liveAgeMarry}>{(item.age!="Unknown"?item.age + "岁 · ":"") + (item.education?item.education + " · ":"") + (item.marry?item.marry:"")}</Text>
            </View>
        </TouchableOpacity>
    }

    renderFlatList(one ){
        if (this.state.data != []) {

            let dataLeft = [];
            let dataRight = [];
            for (let i = 0; i < this.state.data.length; i++) {
                i%2 == 0?dataLeft.push(this.state.data[i]):dataRight.push(this.state.data[i]);
            }

            return  <View style={styles.live.sectionParentView}>
                <FlatList
                    data={dataLeft}
                    keyExtractor = {(item, index) => ""+item+index}
                    ref={"flat"}
                    onEndReachedThreshold={-0.1}
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
                    renderItem={({item, index}) => {
                        let ComRight = <View/>;
                        if (dataRight[index]) {
                            ComRight = this.renderOnePerson(dataRight[index], true);
                        }
                        return <View style={{flexDirection:"row"}}>
                            {this.renderOnePerson(item)}
                            {ComRight}
                        </View>
                        }
                    }
                    getItemLayout={(data,index)=>(
                        {length: (styles.WIDTH/2 + styles.setScaleSize(95)), offset: (styles.WIDTH/2 + styles.setScaleSize(95)) * index, index}
                    )}
                />
            </View>
        }
        return;
    }

    render() {

        return (
            <View style={styles.homePage.container}>
                {styles.isIOS?<View style={styles.homePage.iosTab} onPress={()=>this.scrollTotop()}/>:<View/>}
                <View style={styles.homePage.centerView}>
                    <Text style={styles.homePage.title}>相遇</Text>
                </View>
                {this.renderFlatList()}
            </View>
        );
    }
}


export default HomePage;
