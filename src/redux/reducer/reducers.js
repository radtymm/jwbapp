import { combineReducers } from 'redux';
import { INCREASE, DECREASE, RESET, MSGDATA} from '../action/actionsTypes';

// 原始默认state
const defaultState = {
  count: 5,
  factor: 1,
  msgData:{}
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
            let key = action.data.from + "&&" + action.data.to;
            if (!retState['msgData'][key]) {
                retState['msgData'][key] = [];
            }
            retState['msgData'][key].push(action.data);
            return retState;
        }
        return retState;
    }
    return state;
}

export default combineReducers({
    counter,
    msgData
});
