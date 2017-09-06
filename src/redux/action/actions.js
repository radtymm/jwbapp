import { MSGDATA, INITMSGDATA, MSGLIST } from './actionsTypes';
import SQLite from '../../components/SQLite';
import  {DeviceEventEmitter} from 'react-native';
let sqLite = new SQLite();


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
              data2.countNoRead = msgData[0].countNoRead?(msgData[0].countNoRead + 1):1;
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
    msgData,
    msgList,
    initMsgData
}
