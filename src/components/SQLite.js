import React,{Component} from 'react';
import{
  ToastAndroid,
} from 'react-native';
import SQLiteStorage from 'react-native-sqlite-storage';
SQLiteStorage.DEBUG(true);
var database_name = "test.db";//数据库文件
var database_version = "1.0";//版本号
var database_displayname = "MySQLite";
var database_size = -1;//-1应该是表示无限制
var db;

export default class  SQLite extends Component{
    componentWillUnmount(){
    if(db){
        this._successCB('close');
        db.close();
    }else {
        console.log("SQLiteStorage not open");
    }
  }

  open(){
    db = SQLiteStorage.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      ()=>{
          this._successCB('open');
      },
      (err)=>{
          this._errorCB('open',err);
      });
    return db;
  }

  createTable(){
    if (!db) {
        this.open();
    }

    //创建用户表
        db.transaction((tx)=> {
          tx.executeSql('CREATE TABLE IF NOT EXISTS USER(' +
              'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
              'selfUuid varchar,'+
              'otherUuid VARCHAR,' +
              'isOther VARCHAR,' +
              'msgType VARCHAR,' +
              'delay VARCHAR,' +
              'url VARCHAR,' +
              'data VARCHAR,' +
              'isReaded VARCHAR)'
              , [], ()=> {
                  this._successCB('executeSql');
              }, (err)=> {
                  this._errorCB('executeSql', err);
            });
        }, (err)=> {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('transaction', err);
        }, ()=> {
            this._successCB('transaction');
        })
    }

createTableMessageList(){
  if (!db) {
      this.open();
  }

  //创建用户表
      db.transaction((tx)=> {
        tx.executeSql('CREATE TABLE IF NOT EXISTS MSGLIST(' +
            'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
            'selfUuid varchar,'+
            'otherUuid VARCHAR,' +
            'selfAndOtherid VARCHAR,' +
            'headUrl VARCHAR,' +
            'otherName VARCHAR,' +
            'isOther VARCHAR,' +
            'message VARCHAR,' +
            'time VARCHAR,' +
            'msgType VARCHAR,' +
            'countNoRead INTEGER)'
            , [], ()=> {
                this._successCB('executeSql');
            }, (err)=> {
                this._errorCB('executeSql', err);
          });
      }, (err)=> {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
          this._errorCB('transaction', err);
      }, ()=> {
          this._successCB('transaction');
      })
  }


deleteData(){
if (!db) {
    this.open();
}
db.transaction((tx)=>{
  tx.executeSql('delete from user',[],()=>{
      
  });
});
}

  dropTable(){
    db.transaction((tx)=>{
      tx.executeSql('drop table user',[],()=>{

      });
    },(err)=>{
      this._errorCB('transaction', err);
    },()=>{
      this._successCB('transaction');
    });
  }

insertMessageList(userData){
  let len = userData.length;
  if (!db) {
      this.open();
  }
  this.createTableMessageList();
  db.transaction((tx)=>{
      for(let i=0; i < len; i++){
          var user = userData[i];
          let selfUuid = user.selfUuid;
          let otherUuid = user.otherUuid;
          let selfAndOtherid = user.selfAndOtherid;
          let headUrl = user.headUrl;
          let isOther = user.isOther;
          let msgType = user.msgType;
          let otherName = user.otherName;
          let message = user.message;
          let time = user.time;
          let countNoRead = user.countNoRead;

          let sql = "INSERT INTO MSGLIST(selfUuid,otherUuid,selfAndOtherid,headUrl,isOther,msgType,otherName,message,time,countNoRead)"+
          "values(?,?,?,?,?,?,?,?,?,?)";
          tx.executeSql(sql,[selfUuid,otherUuid,selfAndOtherid,headUrl,isOther,msgType,otherName,message,time,countNoRead],()=>{
            },(err)=>{
              console.log(err);
            }
          );
      }
  },(error)=>{
    this._errorCB('transaction', error);
  //   ToastAndroid.show("数据插入失败",ToastAndroid.SHORT);
  },()=>{
    this._successCB('transaction insert data');
  //   ToastAndroid.show("成功插入 "+1+" 条用户数据",ToastAndroid.SHORT);
  });
}

insertUserData(userData){
    let len = userData.length;
    if (!db) {
        this.open();
    }
    this.createTable();
    db.transaction((tx)=>{
        for(let i=0; i < len; i++){
            var user = userData[i];
            let selfUuid = user.selfUuid;
            let otherUuid = user.otherUuid;
            let isOther = user.isOther;
            let msgType = user.msgType;
            let delay = user.delay;
            let url = user.url;
            let data = user.data;
            let isReaded = user.isReaded;
            let sql = "INSERT INTO user(selfUuid,otherUuid,isOther,msgType,delay,url,data,isReaded)"+
            "values(?,?,?,?,?,?,?,?)";
            tx.executeSql(sql,[selfUuid,otherUuid,isOther,msgType,delay,url,data,isReaded],()=>{
              },(err)=>{
                console.log(err);
              }
            );
        }
    },(error)=>{
      this._errorCB('transaction', error);
    //   ToastAndroid.show("数据插入失败",ToastAndroid.SHORT);
    },()=>{
      this._successCB('transaction insert data');
    //   ToastAndroid.show("成功插入 "+1+" 条用户数据",ToastAndroid.SHORT);
    });
  }

  close(){
      if(db){
          this._successCB('close');
          db.close();
      }else {
          console.log("SQLiteStorage not open");
      }
      db = null;
  }

  _successCB(name){
    console.log("SQLiteStorage "+name+" success");
  }
  _errorCB(name, err){
    console.log("SQLiteStorage "+name);
    console.log(err);
  }
    render(){
        return null;
    }
};
