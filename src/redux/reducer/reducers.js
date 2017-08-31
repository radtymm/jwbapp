import { combineReducers } from 'redux';
import { INCREASE, DECREASE, RESET, MSGDATA, INITMSGDATA, MSGLIST} from '../action/actionsTypes';
import storage from '../../libs/storage';
import SQLite from '../../components/SQLite';
let sqLite = new SQLite();
let db = sqLite.open();

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
            //开启数据库
            if(!db){
              db = sqLite.open();
            }
            let userData = [];
            userData.push(action.data);
            //插入数据
            sqLite.insertUserData(userData);
            retState['msgData'].push(action.data);
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
            //开启数据库
            if(!db){
              db = sqLite.open();
            }
            db.transaction((tx)=>{
              tx.executeSql("delete from MSGLIST WHERE selfAndOtherid = '" + action.data.selfAndOtherid + "' ",[],()=>{
                  let userData = [];
                  userData.push(action.data);
                  //插入数据
                  sqLite.insertMessageList(userData);

              });
            });
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
