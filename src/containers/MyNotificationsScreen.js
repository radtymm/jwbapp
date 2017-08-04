import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image
} from 'react-native';
import styles from '../styleSheet/Styles';

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
      headerTitle:"消息",
      headerStyle:styles.homePage.headerStyle,
    tabBarLabel: ()=><Text>我的</Text>,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/chat_list.png')}
        style={[styles.tabbar.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
        <View style={{flex: 1,}}>
            <View style={styles.live.messageTitleTotalView}>
                <View style={styles.homePage.centerView}><Text style={styles.homePage.title}>消息</Text></View>
                <View style={styles.live.message}>
                    <Image resizeMode="cover"  style={{width:16, height:16}} source={require("../images/announce.png")}/>
                    <Text  style={styles.live.messageText}>所有让发红包、让转账的都是骗子》</Text>
                </View>
            </View>
        </View>
    );
  }
}

export default MyNotificationsScreen;
