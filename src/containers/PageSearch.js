import React from 'react';
import {
    ScrollView, Alert, TextInput, View, Modal, Text, FlatList, TouchableOpacity, Image
} from 'react-native';
import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request.js';
import {height, weight, birthYear} from '../libs/data.js';
import PickerAreaDate from 'react-native-picker';
import area2 from '../libs/area.json';
let area = Object.assign([], area2);
area.push({
    "id": null,
    "name": "不限",
    "city": [
        {
            "id": '',
            "name": "不限"
        }
    ]
});

class PageSearch extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            data:[],
            pickedIndex:[0, 0],
            isRefreshing:false,
            live:'不限',
            marry:'不限',
            age_from:'不限',
            age_to:'不限',
            hometown:'不限',
            education:'不限',
            income:'不限',
            isVisibleModal:false,
        };
    }

    componentDidMount() {

    }

    componentWillUnmount(){
        PickerAreaDate.hide();
    }

    perInfo(){
        let {params} = this.props.navigation.state;

        let marry = [];
        for (let i in params.marry_type) {
            marry.push(params.marry_type[i]);
        }
        marry.push('不限');

        let education = [];
        for (let i in params.education_type) {
            education.push(params.education_type[i]);
        }
        education.push('不限');

        let income = [];
        for (let i in params.income_type) {
            income.push(params.income_type[i]);
        }
        income.push('不限');

        return [
            {title: "居住地", value:'live', contentKey:3, arrContent:this._createAreaData()},
            {title: "出生年份", value:'age', contentKey:4, arrContent:birthYear},
            {title: "家乡", value:'hometown', contentKey:3, arrContent:this._createAreaData()},
            {title: "收入", value:'income', contentKey:2, arrContent:income},
            {title: "婚姻状况", value:'marry', contentKey:2, arrContent:marry},
            {title: "学历", value:'education', contentKey:2, arrContent:education},
        ];
    }

    handleReset(){
        this.setState({
            live:'不限',
            marry:'不限',
            age_from:'不限',
            age_to:'不限',
            hometown:'不限',
            education:'不限',
            income:'不限',
        });
    }

    handleSearch(){

        let {education_type} = this.props.navigation.state.params;
        let education = '';
        for (let i in education_type) {
            if (this.state.education == education_type[i]) {
                education = i;
            }
        }
        let educationParam = `&education=${education}`

        let {marry_type} = this.props.navigation.state.params;
        let marry = '';
        for (let i in marry_type) {
            if (this.state.marry == marry_type[i]) {
                marry = i;
            }
        }
        let marryParam = `&marry=${marry}`

        let {income_type} = this.props.navigation.state.params;//获取type
        let income = '';
        for (let i in income_type) {
            if (this.state.income == income_type[i]) {//如果value相同
                income = i; // 获取value相同的type
            }
        }
        let incomeParam = `&income=${income}`

        let age_fromParam = (this.state.age_from != '不限')?`&age_from=${this.state.age_from}`:"&age_from=";
        let age_toParam = (this.state.age_to != '不限')?`&age_to=${this.state.age_to}`:"&age_to=";
        let liveParam = (this.state.live != '不限')?`&live=${this.state.liveid}`:"&live=";
        let hometownParam = (this.state.hometown != '不限')?`&hometown=${this.state.hometownid}`:"&hometown=";

        global.searchHomeParam = educationParam+marryParam+incomeParam+age_fromParam+age_toParam+liveParam+hometownParam;
        this.props.navigation.state.params.handleRefresh();
        this.props.navigation.goBack(null);
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

    _showPicker(data, selectedValue, title, callback) {
        PickerAreaDate.init({
            pickerData: data,
            pickerToolBarFontSize: 16,
            pickerFontSize: 16,
            selectedValue: selectedValue,
            pickerFontColor: [0, 0 ,255, 1],
            pickerConfirmBtnText:"确定",
            pickerCancelBtnText:"取消",
            pickerTitleText:title,
            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log(JSON.stringify(pickedValue));
                console.log(JSON.stringify(pickedIndex));
                callback(pickedValue, this.state.pickedIndex);
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log(JSON.stringify(pickedValue));
                console.log(JSON.stringify(pickedIndex));
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                this.setState({
                    pickedIndex:pickedIndex
                });
                console.log(JSON.stringify(pickedValue));
                console.log(JSON.stringify(pickedIndex));
            }
        });
        PickerAreaDate.show();
    }

    renderFlatItem(item){
        let that = this;
        let {params} = this.props.navigation.state;
        let ComContent = <View/>;

        if(item.contentKey == 2){
            //普通picker
            ComContent = <TouchableOpacity onPress={()=>this._showPicker(item.arrContent, [this.state[item.value]], item.title, (pickedValue, pickedIndex)=>{
                    let param = {};
                    param[item.value] = pickedValue[0];
                    this.setState(param);
                })}>
                <View style={styles.pageSearch.flatItemView}>
                    <View style={styles.pageSearch.titleleftView}>
                        <Text style={styles.pageSearch.itemTitle}>{item.title}</Text>
                    </View>
                    <View style={{paddingRight:styles.setScaleSize(50)}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.pageSearch.areaDate}>{this.state[item.value]?this.state[item.value]:"请选择"}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        }else if (item.contentKey == 3){
            //地区
            ComContent = <TouchableOpacity onPress={()=>this._showPicker(item.arrContent, ['北京', '北京'], item.title, (pickedValue, pickedIndex)=>{
                    let param = {};
                    param[item.value+"id"] = area[pickedIndex[0]].city[pickedIndex[1]].id;
                    param[item.value] = area[pickedIndex[0]].city[pickedIndex[1]].name;
                    this.setState(param);
                })}>
                <View style={styles.pageSearch.flatItemView}>
                    <View style={styles.pageSearch.titleleftView}>
                        <Text style={styles.pageSearch.itemTitle}>{item.title}</Text>
                    </View>
                    <View style={{paddingRight:styles.setScaleSize(50)}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.pageSearch.areaDate}>{this.state[item.value]?this.state[item.value]:"请选择"}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        }else if (item.contentKey == 4) {
            ComContent = <View style={styles.pageSearch.birthYearView}>
                <TouchableOpacity style={{flex:1}} onPress={()=>this._showPicker(item.arrContent, [this.state[item.value+'_from']], item.title, (pickedValue, pickedIndex)=>{
                    let param = {};
                    param[item.value+'_from'] = pickedValue[0];
                    this.setState(param);
                })}>
                    <View style={styles.pageSearch.flatItemView}>
                        <View style={styles.pageSearch.titleleftView}>
                            <Text style={styles.pageSearch.itemTitle}>{item.title}</Text>
                        </View>
                        <View style={{paddingRight:styles.setScaleSize(50)}}>
                            <View style={{flexDirection:"row"}}>
                                <Text style={styles.pageSearch.areaDate}>{this.state[item.value+'_from']?this.state[item.value+'_from']:"不限"}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <Text style={styles.pageSearch.areaDate}>至</Text>
                <TouchableOpacity style={{flex:1}} onPress={()=>this._showPicker(item.arrContent, [this.state[item.value+'_to']], item.title, (pickedValue, pickedIndex)=>{
                    let param = {};
                    param[item.value+'_to'] = pickedValue[0];
                    this.setState(param);
                })}>
                    <View style={styles.pageSearch.flatItemView}>
                        <View style={styles.pageSearch.titleleftView}>
                            <Text style={styles.pageSearch.itemTitle}>{item.title}</Text>
                        </View>
                        <View style={{paddingRight:styles.setScaleSize(50)}}>
                            <View style={{flexDirection:"row"}}>
                                <Text style={styles.pageSearch.areaDate}>{this.state[item.value+'_to']?this.state[item.value+'_to']:"不限"}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        }
        return ComContent;
    }

    renderFlatList(){
        let that = this;
        let arrPerInfo = this.perInfo();
            return  <View style={{flex:1}}>
                <FlatList
                    data={arrPerInfo}
                    keyExtractor = {(item, index) => ""+item+index}
                    renderItem={({item}) =>that.renderFlatItem(item)}
                />
            </View>
    }

    renderContent(){
        let ComContent = (
            <ScrollView style={{flex:1}} ref="scro">
                <View style={styles.pageSearch.selectView}>
                    <View style={styles.pageSearch.titleleftView}>
                        <Text style={styles.pageSearch.selectTitle}>高级筛选</Text>
                    </View>
                    <View style={{paddingRight:styles.setScaleSize(50)}}>
                        <View style={styles.pageSearch.vipView}>
                            <Text style={styles.pageSearch.vipText}>仅加入会员可用</Text>
                        </View>
                    </View>
                </View>
                {this.renderFlatList()}
                <View style={styles.pageSearch.footerView}>
                    <View style={styles.pageSearch.footView}>
                        <TouchableOpacity onPress={()=>this.handleReset()}>
                            <View style={styles.pageSearch.footResetBtn}><Text style={[styles.pageSearch.footBtnText, {color:"#555"}]}>重置</Text></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.handleSearch()}>
                            <View style={styles.pageSearch.footSearchBtn}><Text style={styles.pageSearch.footBtnText}>搜索</Text></View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
        return ComContent;
    }

    render() {

        return (
            <View style={[styles.live.container, {backgroundColor:"#fff"}]}>
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>筛选用户</Text>
                </View>
                {this.renderContent()}
            </View>
        );
    }
}

export default PageSearch;
