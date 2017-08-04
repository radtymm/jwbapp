/**
 * Created by Administrator on 2017/7/22/022.
 */
let age = [];
for (let i=18; i < 80; i++ ){
    let strAge = i + "岁";
    age.push(strAge);
}

let marry = ["未婚", "离异", "丧偶", ];

let education = ["其他", "大专", "本科", "硕士", "博士"];

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

let income = ["1千-5千/月", "5千-1万/月", "1万-2万/月", "2万-3万/月", "3万-5万/月", "5万以上/月"];

let house = ["租房", "已购房", "单位宿舍", "和家人同住", ];

export {age, marry, education, height, weight, income, house, };