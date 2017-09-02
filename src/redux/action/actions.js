import { INCREASE, DECREASE, RESET, MSGDATA, INITMSGDATA, MSGLIST } from './actionsTypes';
import SQLite from '../../components/SQLite';
let sqLite = new SQLite();

const increase = () => ({ type: INCREASE });
const decrease = () => ({ type: DECREASE });
const reset = () => ({ type: RESET });

const msgData = (data)=>{
    //开启数据库
    if(!global.db){
      global.db = sqLite.open();
    }
    let userData = [];
    userData.push(data);
    //插入数据
    sqLite.insertUserData(userData);

    return ({type:MSGDATA, data:data});
};
const initMsgData = (data)=>({type:INITMSGDATA, data:data});

const msgList = (data)=>{
    //开启数据库
    if(!global.db){
      global.db = sqLite.open();
    }
    console.log("-----------------------------------------");
    if(data.countNoRead == 0){
        global.db.transaction((tx)=>{
          tx.executeSql("delete from MSGLIST WHERE selfAndOtherid = '" + data.selfAndOtherid + "' ",[],()=>{
              let userData = [];
              userData.push(data);
              console.log("------action" + JSON.stringify(userData));
              //插入数据
              sqLite.insertMessageList(userData);

          });
        });
    }else {
        global.db.transaction((tx)=>{
            tx.executeSql("select countNoRead from MSGLIST WHERE selfAndOtherid = '" + data.selfAndOtherid + "' ", [], (tx, results)=>{
              let len = results.rows.length;
              let msgData = [];
              for(let i=0; i < len; i++){
                let u = results.rows.item(i);
                msgData.push(u)
                console.log("------------" + JSON.stringify(u));
                console.log(len);
              }
              let data2 = Object.assign({}, data);
              data2.countNoRead = msgData[0].countNoRead?(msgData[0].countNoRead + 1):1;
              console.log(data2.countNoRead);
              console.log(JSON.stringify(data2));
              tx.executeSql("delete from MSGLIST WHERE selfAndOtherid = '" + data2.selfAndOtherid + "' ",[],()=>{
                  let userData = [];
                  userData.push(data2);
                  //插入数据
                  sqLite.insertMessageList(userData);

              });
            });
        });
    }


    return ({type:MSGLIST, data:data});
};

export {
    increase,
    decrease,
    reset,
    msgData,
    msgList,
    initMsgData
}
