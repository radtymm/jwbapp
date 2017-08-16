import React from 'react';
import {
    StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, Animated, Easing, RefreshControl,
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';

class ChatScreen extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    }

    componentDidMount() {

    }

    handleRefresh() {
      this.setState({isRefreshing: true})
      // this.props.getContacts()
      setTimeout(() => {
        this.setState({isRefreshing: false})
      }, 1000)
    }

    renderItem(item, index){

        return (
            <View>
                <Text>{item.message}</Text>
            </View>
        );
    }

    render() {
        let data = [
            {headImage:require('../images/home.png'), message:"asdasdasd", isMe:true},
            {headImage:require('../images/home.png'), message:"asdasdasd", isMe:true},
            {headImage:require('../images/home.png'), message:"asdasdasd", isMe:true},
        ];
        return (
            <View style={{flex: 1, backgroundColor:"#268"}} >
                <FlatList
                    data={data}
                    keyExtractor = {(item, index) => ""+index}
                    ref={"flat"}
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
                    renderItem={({item, index}) => this.renderItem(item, index)}

                />
            </View>
        );
    }
}


export default ChatScreen;
