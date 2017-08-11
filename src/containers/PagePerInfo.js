import React from 'react';
import {
    StyleSheet, ScrollView, RefreshControl, Alert, Picker, TextInput,
    View,
    Text,
    Button,
    FlatList,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
    Image
} from 'react-native';
import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request.js';
import {height, weight, } from '../libs/data.js';
import { MapView,  MapTypes, MapModule,  Geolocation  } from 'react-native-baidu-map';
import PickerAreaDate from 'react-native-picker';
import area from '../libs/area.json';

class PagePerInfo extends React.Component {
    static navigationOptions = {
        headerStyle: styles.homePage.headerStyle,
    };

    constructor(props, context) {
        super(props, context);
        let {params} = this.props.navigation.state;
        // console.log(JSON.stringify(params));
        this.state = {
            page:0,
            data:[],
            isRefreshing:false,
            live:params.live,
            nickname:params.nickname,
            wechat:params.wechat,
            occupation:params.occupation,
            marry:params.marry,
            age:params.age,
            hometown:params.hometown,
            education:params.education,
            height:params.height + "厘米",
            weight:params.weight + "公斤",
            income:params.income,
            birthdate:params.birthdate,
            house:params.house,
            idea:params.idea,
            area:params.area,
        };
    }

    componentDidMount() {
        if(styles.isIOS){
            navigator.geolocation.getCurrentPosition(
             (position) => {
               let initialPosition = JSON.stringify(position);
                 requestData(`https://app.jiaowangba.com/mine_info?lng=${initialPosition.longitude}&lat=${initialPosition.latitude}`, (res)=>{
                     if (res.status == "success"){
                     }
                 });
             },
             (error) => {console.log(JSON.stringify(error));},
             {enableHighAccuracy: false, timeout: 5000, maximumAge: 1000}
            );
        }else {
            Geolocation.getCurrentPosition().then(
                (data) => {
                    console.log(`https://app.jiaowangba.com/mine_info?lng=${"" + data.longitude}&lat=${"" + data.latitude}`);
                    console.log(JSON.stringify(data));
                    Alert.alert(JSON.stringify(data));
                     requestData(`https://app.jiaowangba.com/mine_info?lng=${data.longitude}&lat=${data.latitude}`, (res)=>{
                         if (res.status == "success"){
                         }
                     });
                }
            ).catch(error => {
                console.warn(error,'error')
            })
        }

     }

    reqArea(value, id){
        requestData("https://app.jiaowangba.com/area?id="+id, (res)=>{
            if (res.status == "success") {
                let city = {};
                city[value + "city"] = res.code;
                this.setState(city);
            }
        });
    }

    perInfo(){
        let {params} = this.props.navigation.state;

        let marry = [];
        for (let i in params.marry_type) {
            marry.push(params.marry_type[i]);
        }

        let education = [];
        for (let i in params.education_type) {
            education.push(params.education_type[i]);
        }

        let house = [];
        for (let i in params.house_type) {
            house.push(params.house_type[i]);
        }

        let income = [];
        for (let i in params.income_type) {
            income.push(params.income_type[i]);
        }

        return [
            {title: "居住城市", value:'live', contentKey:3, arrContent:this.state.area},
            {title: "昵称", value:'nickname', contentKey:1},
            {title: "微信号", value:'wechat', contentKey:1},
            {title: "职业", value:'occupation', contentKey:1},
            {title: "出生日期", value:'birthdate', contentKey:4},
            {title: "家乡", value:'hometown', contentKey:3, arrContent:this.state.area},
            {title: "婚姻状况", value:'marry', contentKey:2, arrContent:marry},
            {title: "学历", value:'education', contentKey:2, arrContent:education},
            {title: "身高", value:'height', contentKey:2, arrContent:height},
            {title: "体重", value:'weight', contentKey:2, arrContent:weight},
            {title: "收入", value:'income', contentKey:2, arrContent:income},
            {title: "住房情况", value:'house', contentKey:2, arrContent:house},
        ];
    }

