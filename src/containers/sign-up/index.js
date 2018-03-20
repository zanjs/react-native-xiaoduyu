

import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, ScrollView, TextInput, Alert, TouchableOpacity, AsyncStorage, ImageBackground } from 'react-native'

import { NavigationActions } from 'react-navigation'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signup, signin } from '../../actions/sign'
import gStyles from '../../styles'
import CaptchaButton from '../../components/captcha-button'
import SelectCountry from '../../components/select-country'

import KeyboardSpacer from 'react-native-keyboard-spacer'
import Wait from '../../components/ui/wait'

import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width

import Platform from 'Platform'

class SignUp extends Component {

  static navigationOptions = ({navigation}) => ({
    // headerTitle: '注册',
    headerStyle: {
      ...ifIphoneX({
        height: 75,
        paddingTop:30,
        backgroundColor: '#076dac',
        borderBottomWidth: 0
      }, {
        backgroundColor: '#076dac',
        borderBottomWidth: 0
      })
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      color: '#fff'
    }
  })

  constructor (props) {
    super(props)
    this.state = {
      account: '',
      password: '',
      captchaId: null,
      captcha: '',
      error: {},
      visible: false,
      areaCode: '',
      submitting: false
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  submit() {

    if (this.state.submitting) return

    const self = this
    const { nickname, account, password, captcha, gender, areaCode } = this.state
    const { signup, signin, navigation } = this.props

    if (!nickname) return this.refs.nickname.focus()
    if (nickname.replace(/(^\s+)|(\s+$)/g, '') == '') return Alert.alert('', '名字不能都是空格')
    if (!areaCode) return Alert.alert('', '请选择区号')
    if (!account) return this.refs.phone.focus()
    if (!captcha) return this.refs.captcha.focus()
    if (!password) return this.refs.password.focus()
    // if (!gender) return Alert.alert('', '请选择性别')

    self.setState({ visible: true })

    self.state.submitting = true

    signup({
      data: {
        nickname: nickname,
        phone: account,
        area_code: areaCode,
        password: password,
        captcha: captcha,
        // gender: gender == 'male' ? 1 : 0,
        source: 5
      },
      callback: (res)=>{

        self.state.submitting = false

        if (!res.success) {
          self.setState({ error: res.error, visible: false })
        } else {

          self.setState({ visible: false })

          signin({
            data: { phone: account, password: password },
            callback: (res)=>{

              // Alert.alert('', '注册成功')

              if (!res.success) {
                navigation.goBack()
              } else {
                self.handleSignIn(res.data.access_token)
              }

            }
          })

        }

      }
    })

  }

  handleSignIn(access_token) {

    const self = this

    AsyncStorage.setItem('token', access_token, function(errs, result){

      AsyncStorage.getItem('token', function(errs, result){

        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Main'})
          ]
        })

        global.initReduxDate(()=>{
          self.props.navigation.dispatch(resetAction)
        })

      })

    })

  }

  sendCaptcha(callback) {
    const { account, areaCode } = this.state
    if (!areaCode) return Alert.alert('', '请输入手机区号未选择')
    if (!account) return Alert.alert('', '请输入手机号')
    callback({ phone: account, area_code: areaCode, type: 'signup' })
  }

  render() {

    const self = this
    const { captchaId } = this.state
    const { nickname, phone, password, captcha, gender } = this.state.error
    const { navigate } = this.props.navigation

    return (
      <ImageBackground source={require('../../images/bg.png')}  style={{ flex:1 }} resizeMode="cover">
      <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>

      <View style={styles.title}><Text style={styles.titleText}>创建账号</Text></View>

      <View>

        <TextInput
          style={styles.textInput}
          onChangeText={(nickname) => this.setState({nickname})}
          placeholder='名字'
          ref="nickname"
          maxLength={40}
          underlineColorAndroid='transparent'
          placeholderTextColor='#96d7ff'
          selectionColor="#fff"
          />

        {nickname ? <View style={styles.tip}><Text style={styles.tipText}>{nickname}</Text></View> : null}

        <View style={{ flexDirection: 'row' }}>
          <View>
            <View style={styles.selectCountry}>
              <SelectCountry
                onChoose={(res)=>{
                  self.setState({ areaCode: res.code })
                }}
                />
            </View>
          </View>
          <View style={{flex:1}}>
          <TextInput
            // style={{ height:45, borderLeftWidth: 1, borderColor: '#e2e2e2', paddingLeft:10 }}
            style={[styles.textInput, { borderTopLeftRadius:0, borderBottomLeftRadius: 0 } ]}
            autoCapitalize="none"
            onChangeText={(account) => this.setState({account})}
            placeholder='手机号'
            ref="phone"
            maxLength={60}
            underlineColorAndroid='transparent'
            placeholderTextColor='#96d7ff'
            selectionColor="#fff"
            />
          </View>
        </View>

        {phone ? <View style={styles.tip}><Text style={styles.tipText}>{phone}</Text></View> : null}

        <View>
          <TextInput
            style={styles.textInput}
            onChangeText={(captcha) => this.setState({captcha})}
            placeholder='验证码'
            ref="captcha"
            maxLength={6}
            keyboardType={'numeric'}
            underlineColorAndroid='transparent'
            placeholderTextColor='#96d7ff'
            selectionColor="#fff"
            />
          <View style={{
            position: 'absolute',
            marginTop: 0,
            // backgroundColor:'#fff',
            height:50,
            justifyContent: 'center',
            marginLeft: screenWidth - 140
          }}>
            <CaptchaButton sendCaptcha={this.sendCaptcha} />
          </View>
        </View>

        {captcha ? <View style={styles.tip}><Text style={styles.tipText}>{captcha}</Text></View> : null}

        <TextInput
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          placeholder='密码'
          maxLength={30}
          ref="password"
          underlineColorAndroid='transparent'
          placeholderTextColor='#96d7ff'
          selectionColor="#fff"
          />

        {password ? <View style={styles.tip}><Text style={styles.tipText}>{password}</Text></View> : null}

        <TouchableOpacity onPress={this.submit} style={styles.button}>
          <Text style={styles.buttonText}>注册</Text>
        </TouchableOpacity>

    </View>

    <View style={styles.protocol}>
      <Text style={styles.protocolText} onPress={()=>{ navigate('Agreement') }}>轻点“注册”，即表示您同意小度鱼 用户协议</Text>
    </View>

    {this.state.visible ? <Wait /> : null}

    {Platform.OS === 'android' ? null : <KeyboardSpacer />}

    </ScrollView>
    </ImageBackground>)
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    // backgroundColor: '#139aef',
    padding:20,
    paddingTop:20,
    backgroundColor: 'transparent'
  },

  title: { marginBottom: 30 },
  titleText: { color:'#fff', fontSize:30, fontWeight:'bold' },

  buttonText: { color:'#139aef' },
  textInput: {
    color: '#fff',
    marginBottom:10,
    padding:15,
    borderRadius: 6,
    backgroundColor: '#1681c4'
  },

  selectCountry: {
    flex:1,
    marginBottom:10,
    // height:50,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#1681c4',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    paddingLeft:10
    // paddingRight:10
  },

  button: {
    height:50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',
    borderRadius: 6
  },
  buttonText: {
    color:'#0262a6',
    fontSize:16
  },

  protocol:{
    marginTop:10,
    flexDirection: 'row'
  },
  protocolText: {
    fontSize:12,
    color:'#fff',
    // marginRight:10,
    marginTop:10
  },

  tip:{
    marginBottom:15
  },
  tipText: {
    color:'#fff'
  }
})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    signup: bindActionCreators(signup, dispatch),
    signin: bindActionCreators(signin, dispatch)
  })
)(SignUp)
