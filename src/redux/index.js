import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from '../containers/App';
import store from './store';

export default class index extends Component {
  render() {
    return (
      <Provider store={store}>
        <App onNavigationStateChange={(preState, newState, action) => {
            global.newState = newState;
            // console.log('-----preState:' + JSON.stringify(preState)
            //     + ',newState:' + JSON.stringify(newState) + ',action:' + JSON.stringify(action));
        }}/>
      </Provider>
    );
  }
}
