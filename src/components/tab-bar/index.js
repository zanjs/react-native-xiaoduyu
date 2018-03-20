
import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, AsyncStorage, TouchableOpacity, PixelRatio, Animated, Dimensions } from 'react-native'
import Platform from 'Platform'

import WriteIcon from '../ui/icon/write'

const { height, width } = Dimensions.get('window');

import { ifIphoneX } from 'react-native-iphone-x-helper'

class Tabbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      tabWidth: 80,
      contentOffset: { x: 0, y: 0 }
    }
    this.updateAnimation = this.updateAnimation.bind(this)
  }

  componentWillMount() {
    const { initialPage } = this.props
    this.updateAnimation(initialPage)
  }

  componentDidMount() {
    const self = this
    this.props.onScroll((index)=>{
      self.updateAnimation(index)
    })
  }

  updateAnimation(index) {

    const { tabs } = this.props
    let { tabWidth, contentOffset } = this.state

    let params = { fadeAnim: tabWidth * index }

    let postion = { x: 0, y: 0 }

    // 平均显示个数
    let per = Math.floor(width/tabWidth)

    // 超出部分的平均数
    let offset = (width - (tabWidth*per)) / 2

    let min = width/2,
        max = tabs.length * tabWidth - width

    // 大于屏幕个数时候，才对其计算
    if (tabs.length > per) {

      if (index * tabWidth > max) {
        postion.x = index * tabWidth - max
        if (postion.x > max) postion.x = max
      } else if (index * tabWidth > min) {
        postion.x = index * tabWidth - (per * tabWidth) / 2
      }

      if (Platform.OS == 'android') {
        if (this.refs['scroll-view']) {
          this.refs['scroll-view'].scrollTo(postion)
        }
      } else {
        params.contentOffset = postion
      }

    }

    this.setState(params)

  }

  render() {

    const self = this
    const { tabs, activeTab, goToPage, rightContent, redPointTab = [] } = this.props
    const { tabWidth, contentOffset } = this.state

    // console.log(this.state.fadeAnim);

    let centerContent = (<View style={styles.tabbarCenter}>
                <View style={[styles.tabView, { width: tabWidth * tabs.length }]}>
                  {tabs.map((item, index)=>{
                    return (<View key={index} style={{flex:1}}><TouchableOpacity onPress={()=>{ goToPage(index) }} activeOpacity={0.8} style={activeTab == index ? styles.tabActive : styles.tab}>
                          <Text style={{ color: activeTab == index ? '#08f' : '#23232b', fontSize:16, fontWeight: 'bold' }}>{item}</Text>
                      </TouchableOpacity>
                      {redPointTab.indexOf(index) != -1 ? <View style={styles.redPoint}></View> : null}
                    </View>)
                  })}
                </View>
                <View style={{ width: tabWidth * tabs.length }}>
                  <Animated.View style={[styles.underline, { marginLeft: this.state.fadeAnim }]}></Animated.View>
                </View>
              </View>)

    if (tabs.length > Math.floor(width/tabWidth)) {
      centerContent = (<ScrollView
        ref="scroll-view"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentOffset={contentOffset}
      >
        {centerContent}
      </ScrollView>)
    }


    return(<View style={styles.tabbar}>

        <View style={styles.tabbarLeft}></View>

        {centerContent}

        <View style={styles.tabbarRight}>
          {rightContent}
        </View>

      </View>)
  }
}

var styles = StyleSheet.create({
  tabbar: {
    ...ifIphoneX({
      backgroundColor: '#fff',
      paddingTop:30,
      height:75,
      flexDirection: 'row',
      borderBottomWidth: 1/PixelRatio.get(),
      borderColor: '#d4d4d4'
    }, {
      backgroundColor: '#fff',
      paddingTop: Platform.OS === 'android' ? 0 : 23,
      height: Platform.OS === 'android' ? 50 : 65,
      flexDirection: 'row',
      borderBottomWidth: 1/PixelRatio.get(),
      borderColor: '#d4d4d4'
    })
  },

  tabbarLeft: { flex:1 },
  tabbarRight: { flex:1 },
  tabbarCenter: {
    // flex:1,
    // backgroundColor:'#333'
    // flex:1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },

  scrollView: {
    // flex:1,
    // backgroundColor:'#efefef'
  },

  item: {
    flex: 1
    // flexDirection: 'row',
    // justifyContent: 'center'
  },
  tabView: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center'
  },
  tab: {
    flex:1,
    // borderBottomWidth: 3,
    // borderColor: '#fff',
    // width:80,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#efefef'
  },
  tabActive: {
    flex:1,
    // borderBottomWidth: 3,
    // borderColor: '#08f',
    // width:80,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#efefef'
  },
  // 下划线
  underline: {
    // flex:1,
    height:3,
    width:80,
    backgroundColor: '#08f'
  },
  itemFixed: {
    ...ifIphoneX({
      height: 45,
      width: 80,
      justifyContent: 'center',
      alignItems: 'center'
    }, {
      height: 45,
      width: 80,
      justifyContent: 'center',
      alignItems: 'center'
    })
  },

  redPoint: {
    position:'absolute',
    marginTop:10,
    marginLeft:53,
    width:8,
    height:8,
    backgroundColor: 'red',
    borderRadius: 4
  }
})

export default Tabbar
