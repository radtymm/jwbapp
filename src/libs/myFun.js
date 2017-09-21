export default dateShow = (delay, isLocalTime)=>{
    let sendTime = '';
    if (delay) {
        let timeDelay = Date.parse(delay);
        if (isLocalTime) {
          var new_str = delay.replace(/:/g,"-");
          new_str = new_str.replace(/ /g,"-");
          var arr = new_str.split("-");
          var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
          timeDelay = datum.getTime();
          // timeDelay = timeDelay - 8*60*60*1000;

        }
        let timeNow = Date.parse(new Date());
        let cha = timeNow - timeDelay;
        if (cha < 1000*60*1) {
            sendTime = '刚刚';
        }else if (cha < 1000*60*60) {
            sendTime = Math.floor(cha/1000/60) + '分钟前';
        }else if (cha < 1000*60*60*24) {
            sendTime = Math.floor(cha/1000/60/60) + '小时前';

        }else if (cha < 1000*60*60*24*5) {
            sendTime = Math.floor(cha/1000/60/60/24) + '天前';

        } else {
            let hourChina = Number(delay.substring(11, 13));
            let hour = (8 + hourChina) > 24?(8 + hourChina - 24):(hourChina + 8);
            let day = Number(delay.substring(8, 10));
            if ((8 + hourChina) > 24){
                hour = 8 + hourChina - 24;
                day++;
            }else {
                hour = hourChina + 8
            }
            sendTime = delay.substring(5, 8) + day + " " + hour + delay.substring(13, 16);
        }
    }
    return sendTime;
}
