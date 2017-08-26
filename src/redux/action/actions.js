import { INCREASE, DECREASE, RESET, MSGDATA, INITMSGDATA } from './actionsTypes';

const increase = () => ({ type: INCREASE });
const decrease = () => ({ type: DECREASE });
const reset = () => ({ type: RESET });

const msgData = (data)=>({type:MSGDATA, data:data});
const initMsgData = (data)=>({type:INITMSGDATA, data:data});

export {
    increase,
    decrease,
    reset,
    msgData,
    initMsgData
}
