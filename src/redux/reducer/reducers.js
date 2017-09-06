import { combineReducers } from 'redux';
import { MSGDATA, INITMSGDATA, MSGLIST} from '../action/actionsTypes';
import SQLite from '../../components/SQLite';
let sqLite = new SQLite();

// 原始默认state
const defaultState = {
  msgData:{},
  msgList:[],
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
    msgList,
    msgData
});