    saveData(){

        let {education_type} = this.props.navigation.state.params;
        let education = "Other";
        for (let i in education_type) {
            if (this.state.education == education_type[i]) {
                education = i;
            }
        }

        let {marry_type} = this.props.navigation.state.params;
        let marry = "Unmarried";
        for (let i in marry_type) {
            if (this.state.marry == marry_type[i]) {
                marry = i;
            }
        }

        let {house_type} = this.props.navigation.state.params;//获取type
        let house = "Tenement"; //默认值，
        for (let i in house_type) {//遍历
            if (this.state.house == house_type[i]) {//如果value相同
                house = i; // 获取value相同的type
            }
        }

        let {income_type} = this.props.navigation.state.params;//获取type
        let income = "5k"; //默认值，
        for (let i in income_type) {
            if (this.state.income == income_type[i]) {//如果value相同
                income = i; // 获取value相同的type
            }
        }

        let weight = this.state.weight?this.state.weight.substring(0, this.state.weight.length-2):null;
        let height = this.state.height?this.state.height.substring(0, this.state.height.length-2):null;

        console.log(`https://app.jiaowangba.com/mine_info?nickname=${this.state.nickname}&live=${this.state.live}&hometown=${this.state.hometown}&wechat=${this.state.wechat}&marry=${marry}&occupation=${this.state.occupation}&education=${education}&height=${height}&weight=${weight}&income=${income}&house=${house}&idea=${this.state.idea}`);
        requestData(`https://app.jiaowangba.com/mine_info?birthdate=${this.state.birthdate}&nickname=${this.state.nickname}&wechat=${this.state.wechat}&marry=${marry}&occupation=${this.state.occupation}&education=${education}&height=${height}&weight=${weight}&income=${income}&house=${house}&idea=${this.state.idea}`, (res)=>{
            if (res.status == "success"){
                Alert.alert("提示", "保存个人信息成功", [{text:"确定", onPress:()=>{
                    this.props.navigation.state.params.refresh();
                    this.props.navigation.goBack();
                }}]);
            }else {
                Alert.alert("提示", "保存失败");
            }
        });
    }

    _createDateData() {
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
        return date;
    }

    _createAreaData() {
        let data = [];
        let len = area.length;
        for(let i=0;i < len;i++){
            let city = [];
            for(let j=0,cityLen=area[i]['city'].length;j < cityLen;j++){
                let _city = {};
                _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(area[i]['city'][j]['name']);
            }

            let _data = {};
            _data[area[i]['name']] = city;
            data.push(_data);
        }
        return data;
    }

    _showDatePicker() {
        PickerAreaDate.init({
            pickerData: this._createDateData(),
            pickerToolBarFontSize: 16,
            pickerFontSize: 16,
            selectedValue: ['2000年', '01月'],
            pickerFontColor: [0, 0 ,255, 1],
            pickerConfirmBtnText:"确定",
            pickerCancelBtnText:"取消",
            pickerTitleText:"出生日期",
            onPickerConfirm: (pickedValue, pickedIndex) => {
                let birthdate = pickedValue[0].substring(0, 4) + "-" + pickedValue[1].substring(0, 2) + "-" + pickedValue[2].substring(0, 2);
                this.setState({birthdate:birthdate});
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
            }
        });
        PickerAreaDate.show();
    }

