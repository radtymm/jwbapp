import React from 'react';
import {
    StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, Animated, Easing,
} from 'react-native';

import styles from '../styleSheet/Styles';
import {requestData, requestDataPost,} from '../libs/request.js';

class ChatScreen extends React.Component {

    static navigationOptions = {
        headerTitle: "注册",
        headerMode: "float",

    };

    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor:"#0e6"}} >

            </View>
        );
    }
}


export default ChatScreen;
