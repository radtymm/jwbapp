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

let birthYear = [];
for (let i = 1950; i < 2010; i++) {
    let strYear = i;
    birthYear.push(strYear);
}
birthYear.push('不限');

export {height, weight, birthYear};
