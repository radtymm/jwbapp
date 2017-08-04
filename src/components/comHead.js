import React from 'react';
import {StyleSheet, ScrollView, RefreshControl, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import styles from '../styleSheet/Styles';
import PropTypes from 'prop-types';

class comHead extends React.Component {

    // 定义组件使用的属性
	static propTypes = {
		title:PropTypes.string,
	}

	// 定义组件属性的默认值
	static defaultProps = {}

	// 构造函数
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

    componentDidMount() {
    }

    render() {

        return (
			<View style={styles.homePage.centerView}>
				<Text style={styles.homePage.title}>{this.props.title}</Text>
			</View>
        );
    }
}


export default comHead;
