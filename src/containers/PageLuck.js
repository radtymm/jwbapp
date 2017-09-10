/**
 * Created by Administrator on 2017/7/16/016.
 */
import React from 'react';
import {
    StyleSheet, Alert, Animated, ActivityIndicator, ImageBackground,
    View,
    Text,
    Button,
    SectionList,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

import {StackNavigator, TabNavigator} from 'react-navigation';
import  PageBaseData from './PageBaseData';
import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request';
import CachedImage from 'react-native-cached-image';
import SwipeCards from 'react-native-swipe-cards';

let Card = React.createClass({
  render() {
      return (
        <View style={styles.pageLuck.contentView}>
          <Image style={styles.pageLuck.headImageLuck} source={{uri: this.props.image}} />
          <Text >This is card {this.props.name}</Text>
        </View>
    )
  }
})

const Cards = [
  {name: '1', image: 'https://media.giphy.com/media/GfXFVHUzjlbOg/giphy.gif'},
  {name: '2', image: 'https://media.giphy.com/media/irTuv1L1T34TC/giphy.gif'},
  {name: '3', image: 'https://media.giphy.com/media/LkLL0HJerdXMI/giphy.gif'},
  {name: '4', image: 'https://media.giphy.com/media/fFBmUMzFL5zRS/giphy.gif'},
  {name: '5', image: 'https://media.giphy.com/media/oDLDbBgf0dkis/giphy.gif'},
  {name: '6', image: 'https://media.giphy.com/media/7r4g8V2UkBUcw/giphy.gif'},
  {name: '7', image: 'https://media.giphy.com/media/K6Q7ZCdLy8pCE/giphy.gif'},
  {name: '8', image: 'https://media.giphy.com/media/hEwST9KM0UGti/giphy.gif'},
  {name: '9', image: 'https://media.giphy.com/media/3oEduJbDtIuA2VrtS0/giphy.gif'},
]
const Cards2 = [
  {name: '10', image: 'https://media.giphy.com/media/12b3E4U9aSndxC/giphy.gif'},
  {name: '11', image: 'https://media4.giphy.com/media/6csVEPEmHWhWg/200.gif'},
  {name: '12', image: 'https://media4.giphy.com/media/AA69fOAMCPa4o/200.gif'},
  {name: '13', image: 'https://media.giphy.com/media/OVHFny0I7njuU/giphy.gif'},
]
let NoMoreCards = React.createClass({
  render() {
    return (
      <View style={styles.noMoreCards}>
        <Text>No more cards</Text>
      </View>
    )
  }
})

class PageLuck extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            cards: [],
            outOfCards: false,
        };
        this.cardRemoved = this.cardRemoved.bind(this);
        this.reqData = this.reqData.bind(this);
    }

    componentDidMount() {
        requestData('https://app.jiaowangba.com/luck', (res) => {
            if (res.status == "success") {
                this.setState({dataNext:res.code, cards:[{
                    name: '1', image: 'https://cdn.jiaowangba.com/' + res.code.avatar
                }]});
                this.reqData();
            }else {
                Alert.alert('提示', '网络异常');
            }
        });
    }

    reqData(isGood){
        let that = this;
        if (isGood == "good"){
            requestData('https://app.jiaowangba.com/add_ilike?id=' + this.state.data.id, (res) => {

            });
        }
        let data = Object.assign({}, this.state.dataNext);
        that.setState({data:data});
        requestData('https://app.jiaowangba.com/luck', (res) => {
            if (res.status == "success") {
                let data = Object.assign({}, this.state.dataNext);
                that.setState({dataNext:res.code});
                this.setState({
                  cards: [{
                      name: '1', image: 'https://cdn.jiaowangba.com/' + res.code.avatar
                  }],
                })
            }
        });
    }

    handleYup (card) {
      console.log("yup")
    }
    handleNope (card) {
      console.log("nope")
    }
    cardRemoved (index) {

      console.log(`The index is ${index}`);

      let CARD_REFRESH_LIMIT = 3

      if (this.state.cards.length - index <= CARD_REFRESH_LIMIT + 1) {
        console.log(`There are only ${this.state.cards.length - index - 1} cards left.`);

        if (!this.state.outOfCards) {
          console.log(`Adding ${Cards2.length} more cards`)

          this.setState({
            cards: this.state.cards.concat(Cards2),
            outOfCards: true
          })
        }

      }
    }


    renderBody(){
        if (!this.state.data) {
            return;
        }
        let imageSrc = {uri: 'https://cdn.jiaowangba.com/' + this.state.data.avatar};
        let imgBad = require("../images/unlike.png");

        let imgLoad = <View/>;
        if (this.state.load == 'loading') {
            imgLoad = <View style={[styles.pageLuck.headImageLuck, {backgroundColor:"#fff"}]}><ActivityIndicator size='large'/></View>;
        }else if (this.state.load == 'loadSuccess') {
            imgLoad = <View/>;
        }else if (this.state.load == 'loadError'){
            imgLoad = <View style={[styles.pageLuck.headImageLuck, {backgroundColor:"#fff"}]}><Text>图片加载失败。。。</Text></View>;
        }

        return (<View style={styles.pageLuck.bodyView}>
            <TouchableOpacity style={styles.pageLuck.headTouch} onPress={()=>{this.props.navigation.navigate("PageBaseData" , this.state.data)}}>
                <View style={styles.pageLuck.contentView}>
                    <CachedImage onLoadStart={()=>this.setState({load:'loading'})}
                        onLoad={()=>this.setState({load:'loadSuccess'})}
                        onError={()=>this.setState({load:'loadError'})}
                        style={styles.pageLuck.headImageLuck} source={imageSrc}>
                        {imgLoad}
                    </CachedImage>
                    {(this.state.data.is_vip == "No")?<View/>:(<Image style={styles.minePage.isvip} source={require('../images/isvip.png')}/>)}
                    <View style={styles.pageLuck.nameView}>
                        <Text style={styles.pageLuck.nameText}>{this.state.data.nickname?this.state.data.nickname:""}</Text>
                    </View>
                    <View style={styles.pageLuck.ageLiveEduView}>
                        {(!this.state.data.age)?<View/>:<View style={styles.pageLuck.ageView}><Text style={styles.pageLuck.ageLiveEdu}>{(this.state.data.age+'岁')}</Text></View>}
                        <View style={styles.pageLuck.liveView}><Text style={styles.pageLuck.ageLiveEdu}>{this.state.data.live}</Text></View>
                        <View style={styles.pageLuck.eduView}><Text style={styles.pageLuck.ageLiveEdu}>{this.state.data.education}</Text></View>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.pageLuck.bottomView}/>
            <View style={[styles.pageLuck.bottomView, {width:styles.setScaleSize(580),}]}/>
            <View style={styles.pageLuck.heartView}>
                <TouchableOpacity onPress={()=>{this.reqData("bad")}}>
                    <View>
                        <Image style={styles.pageLuck.heartImg} source={imgBad}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.reqData("good")}}>
                    <View>
                        <Image style={styles.pageLuck.heartImg} source={require("../images/like.png")}/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>);

    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:"#f5f5f5"}}>
            {/*<SwipeCards
              cards={this.state.cards}
              loop={false}

              renderCard={(cardData) => <Card {...cardData} />}
              renderNoMoreCards={() => <NoMoreCards />}
              showYup={true}
              showNope={true}

              handleYup={this.handleYup}
              handleNope={this.handleNope}
              cardRemoved={this.reqData}
            />*/}
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>遇见缘分</Text>
                </View>
                <ScrollView style={{flex:1,}}>
                    {this.renderBody()}
                </ScrollView>
            </View>
        );
    }
}



export default PageLuck;
