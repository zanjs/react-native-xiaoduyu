import React, { Component } from 'react'
import { StyleSheet, Text, Image, ImageBackground, View, TextInput, TouchableOpacity, AsyncStorage } from 'react-native'
import Platform from 'Platform'
import { NavigationActions } from 'react-navigation'


import KeyboardSpacer from 'react-native-keyboard-spacer'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin } from '../../actions/sign'
import { weiboGetUserInfo, QQGetUserInfo } from '../../actions/oauth'
import { getClientInstalled } from '../../reducers/client-installed'

import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

class FastSignIn extends Component {

  static navigationOptions = ({navigation}) => ({
    header: null
  })

  constructor (props) {
    super(props)
    this.state = {}
    this.handleSignIn = this.handleSignIn.bind(this)
    this.githubSignIn = this.githubSignIn.bind(this)
    this.qqSignIn = this.qqSignIn.bind(this)
    this.weiboSignIn = this.weiboSignIn.bind(this)
  }

  handleSignIn(access_token) {

    const self = this

    AsyncStorage.setItem('token', access_token, function(errs, result){

      // 储存token有效时间
      AsyncStorage.setItem('token_expires', (new Date().getTime() + 1000 * 60 * 60 * 24 * 30) + '', function(errs, result){

        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Welcome'})
          ]
        })

        global.initReduxDate(()=>{
          self.props.navigation.dispatch(resetAction)
        })

      })

    })

  }

  qqSignIn() {

    const self = this
    const { clientInstalled, QQGetUserInfo } = this.props
    const { navigate } = this.props.navigation

    if (clientInstalled.qq && Platform.OS === 'ios') {

     

    } else {
      navigate('OtherSignIn', {
        successCallback: token => this.handleSignIn(token),
        name: 'qq'
      })
    }

  }

  weiboSignIn() {

    const self = this
    const { navigate } = this.props.navigation
    const { clientInstalled, weiboGetUserInfo } = this.props

    /*
    if (clientInstalled.weibo && Platform.OS === 'ios') {
      WeiboAPI.login({
        scope: 'all',
        redirectURI: 'https://api.xiaoduyu.com'
      }).then((response)=>{

        weiboGetUserInfo({
          data: {
            weibo_access_token: response.accessToken,
            refresh_token: response.refreshToken,
            user_id: response.userID,
            expiration_date: response.expirationDate
          },
          callback: (res)=>{
            if (res.success) {
              self.handleSignIn(res.data.access_token)
            }
          }
        })

        // console.log(res);
      })
    } else {
    */
      navigate('OtherSignIn', {
        successCallback: token => this.handleSignIn(token),
        name: 'weibo'
      })
    // }

  }

  githubSignIn() {
    const { navigate } = this.props.navigation
    navigate('OtherSignIn', {
      successCallback: token => this.handleSignIn(token),
      name: 'github'
    })
  }

  render() {

    const self = this
    const { navigate } = this.props.navigation

    return (<ImageBackground source={require('../../images/bg.png')}  style={{ flex:1 }} resizeMode="cover">
      <View style={styles.container}>

        <View style={styles.welcome}>
          <Image source={require('./images/logo.png')} style={styles.logo} resizeMode="cover" />
          <View style={{backgroundColor:null}}><Text style={styles.welcomeText}>欢迎来到小度鱼。</Text></View>
        </View>

        <View style={styles.main}>
          <TouchableOpacity onPress={()=>navigate('SignIn')} style={styles.signInButton}>
            <Text style={styles.signInButtonText}>登陆</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigate('SignUp')} style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>创建账号</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex:1}}></View>

        <View style={styles.otherSignInContainer}>
          <View><Text style={styles.textWhite}>其他方式登陆</Text></View>
          <View style={styles.otherSignIn}>
            <TouchableOpacity onPress={this.qqSignIn} style={styles.otherSigninItem}>
              <View style={styles.iconView}><Image source={require('./images/qq.png')} style={styles.icon} resizeMode="cover" /></View>
              <View><Text style={styles.textWhite}>QQ</Text></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.weiboSignIn} style={styles.otherSigninItem}>
              <View style={styles.iconView}><Image source={require('./images/weibo.png')} style={styles.icon} resizeMode="cover" /></View>
              <View><Text style={styles.textWhite}>微博</Text></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.githubSignIn} style={styles.otherSigninItem}>
              <View style={styles.iconView}><Image source={require('./images/github.png')} style={styles.icon} resizeMode="cover" /></View>
              <View><Text style={styles.textWhite}>Github</Text></View>
            </TouchableOpacity>
          </View>
        </View>

      </View>
      </ImageBackground>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    width:null,
    height:null,
    backgroundColor:'transparent'
  },

  // logo
  welcome: {
    paddingTop:20,
    height:screenHeight*0.4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight:'bold'
  },
  logo: {
    width:screenHeight*0.12,
    height:screenHeight*0.12,
  },

  main: { padding:20 },

  // sign
  signInButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor:'#1e93db'
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16
  },

  // sign up
  signUpButton: {
    backgroundColor: '#fff',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 10
  },
  signUpButtonText: {
    color: '#0262a6',
    fontSize: 16
  },

  // other sign in
  otherSignInContainer: { padding:30, alignItems: 'center' },
  otherSignIn: { flexDirection: 'row', paddingTop:20 },
  otherSigninItem: { marginLeft:30, marginRight:30, alignItems: 'center' },
  iconView: { marginBottom:5 },
  icon: { width: 30, height: 30 },
  textWhite: { color:'#fff' }
})

export default connect(
  (state, props) => {
    return {
      clientInstalled: getClientInstalled(state)
    }
  },
  (dispatch, props) => ({
    signin: bindActionCreators(signin, dispatch),
    weiboGetUserInfo: bindActionCreators(weiboGetUserInfo, dispatch),
    QQGetUserInfo: bindActionCreators(QQGetUserInfo, dispatch)
  })
)(FastSignIn)
