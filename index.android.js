
import index from './src/redux/index';
import ReactNative, { AppRegistry, View } from 'react-native'

// 兼容 0.39 版本的支持
ReactNative.ViewPropTypes || ( ReactNative.ViewPropTypes = View.propTypes );
ReactNative.BackHandler || ( ReactNative.BackHandler = ReactNative.BackAndroid );

AppRegistry.registerComponent('jwbapp', () => index);
