import { combineReducers } from 'redux';
import { INCREASE, DECREASE, RESET, MSGDATA, INITMSGDATA, MSGLIST} from '../action/actionsTypes';
import SQLite from '../../components/SQLite';
let sqLite = new SQLite();

// 原始默认state
const defaultState = {
  count: 5,
  factor: 1,
  msgData:{},
  msgList:[],
}

function counter(state = defaultState, action) {
  switch (action.type) {
    case INCREASE:
      return { ...state, count: state.count + state.factor };
    case DECREASE:
      return { ...state, count: state.count - state.factor };
    case RESET:
      return { ...state, count: 0 };
    default:
      return state;
  }
}

function msgData(state = defaultState, action) {
    if (action.type == MSGDATA) {
        let retState = Object.assign({}, state, {});
        if (action.data) {

            retState['msgData'] = action.data;
            return retState;
        }
        return retState;
    }else if (action.type == INITMSGDATA) {
        let retState = Object.assign({}, state, {});
        if (action.data) {
            retState['msgData'] = action.data;
            return retState;
        }
        return retState;
    }
    return state;
}

function msgList(state = defaultState, action) {
    if (action.type == MSGLIST) {
        let retState = Object.assign({}, state, {});
        if (action.data) {

            let arr = [];
            arr.push(action.data);
            retState['msgList'] = arr;
            return retState;
        }
        return retState;
    }
    return state;
}


export default combineReducers({
    counter,
    msgList,
    msgData
});
