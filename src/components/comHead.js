import React from 'react';
import {StyleSheet, ScrollView,  ViewPropTypes, RefreshControl, Alert, View, Text,  FlatList, Dimensions, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import styles from '../styleSheet/Styles';
import PropTypes from 'prop-types';

const propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: Text.propTypes.style,
  containerStyle: ViewPropTypes.style,
  text: PropTypes.string,
  activeOpacity: PropTypes.number
};

const comHead = ({
  onPress,
  disabled,
  style,
  containerStyle,
  text,
  activeOpacity
}) =>
  (<TouchableOpacity
    style={containerStyle}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={activeOpacity}
  >
    <Text style={style}>
      {text}
    </Text>
  </TouchableOpacity>);

comHead.propTypes = propTypes;

comHead.defaultProps = {
  onPress() {},
  disabled: false,
  activeOpacity: 0.8
};

export default comHead;
