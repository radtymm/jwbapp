import React from 'react';
import {
    StyleSheet, FlatList,TouchableOpacity,Alert,
    View,
    Text,
    Button,
    Image
} from 'react-native';
import styles from '../styleSheet/Styles';
import SQLite from '../components/SQLite';
import CachedImage from 'react-native-cached-image';
import {msgData, msgList} from '../redux/action/actions';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
let sqLite = new SQLite();

class MyNotificationsScreen extends React.Component {
  static navigationOptions  = ({navigation, screenProps}) =>({
      headerTitle:"消息",
      headerStyle:styles.homePage.headerStyle,
    tabBarLabel: ()=>{return <View style={styles.tabbar.iconTextTouch}><Text>消息</Text></View>},
    tabBarIcon: ({tintColor}) => (
        <View>
            <Image source={require('../images/chat_list.png')}
                style={[styles.tabbar.icon, {tintColor: tintColor}]} />
            {/*<View style={styles.myNotificationsScreen.noReadTolView}>
                <Text style={styles.myNotificationsScreen.noReadText}>{100}</Text>
            </View>*/}
        </View>
    ),
  });

  // 映射redux中的数值到页面的Props中的值
  static mapStateToProps(state) {
      let props = {};
      props.msgList = state.msgList;
      return props;
  }

  constructor(props, context) {
      super(props, context);
      this.state = {
          msgData:[],
      };
      this.handleNavChat = this.handleNavChat.bind(this);
  }

  componentDidMount(){
      this.selectMsgData();
    //   setTimeout(()=>this.selectMsgData(), 1000);
  }

  componentWillReceiveProps(nextProps){
      this.selectMsgData();
    //   setTimeout(()=>this.selectMsgData(), 1000);
  }

  selectMsgData(){
      //开启数据库
      if(!global.db){
        global.db = sqLite.open();
      }
      //查询
      global.db.transaction((tx)=>{
        tx.executeSql("select * from MSGLIST WHERE selfUuid = '" + global.peruuid + "' ", [], (tx, results)=>{
          let len = results.rows.length;
          let sumNoRead = 0;
          let msgData = [];
          for(let i=0; i < len; i++){
            let u = results.rows.item(i);
            sumNoRead += u.countNoRead;
            msgData.push(u)
            //一般在数据查出来之后，  可能要 setState操作，重新渲染页面
          }
          msgData.reverse();
          this.setState({msgData:msgData, sumNoRead:sumNoRead});
        });
      },(error)=>{//打印异常信息
        console.warn(error);
      });
  }

    handleNavChat(item){
        let that = this;
        that.props.dispatch(msgList({
            selfUuid:item.selfUuid,
            otherUuid:item.otherUuid,
            selfAndOtherid:item.selfAndOtherid,
            headUrl: item.headUrl,
            otherName:item.otherName,
            isOther:item.isOther,
            message:item.message,
            time:item.time,
            msgType:item.msgType,
            countNoRead:0,
        }));
        let code = {};
        code.avatar = item.headUrl;
        code.nickname = item.otherName;
        code.uuid = item.otherUuid;
        (global.perInfo)?this.props.navigation.navigate("ChatScreen", code):null;
    }

    handleDelete(item){

        //开启数据库
        if(!global.db){
          global.db = sqLite.open();
        }
        global.db.transaction((tx)=>{
          tx.executeSql("delete from MSGLIST WHERE id = '" + item.id + "' ",[],()=>{
            this.selectMsgData();
          });
        });
    }

    renderMsgList(){

        return (
            <View style={styles.pageLikeWho.flatView}>
                <FlatList
                    data={this.state.msgData}
                    keyExtractor={(item, index) => "" + item + index}
                    ref={"flat"}
                    renderItem={({item , index}) => {
                        let src = require('../images/headDef.jpg');
                        if (item.headUrl){
                            src = {uri: 'https://cdn.jiaowangba.com/' + item.headUrl + '?imageView2/1/w/250/h/250/interlace/1/q/96|imageslim'};
                        }
                        let sendTime = "";
                        if (item.time) {
                            let hourChina = Number(item.time.substring(11, 13));
                            let hour = (8 + hourChina) > 24?(8 + hourChina - 24):(hourChina + 8);
                            sendTime = item.time.substring(5, 10) + " " + hour + item.time.substring(13, 16);
                        }
                        return (
                            <Swipeout backgroundColor="#fff" right={[{text:'删除', backgroundColor:"red",  onPress:()=>{this.handleDelete(item);}}]} >
                                <TouchableOpacity style={styles.pageLikeWho.flatTouch} onPress={() => {this.handleNavChat(item)}}>
                                    <View style={styles.pageLikeWho.flatItemView}>
                                        <CachedImage autoClose={false} resizeMode="cover" style={ styles.myNotificationsScreen.heartImg} source={src}/>
                                        {item.countNoRead==0?<View/>:<View style={styles.myNotificationsScreen.noReadView}>
                                            <Text style={styles.myNotificationsScreen.noReadText}>{item.countNoRead}</Text></View>}
                                        <View style={styles.pageLikeWho.itemTextView}>
                                            <View style={{flex:1, flexDirection:"row", justifyContent:'space-between'}}>
                                                <Text style={styles.pageLikeWho.realname}>{item.otherName}</Text>
                                                <Text style={styles.pageLikeWho.timeago}>{sendTime}</Text>
                                            </View>
                                            <Text style={styles.pageLikeWho.liveage}>{item.message}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Swipeout>
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

  render() {
    return (
        <View style={{flex: 1,}}>
            {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
            <View style={styles.live.messageTitleTotalView}>
                <View style={styles.homePage.centerView}><Text style={styles.homePage.title}>消息</Text></View>
                <View style={styles.live.message}>
                    <Image resizeMode="cover"  style={{width:16, height:16}} source={require("../images/announce.png")}/>
                    <Text  style={styles.live.messageText}>所有让发红包、让转账的都是骗子》</Text>
                </View>
            </View>
            {this.renderMsgList()}
        </View>
    );
  }
}

export default connect(MyNotificationsScreen.mapStateToProps)(MyNotificationsScreen);
