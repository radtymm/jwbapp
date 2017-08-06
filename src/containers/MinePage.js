import React from 'react';
import {
    StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, Modal,
} from 'react-native';
import {requestData, requestDataPost} from '../libs/request';
import styles from '../styleSheet/Styles';
// import ImagePicker from 'react-native-image-picker'; //第三方相机
import ImageCropPicker from 'react-native-image-crop-picker';
import Qiniu,{Auth,ImgOps,Conf,Rs,Rpc} from 'react-native-qiniu';


let photoOptions = {
    //底部弹出框选项
    title:'请选择',
    cancelButtonTitle:'取消',
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'选择相册',
    quality:0.75,
    allowsEditing:true,
    noData:false,
    storageOptions: {
        skipBackup: true,
        path:'images'
    }
};

class MinePage extends React.Component {
    static navigationOptions = {
        headerMode: "none",
        headerTitle: "我的",
        headerStyle: styles.homePage.headerStyle,
        tabBarLabel: ()=><Text>我的</Text>,
        // Note: By default the icon is only shown on iOS. Search the showIcon option below.
        tabBarIcon: ({tintColor}) => (
            <Image
                source={require('../images/person.png')}
                style={[styles.tabbar.icon, {tintColor: tintColor}]}
            />
        ),
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            modalVisible:false,
            res: {}
        };

        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh();
        requestData("https://app.jiaowangba.com/area", (res)=>{
            if (res.status == "success") {
                this.setState({area:res.code});
            }
        });
    }

    refresh(){
        requestData("http://app.jiaowangba.com/info", (res) => {
            if (res.status == "success"){
                this.setState({res: res});
            }else {
                Alert.alert("提示", "个人信息获取失败");
            }
        });
    }

    updateImage(uri, token){
        let arrName = uri.split("/");
        let formData = new FormData();
        let file = {uri: uri, type: 'application/octet-stream', name:arrName[arrName.length-1]};
        formData.append("token", token);
        formData.append("file", file);
        fetch('http://up.qiniu.com',{
            method:'POST',
            body:formData,
        })
            .then((response) => response.text() )
            .then((responseData)=>{
                let fkey = JSON.parse(responseData).code.fkey;
                requestData(`https://app.jiaowangba.com/mine_info?avatar=${fkey}`, (res)=>{
                    if (res.status == "success"){
                        this.refresh();
                    }else {
                        Alert.alert("提示", "图片上传失败");
                    }
                });
            })
            .catch((error)=>{console.error('error',error)});

    }

    openMycamera(){
        this.pickSingle();
        // Alert.alert("", "", [
        //     {text:"拍照", }
        // ])
    }

    pickSingleWithCamera() {
        ImageCropPicker.openCamera({
            cropping: true,
            // includeBase64:true,
            width: styles.WIDTH,
            height: styles.WIDTH,
        }).then(image => {
            requestData("https://app.jiaowangba.com/qiniu/uptoken", (res)=>{
                if (res.status == 'success'){
                    this.updateImage(image.path, res.code);
                }
            });
        }).catch(e => alert(e));
    }

    pickSingle( circular=false) {
        ImageCropPicker.openPicker({
            width: styles.WIDTH + 500,
            height: styles.WIDTH + 500,
            // compressImageQuality:1,
            hideBottomControls: false,
            cropping: true,
        }).then(image => {
            requestData("https://app.jiaowangba.com/qiniu/uptoken", (res)=>{
                if (res.status == 'success'){
                    this.updateImage(image.path, res.code, );
                }
            });
        }).catch(e => {
            console.log(e);
        });
    }

    ElementText() {
        let arrMine = [
            {image: require('../images/info.png'), title: "个人资料", navi: "PagePerInfo",},
            {image: require('../images/good.png'), title: "我喜欢谁", navi: "PageLikeWho",},
            {image: require('../images/whogood.png'), title: "谁喜欢我", navi: "PageLikeMe",},
            {image: require('../images/lucky1.png'), title: "遇见缘分", navi: "PageLuck",},
            {image: require('../images/vip.png'), title: "会员中心", navi: "PageVip",},
            {image: require('../images/out.png'), title: "退出登录", navi: "",},
        ];

        return arrMine.map((item, index) => {

            return (
                <View style={styles.minePage.arrMine} key={index}>
                    <View style={{flex:1,backgroundColor: '#f5f5f5',height:1,}}/>
                    <TouchableOpacity onPress={()=>{
                            if (item.title == "退出登录"){
                                    requestData("https://app.jiaowangba.com/login_out", (res)=>{});
                                    this.props.navigation.navigate("Login");
                            }else if (item.title == "个人资料") {
                                let perInfoParams = Object.assign({}, this.state.res.code);
                                perInfoParams.area = this.state.area;
                                perInfoParams.refresh = this.refresh;
                                this.props.navigation.navigate(item.navi, perInfoParams);
                            }else{
                                this.props.navigation.navigate(item.navi, this.state.res.code);
                            }
                        }}>
                        <View style={{flex:1, flexDirection: 'row', padding:10, alignItems:"center", }}>
                            <Image style={{width:27,height:27,marginLeft:10, marginRight:20 }}
                                   source={item.image}/>
                               <Text style={{fontSize:20, color:'#3a3a3a'}}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        });
    }

    render() {
        let that = this;
        let imageSrc = require("../images/headDef.jpg");
        if (this.state.res.code && this.state.res.code.avatar != null){
            imageSrc = {uri: 'http://cdn.jiaowangba.com/' + this.state.res.code.avatar};
        }
        return (
            <ScrollView style={styles.minePage.flex}>
                <TouchableOpacity onPress={()=>that.openMycamera()}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Image resizeMode="cover" style={ styles.homePage.headImage}
                           source={imageSrc}>
                           <View style={styles.minePage.vipView}>
                               <Text style={styles.minePage.vipText}>VIP</Text>
                           </View>
                            <View style={styles.minePage.nameId}>
                                <Text style={styles.minePage.name}>{this.state.res.code ? this.state.res.code.nickname : ""}</Text>
                                <Text style={styles.minePage.id}>ID号：{this.state.res.code ? this.state.res.code.id : ""}</Text>
                            </View>
                        </Image>
                    </View>
                </TouchableOpacity>
                {this.ElementText()}
            </ScrollView>
        );
    }
}

export default MinePage;
