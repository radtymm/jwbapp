
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
} from 'react-native';

import HomePage from './HomePage';
import Around from './Around';
import ChatScreen from './ChatScreen';
import MinePage from './MinePage';
import Live from './Live';
import MyNotificationsScreen from './MyNotificationsScreen';
import PageBaseData from './PageBaseData';
import {StackNavigator, TabNavigator } from 'react-navigation';
import Login from './Login';
import PageRegister from './PageRegister';
import PageLuck from './PageLuck';
import PageLikeWho from './PageLikeWho';
import PageLikeMe from './PageLikeMe';
import PageVip from './PageVip';
import PagePerInfo from './PagePerInfo';
import PageChangePwd from './PageChangePwd';
import PageStart from './PageStart';

const Tab = TabNavigator({
      HomePage: {
        screen: HomePage,
      },
      Live: {
        screen: Live,
      },
      MyNotificationsScreen: {
        screen: MyNotificationsScreen,
      },
      MinePage: {
        screen: MinePage,
      },
  }, {
  tabBarPosition:'bottom',
  swipeEnabled:false,
  tabBarOptions: {
    activeTintColor: 'red',
    showIcon: true,
    inactiveTintColor: '#777',
    style: {
      backgroundColor: '#fff',
    },
  },
});

const App = StackNavigator({
    PageStart:{screen: PageStart },
    Login: {screen: Login },
    Tab: {screen: Tab },
    ChatScreen: {screen: ChatScreen},
    PageRegister: {screen: PageRegister},
    PageChangePwd:{screen: PageChangePwd},
    PageBaseData: {screen: PageBaseData},
    PageLuck: {screen: PageLuck},
    PageLikeWho: {screen:PageLikeWho},
    PageLikeMe: {screen:PageLikeMe},
    PageVip: {screen:PageVip},
    PagePerInfo:{screen:PagePerInfo},
},{
    headerMode:"none",
});

export default App;