    _showAreaPicker() {

        PickerAreaDate.init({
            pickerData: this._createAreaData(),
            pickerConfirmBtnText:"确定",
            pickerCancelBtnText:"取消",
            pickerTitleText:"居住城市",
            selectedValue: ['北京', '北京'],
            onPickerConfirm: pickedValue => {
                console.log('area', pickedValue);
                Alert.alert("", JSON.stringify(pickedValue));

                // let province = {};
                // province[item.value + "Province"] = text;
                // this.reqArea(item.value, this.state.area[index].id);
                // this.setState(province);
                //
                // let param = {};
                // param[item.value] = this.state.area[index].id;
                // this.setState(param);

            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue => {
                //Picker.select(['山东', '青岛', '黄岛区'])
                console.log('area', pickedValue);
            }
        });
        PickerAreaDate.show();
    }

    //普通picker
    renderPickerItem(arrContent){
        return arrContent.map((item, index)=>{
            return <Picker.Item label={item} value={item} key={index} style={styles.PagePerInfo.pickerItem}/>
        });
    }
    //省picker
    renderAreaPickerItem(){
        return this.state.area.map((item, index)=>{
            return <Picker.Item label={item.area} value={item.area} key={index} style={styles.PagePerInfo.pickerItem}/>
        });
    }
    //市picker
    renderCityPickerItem(cityDif){
        if (!this.state[cityDif + "city"]) return;
        return this.state[cityDif + "city"].map((item, index)=>{
            return <Picker.Item label={item.area} value={item.area} key={index} style={styles.PagePerInfo.pickerItem}/>
        });
    }

    renderFlatItem(item){
        let that = this;
        let {params} = this.props.navigation.state;
        let ComContent = <View/>;
        if (item.contentKey == 1){
            ComContent = <TextInput
                style={styles.PagePerInfo.itemTextInput}
                onChangeText={(text) => {
                    let param = {};
                    param[item.value] = text;
                    this.setState(param);
                }}
                placeholder={"请选择"}
                value={this.state[item.value]}
                underlineColorAndroid='transparent'
            />
        }else if(item.contentKey == 2){
            ComContent = <Picker
                style={styles.PagePerInfo.picker}
                selectedValue={this.state[item.value]}
                mode="dropdown"
                onValueChange={(text) => {
                    let param = {};
                    param[item.value] = text;
                    this.setState(param);
                }}>
                {that.renderPickerItem(item.arrContent)}
            </Picker>
        }else if (item.contentKey == 3){
            ComContent = <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={this._showAreaPicker.bind(this)}>
                    <Text style={styles.PagePerInfo.areaDate}>{this.state.live?this.state.live:"请选择"}</Text>
                </TouchableOpacity>
            </View>
        }else if (item.contentKey == 4) {
            ComContent = <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={this._showDatePicker.bind(this)}>
                    <Text style={styles.PagePerInfo.areaDate}>{this.state.birthdate?this.state.birthdate:"请选择"}</Text>
                </TouchableOpacity>
            </View>
        }
        return <View style={styles.PagePerInfo.flatItemView}>
            <View style={styles.PagePerInfo.titleleftView}>
                <Text style={styles.PagePerInfo.itemTitle}>{item.title}</Text>
            </View>
            <TouchableOpacity>
                <View style={{paddingRight:styles.setScaleSize(10)}}>{ComContent}</View>
             </TouchableOpacity>
        </View>
    }

    renderFlatList(){
        let that = this;
        let {params} = this.props.navigation.state;
        let arrPerInfo = that.perInfo();
            return  <View style={{flex:1}}>
                <FlatList
                    data={arrPerInfo}
                    keyExtractor = {(item, index) => ""+item+index}
                    renderItem={({item}) =>that.renderFlatItem(item)}
                />
            </View>
    }

    render() {

        return (
            <View style={[styles.live.container, {backgroundColor:"#fff"}]}>
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>个人信息</Text>
                    <TouchableOpacity style={styles.PagePerInfo.titleRight} onPress={()=>this.saveData()}>
                        <View><Text style={styles.homePage.title}>保存</Text></View>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex:1}}>
                    {this.renderFlatList()}
                    <View style={styles.PagePerInfo.footerView}>
                        <TextInput
                            style={styles.PagePerInfo.introduce}
                            onChangeText={(text)=>{
                                this.setState({idea: text});
                            }}
                            numberOfLines={8}
                            multiline={true}
                            underlineColorAndroid='transparent'
                            defaultValue={this.state.idea}
                        />
                    <View style={styles.PagePerInfo.footView}>
                            <TouchableOpacity>
                                <View style={styles.PagePerInfo.footBtn}><Text style={styles.PagePerInfo.footBtnText}>修改密码</Text></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{Alert.alert("提示", "请加客服微信：5941589");}}>
                                <View style={styles.PagePerInfo.footBtn}><Text style={styles.PagePerInfo.footBtnText}>注销账户</Text></View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default PagePerInfo;
