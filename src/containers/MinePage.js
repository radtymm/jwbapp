import React from 'react';
import {
    StyleSheet, ScrollView, navigator, Alert, View, Text, Button, FlatList, Dimensions, TouchableOpacity,
    TouchableHighlight, Image, TextInput, Modal, ImageBackground,
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
        tabBarLabel: ()=><View style={styles.tabbar.iconTextTouch}><Text>我的</Text></View>,
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

    }

    refresh(){
        requestData("https://app.jiaowangba.com/info", (res) => {
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

    }

    pickSingleWithCamera() {
        ImageCropPicker.openCamera({
            cropping: true,
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
            {image: require('../images/perinfo.png'), title: "个人资料", navi: "PagePerInfo",},
            {image: require('../images/ilikewho.png'), title: "我喜欢谁", navi: "PageLikeWho",},
            {image: require('../images/wholikeme.png'), title: "谁喜欢我", navi: "PageLikeMe",},
            {image: require('../images/luck.png'), title: "遇见缘分", navi: "PageLuck",},
            {image: require('../images/vipcenter.png'), title: "会员中心", navi: "PageVip",},
            {image: require('../images/loginout.png'), title: "退出登录", navi: "",},
        ];

        return arrMine.map((item, index) => {

            return (
                <View style={[styles.minePage.arrMine, {paddingTop:index==0?styles.setScaleSize(40):styles.setScaleSize(0)}]} key={index}>
                    <TouchableOpacity onPress={()=>{
                            if (item.title == "退出登录"){
                                    requestData("https://app.jiaowangba.com/login_out", (res)=>{});
                                    this.props.navigation.navigate("Login");
                            }else if (item.title == "个人资料") {
                                let perInfoParams = Object.assign({}, this.state.res.code);
                                perInfoParams.refresh = this.refresh;
                                this.props.navigation.navigate(item.navi, perInfoParams);
                            }else{
                                this.props.navigation.navigate(item.navi, this.state.res.code);
                            }
                        }}>
                        <View style={styles.minePage.oneLineView}>
                            <Image style={styles.minePage.iconImg} resizeMode="contain"
                                   source={item.image}/>
                               <Text style={{fontSize:styles.setScaleSize(30), color:'#444'}}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                    {index==2?<View style={styles.minePage.spare}/>:<View/>}
                </View>
            );
        });
    }

    render() {
        let that = this;
        let imageSrc = require("../images/headDef.jpg");
        if (this.state.res.code && this.state.res.code.avatar != null){
            imageSrc = {uri: 'https://cdn.jiaowangba.com/' + this.state.res.code.avatar};
        }
        let isvip = <View/>;
        if (this.state.res.code && (this.state.res.code.is_vip != "No")){
            isvip = <Image style={styles.minePage.isvip} source={require('../images/isvip.png')}/>;
        }
        return (
            <ScrollView style={styles.minePage.flex}>
                <TouchableOpacity onPress={()=>that.openMycamera()}>
                    <View style={{alignItems: 'flex-start', justifyContent: 'center'}}>
                        <ImageBackground resizeMode="cover" style={ styles.homePage.headImage}
                           source={imageSrc}>
                            {isvip}
                        </ImageBackground>
                    </View>
                    </TouchableOpacity>
                    <View style={styles.minePage.nameId}>
                        <Text style={styles.minePage.name}>{this.state.res.code ? this.state.res.code.nickname : ""}</Text>
                        <Text style={styles.minePage.id}>ID号：{this.state.res.code ? this.state.res.code.id : ""}</Text>
                    </View>
                    <View style={styles.minePage.spare}/>
                {this.ElementText()}
            </ScrollView>
        );
    }
}

export default MinePage;
