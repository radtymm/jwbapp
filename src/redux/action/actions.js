import { INCREASE, DECREASE, RESET, MSGDATA } from './actionsTypes';

const increase = () => ({ type: INCREASE });
const decrease = () => ({ type: DECREASE });
const reset = () => ({ type: RESET });

const msgData = (data)=>({type:MSGDATA, data:data});

export {
    increase,
    decrease,
    reset,
    msgData
}
