import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from '../containers/App';
import store from './store';

export default class index extends Component {
  render() {
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    );
  }
}
