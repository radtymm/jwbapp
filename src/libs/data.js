/**
 * Created by Administrator on 2017/7/22/022.
 */

let height = [];
for (let i=140; i < 210; i++ ){
    let strHeight = i + "厘米";
    height.push(strHeight);
}

let weight = [];
for (let i=40; i < 100; i++ ){
    let strHeight = i + "公斤";
    weight.push(strHeight);
}

let date = [];
for(let i=1950;i < 2017;i++){
    let month = [];
    for(let j = 1;j < 13;j++){
        let day = [];
        if(j === 2){
            for(let k=1;k < 29;k++){
                if (k < 10){
                    day.push('0'+k+'日');
                }else {
                    day.push(k+'日');
                }
            }
            //Leap day for years that are divisible by 4, such as 2000, 2004
            if(i%4 === 0){
                day.push(29+'日');
            }
        }
        else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
            for(let k=1;k < 32;k++){
                if (k < 10){
                    day.push('0'+k+'日');
                }else {
                    day.push(k+'日');
                }
            }
        }
        else{
            for(let k=1;k < 31;k++){
                if (k < 10){
                    day.push('0'+k+'日');
                }else {
                    day.push(k+'日');
                }
            }
        }
        let _month = {};
        _month[j+'月'] = day;
        if (j < 10){
            _month['0'+j+'月'] = day;
        }else {
            _month[j+'月'] = day;
        }
        month.push(_month);
    }
    let _date = {};
    _date[i+'年'] = month;
    date.push(_date);
}



export {height, weight, date, };
