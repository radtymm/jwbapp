import { MSGDATA, INITMSGDATA, MSGLIST } from './actionsTypes';
import SQLite from '../../components/SQLite';
import  {DeviceEventEmitter} from 'react-native';
let sqLite = new SQLite();
let insertErrArr = [];
let insertTimeout;


const handleInsertMsgList = (data)=>{
    //开启数据库
    if(!global.db){
      global.db = sqLite.open();
    }
    if(data.countNoRead == 0){
        global.db.transaction((tx)=>{
          tx.executeSql("delete from MSGLIST WHERE selfAndOtherid = '" + data.selfAndOtherid + "' ",[],()=>{
              let userData = [];
              userData.push(data);
              //插入数据
              sqLite.insertMessageList(userData);
              DeviceEventEmitter.emit('finishInsertList');
          });
        });
    }else {
        global.db.transaction((tx)=>{
            tx.executeSql("select countNoRead from MSGLIST WHERE selfAndOtherid = '" + data.selfAndOtherid + "' ", [], (tx, results)=>{
              let len = results.rows.length;
              let msgData = [];
              for(let i=0; i < len; i++){
                let u = results.rows.item(i);
                msgData.push(u);
              }
              if (len == 0) {
                  msgData.push({countNoRead:0});
              }
              let data2 = Object.assign({}, data);
              if (data2.selfAndOtherid == global.chartId) {
                  data2.countNoRead = 0;
              }
              data2.countNoRead = msgData[0].countNoRead?(msgData[0].countNoRead + data2.countNoRead):data2.countNoRead;
              tx.executeSql("delete from MSGLIST WHERE selfAndOtherid = '" + data2.selfAndOtherid + "' ",[],()=>{
                  let userData = [];
                  userData.push(data2);
                  //插入数据
                  sqLite.insertMessageList(userData, (err)=>{
                      //如果同时收到多条数据时, 处理并发
                      if (err && (err.message.substring(0, 6) == "UNIQUE")) {
                          insertErrArr.push(data2);
                          clearTimeout(insertTimeout);
                          insertTimeout = setTimeout(()=>handleSameTimeMSG(), 500);
                      }
                  });
                  DeviceEventEmitter.emit('finishInsertList');
              });
            });
        });
    }
}

const handleSameTimeMSG = ()=>{

    let newInsertArr = Object.assign([], insertErrArr);
    insertErrArr = [];
    let nextInsert = {};
    for (let i = 0; i < newInsertArr.length; i++) {
        if (nextInsert[newInsertArr[i].selfAndOtherid]) {
            nextInsert[newInsertArr[i].selfAndOtherid].countNoRead++;
            let oldTime = Number(Date.parse(nextInsert[newInsertArr[i].selfAndOtherid].time));
            let newTime = Number(Date.parse(newInsertArr[i].time));
            if (oldTime < newTime) {
                let newCountNoRead = nextInsert[newInsertArr[i].selfAndOtherid].countNoRead;
                nextInsert[newInsertArr[i].selfAndOtherid] = newInsertArr[i];
                nextInsert[newInsertArr[i].selfAndOtherid].countNoRead = newCountNoRead;
            }
        }else {
            nextInsert[newInsertArr[i].selfAndOtherid] = newInsertArr[i];
        }
    }
    for (let i in nextInsert) {
        handleInsertMsgList(nextInsert[i]);
    }
}

const msgData = (data)=>{
    //开启数据库
    if(!global.db){
      global.db = sqLite.open();
    }
    global.db.transaction((tx)=>{
      tx.executeSql("select hxId from USER WHERE hxId = '" + data.hxId + "' ",[],(tx, results)=>{
          let len = results.rows.length;
          if (len != 0) {
              return;
          }
          let userData = [];
          userData.push(data);
          //插入数据
          sqLite.insertUserData(userData);
          DeviceEventEmitter.emit('finishinsert');

      });
    });

    return ({type:MSGDATA, data:data});
};

const initMsgData = (data)=>({type:INITMSGDATA, data:data});

const msgList = (data)=>{
    handleInsertMsgList(data);
    return ({type:MSGLIST, data:data});
};

export default class actions {

    static MSGLIST = 'MSGLIST';
    static INSERTMSGLIST = 'INSERTMSGLIST';

    static insertMsgList(data){
        //开启数据库
        if(!global.db){
          global.db = sqLite.open();
        }
        if(data.countNoRead == 0){
            global.db.transaction((tx)=>{
              tx.executeSql("delete from MSGLIST WHERE selfAndOtherid = '" + data.selfAndOtherid + "' ",[],()=>{
                  let userData = [];
                  userData.push(data);
                  //插入数据
                  sqLite.insertMessageList(userData);
                  DeviceEventEmitter.emit('finishInsertList');
              });
            });
        }else {
            global.db.transaction((tx)=>{
                tx.executeSql("select countNoRead from MSGLIST WHERE selfAndOtherid = '" + data.selfAndOtherid + "' ", [], (tx, results)=>{
                  let len = results.rows.length;
                  let msgData = [];
                  for(let i=0; i < len; i++){
                    let u = results.rows.item(i);
                    msgData.push(u);
                  }
                  if (len == 0) {
                      msgData.push({countNoRead:0});
                  }
                  let data2 = Object.assign({}, data);
                  if (data2.selfAndOtherid == global.chartId) {
                      data2.countNoRead = 0;
                  }
                  data2.countNoRead = msgData[0].countNoRead?(msgData[0].countNoRead + data2.countNoRead):data2.countNoRead;
                  tx.executeSql("delete from MSGLIST WHERE selfAndOtherid = '" + data2.selfAndOtherid + "' ",[],()=>{
                      let userData = [];
                      userData.push(data2);
                      //插入数据
                      sqLite.insertMessageList(userData, (err)=>{
                          //如果同时收到多条数据时, 处理并发
                          if (err && (err.message.substring(0, 6) == "UNIQUE")) {
                              insertErrArr.push(data2);
                              clearTimeout(insertTimeout);
                              insertTimeout = setTimeout(()=>handleSameTimeMSG(), 500);
                          }
                      });
                      DeviceEventEmitter.emit('finishInsertList');
                  });
                });
            });
        }
    }

    static msgList(data) {
      return dispatch => {
        dispatch(actions.insertMsgList(data));
      }
    }

}

export {
    msgData,
    msgList,
    initMsgData
}
