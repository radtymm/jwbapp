/**
 * Created by Administrator on 2017/7/16/016.
 */
import React from 'react';
import {
    Alert, ImageBackground, TouchableWithoutFeedback,
    View, Button,
    Text,FlatList,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

import {StackNavigator, TabNavigator} from 'react-navigation';
import  PageBaseData from './PageBaseData';
import styles from '../styleSheet/Styles';
import {requestData} from '../libs/request';
import CachedImage from 'react-native-cached-image';
// import SwipeCards from 'react-native-swipe-cards';
import Swiper from 'react-native-deck-swiper'


class PageLuck extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            cards: [],
            cards2: ['1', '2', '3'],
            outOfCards: false,
            swipedAllCards: false,
            swipeDirection: '',
            isSwipingBack: false,
            cardIndex: 0
        };
        this.data = {};
        this.reqData = this.reqData.bind(this);
    }

    componentDidMount(){
        this.reqData();
        this.reqData();
        this.reqData();
    }

    reqData(isGood){
        let that = this;
        if (isGood == "good"){
            requestData('https://app.jiaowangba.com/add_ilike?id=' + this.state.data.id, (res) => {
            });
        }

        requestData('https://app.jiaowangba.com/luck', (res) => {
            if (res.status == "success") {
                let cards = Object.assign([], this.state.cards);
                cards.push(res.code);
                this.setState({
                  cards: cards,
                })
            }else {
                // that.setState({dataNext:{}});
            }
        });
    }

    renderPerson(){
        let data = this.data;
        let imageSrc = {uri: 'https://cdn.jiaowangba.com/' + data.avatar};
        return (
            <TouchableOpacity style={styles.pageLuck.headTouch} onPress={()=>{this.props.navigation.navigate("PageBaseData" , data)}}>
                <View style={styles.pageLuck.contentView}>
                    <Image onLoadStart={()=>this.setState({load:'loading'})}
                        onLoad={()=>this.setState({load:'loadSuccess'})}
                        onError={()=>this.setState({load:'loadError'})}
                        style={styles.pageLuck.headImageLuck} source={imageSrc}/>
                    {(data.is_vip == "No")?<View/>:(<Image style={styles.minePage.isvip} source={require('../images/isvip.png')}/>)}
                    <View style={styles.pageLuck.nameView}>
                        <Text style={styles.pageLuck.nameText}>{data.nickname?data.nickname:""}</Text>
                    </View>
                    <View style={styles.pageLuck.ageLiveEduView}>
                        {(!data.age)?<View/>:<View style={styles.pageLuck.ageView}><Text style={styles.pageLuck.ageLiveEdu}>{(data.age+'岁')}</Text></View>}
                        <View style={styles.pageLuck.liveView}><Text style={styles.pageLuck.ageLiveEdu}>{data.live}</Text></View>
                        <View style={styles.pageLuck.eduView}><Text style={styles.pageLuck.ageLiveEdu}>{data.education}</Text></View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderBody(){
        if (!this.state.cards) {
            return;
        }
        return (<View style={styles.pageLuck.bodyView}>
            <View style={styles.pageLuck.headTouch}>
                <SwipeCards
                  cards={this.state.cards}
                  loop={false}
                  renderCard={() => this.renderPerson()}
                  renderNoMoreCards={() => this.renderPerson()}
                  showYup={true}
                  yupView={()=><Image style={styles.pageLuck.heartImg} source={require("../images/like.png")}/>}
                  showNope={true}
                  handleYup={() => this.reqData("good")}
                  handleNope={() => this.reqData("bad")}
                  cardRemoved={()=>{console.log(111);}}
                />
            </View>
            <View style={styles.pageLuck.bottomView}/>
            <View style={[styles.pageLuck.bottomView, {width:styles.setScaleSize(580),}]}/>
            <View style={styles.pageLuck.heartView}>
                <TouchableOpacity onPress={()=>{this.reqData("bad")}}>
                    <View>
                        <Image style={styles.pageLuck.heartImg} source={require("../images/unlike.png")}/>
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

    renderCard = card => {
        // return (
        //   <View style={styles.card}>
        //     <Text style={styles.text}>{card}</Text>
        //   </View>
        // )
        if (!card) {
            return;
        }
        let data = card;
        let imageSrc = {uri: 'https://cdn.jiaowangba.com/' + data.avatar};
        return (
            <TouchableWithoutFeedback style={styles.pageLuck.headTouch} onPress={()=>{this.props.navigation.navigate("PageBaseData" , data)}}>
                <View style={styles.pageLuck.contentView}>
                    <Image style={styles.pageLuck.headImageLuck} source={imageSrc}/>
                    {(data.is_vip == "No")?<View/>:(<Image style={styles.minePage.isvip} source={require('../images/isvip.png')}/>)}
                    <View style={styles.pageLuck.nameView}>
                        <Text style={styles.pageLuck.nameText}>{data.nickname?data.nickname:""}</Text>
                    </View>
                    <View style={styles.pageLuck.ageLiveEduView}>
                        {(!data.age)?<View/>:<View style={styles.pageLuck.ageView}><Text style={styles.pageLuck.ageLiveEdu}>{(data.age+'岁')}</Text></View>}
                        <View style={styles.pageLuck.liveView}><Text style={styles.pageLuck.ageLiveEdu}>{data.live}</Text></View>
                        <View style={styles.pageLuck.eduView}><Text style={styles.pageLuck.ageLiveEdu}>{data.education}</Text></View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    onSwipedAllCards = () => {
      this.setState({
        swipedAllCards: true
      })
    };

    jumpTo = () => {
      this.swiper.swipeLeft()
    };

    onSwiped(index, isGood){
        let that = this;
        if (isGood == "good"){
            requestData('https://app.jiaowangba.com/add_ilike?id=' + this.state.cards[index].id, (res) => {
            });
        }
        requestData('https://app.jiaowangba.com/luck', (res) => {
            if (res.status == "success") {
                let cards = Object.assign([], this.state.cards);
                this.state.cards.push(res.code);
            }else {
            }
        });
    }

    renderBody2(){
        return(
            <View style={styles.pageLuck.bodyView}>
                  <View style={styles.pageLuck.headTouch}/>
                  <View style={styles.pageLuck.bottomView}/>
                  <View style={[styles.pageLuck.bottomView, {width:styles.setScaleSize(580),}]}/>
                  <Swiper
                      ref={swiper => {
                          this.swiper = swiper
                      }}
                      onSwipedLeft={(index)=>this.onSwiped(index, 'bad')}
                      onSwipedBottom={(index)=>this.onSwiped(index, 'bad')}
                      onSwipedRight={(index)=>this.onSwiped(index, 'good')}
                      onSwipedTop={(index)=>this.onSwiped(index, 'good')}
                      onTapCard={this.jumpTo}
                      verticalSwipe={true}
                      cards={this.state.cards}
                      cardIndex={this.state.cardIndex}
                      backgroundColor="transparent"
                      cardVerticalMargin={80}
                      renderCard={this.renderCard}
                      cardVerticalMargin={styles.setScaleSize(20)}
                      cardHorizontalMargin={styles.setScaleSize(20)}
                      cardStyle={{height:styles.setScaleSize(900)}}
                      onSwipedAll={this.onSwipedAllCards}
                      overlayLabels={{
                          bottom: {
                              title: 'UNLIKE',
                              style: {
                                  label: {
                                      backgroundColor: 'black',
                                      borderColor: 'black',
                                      color: 'white',
                                      borderWidth: 1
                                  },
                                  wrapper: {
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                  }
                              }
                          },
                          left: {
                              title: 'UNLIKE',
                              style: {
                                  label: {
                                      backgroundColor: 'black',
                                      borderColor: 'black',
                                      color: 'white',
                                      borderWidth: 1
                                  },
                                  wrapper: {
                                      flexDirection: 'column',
                                      alignItems: 'flex-end',
                                      justifyContent: 'flex-start',
                                      marginTop: 30,
                                      marginLeft: -30
                                  }
                              }
                          },
                          right: {
                              title: 'LIKE',
                              style: {
                                  label: {
                                      backgroundColor: 'black',
                                      borderColor: 'black',
                                      color: 'white',
                                      borderWidth: 1
                                  },
                                  wrapper: {
                                      flexDirection: 'column',
                                      alignItems: 'flex-start',
                                      justifyContent: 'flex-start',
                                      marginTop: 30,
                                      marginLeft: 30
                                  }
                              }
                          },
                          top: {
                              title: 'LIKE',
                              style: {
                                  label: {
                                      backgroundColor: 'black',
                                      borderColor: 'black',
                                      color: 'white',
                                      borderWidth: 1
                                  },
                                  wrapper: {
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                  }
                              }
                          }
                      }}
                      animateOverlayLabelsOpacity
                      animateCardOpacity
                  />
                  <View style={styles.pageLuck.heartView}>
                      <TouchableOpacity onPress={()=>{this.swiper.swipeLeft()}}>
                          <View>
                              <Image style={styles.pageLuck.heartImg} source={require("../images/unlike.png")}/>
                          </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>{this.swiper.swipeRight()}}>
                          <View>
                              <Image style={styles.pageLuck.heartImg} source={require("../images/like.png")}/>
                          </View>
                      </TouchableOpacity>
                  </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:"#f5f5f5"}}>
                {styles.isIOS?<View style={styles.homePage.iosTab}/>:<View/>}
                <View style={styles.PagePerInfo.title}>
                    <TouchableOpacity style={styles.PagePerInfo.titleBack} onPress={()=>this.props.navigation.goBack(null)}>
                        <View style={styles.PagePerInfo.titleBackIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.homePage.title}>遇见缘分</Text>
                </View>
                <View style={{flex:1,}}>
                    {this.renderBody2()}
                </View>
            </View>
        );
    }
}



export default PageLuck;
