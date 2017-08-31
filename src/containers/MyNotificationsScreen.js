import React from 'react';
import {
    StyleSheet, FlatList,TouchableOpacity,
    View,
    Text,
    Button,
    Image
} from 'react-native';
import styles from '../styleSheet/Styles';
import SQLite from '../components/SQLite';
import { connect } from 'react-redux';
let sqLite = new SQLite();
let db;

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
      headerTitle:"消息",
      headerStyle:styles.homePage.headerStyle,
    tabBarLabel: ()=><View style={styles.tabbar.iconTextTouch}><Text>消息</Text></View>,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/chat_list.png')}
        style={[styles.tabbar.icon, {tintColor: tintColor}]}
      />
    ),
  };

  // 映射redux中的数值到页面的Props中的值
  static mapStateToProps(state) {
      let props = {};
      props.msgData = state.msgData;
      return props;
  }

  constructor(props, context) {
      super(props, context);
      this.state = {
          msgData:[],
      };
  }

  componentDidMount(){
      setTimeout(()=>this.selectMsgData(), 100);
  }

  componentWillReceiveProps(nextProps){
      setTimeout(()=>this.selectMsgData(), 100);
  }

  selectMsgData(){
      //开启数据库
      if(!db){
        db = sqLite.open();
      }
      //查询
      db.transaction((tx)=>{
        tx.executeSql("select * from MSGLIST WHERE selfUuid = '" + global.peruuid + "' ", [], (tx, results)=>{
          let len = results.rows.length;
          let msgData = [];
          for(let i=0; i < len; i++){
            let u = results.rows.item(i);
            msgData.push(u)
            //一般在数据查出来之后，  可能要 setState操作，重新渲染页面
          }
          console.log("+++++++++++++++++++++++++++++++" + JSON.stringify(msgData));
          this.setState({msgData:msgData});
        });
      },(error)=>{//打印异常信息
        console.warn(error);
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
                            src = {uri: 'https://cdn.jiaowangba.com/' + item.headUrl};
                        }
                        let sendTime = "";
                        if (item.time) {
                            let hourChina = Number(item.time.substring(11, 13));
                            let hour = (8 + hourChina) > 24?(8 + hourChina - 24):(hourChina + 8);
                            sendTime = item.time.substring(5, 10) + " " + hour + item.time.substring(13, 16);
                        }
                        return (
                            <TouchableOpacity style={styles.pageLikeWho.flatTouch} onPress={() => {}}>
                                <View style={styles.pageLikeWho.flatItemView}>
                                    <Image resizeMode="cover" style={ styles.myNotificationsScreen.heartImg}
                                           source={src}/>
                                    <View style={styles.pageLikeWho.itemTextView}>
                                        <View style={{flex:1, flexDirection:"row", justifyContent:'space-between'}}>
                                            <Text style={styles.pageLikeWho.realname}>{item.otherName}</Text>
                                            <Text style={styles.pageLikeWho.timeago}>{sendTime}</Text>
                                        </View>
                                        <Text style={styles.pageLikeWho.liveage}>{item.message}</Text>
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
