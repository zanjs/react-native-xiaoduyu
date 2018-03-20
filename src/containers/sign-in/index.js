
import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, ScrollView, TextInput, Alert, TouchableOpacity, AsyncStorage, ImageBackground } from 'react-native'

import { NavigationActions } from 'react-navigation'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import KeyboardSpacer from 'react-native-keyboard-spacer'
import Wait from '../../components/ui/wait'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin } from '../../actions/sign'
import { getCaptchaId } from '../../actions/captcha'

import { api_url, api_verstion } from '../../../config'

import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width

import Platform from 'Platform'

import HeadButton from '../../components/ui/head-button'

class SignIn extends Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      // header: null,
      // headerTitle: '登录',
      headerRight: (<TouchableOpacity onPress={()=>params.signup()}><HeadButton name="忘记密码" color="#fff" /></TouchableOpacity>),
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
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      account: '',
      password: '',
      captchaId: null,
      captcha: '',
      visible: false,
      error: ''
    }
    this.submit = this.submit.bind(this)
    this.loadCaptcha = this.loadCaptcha.bind(this)
    // this._weiboLogin = this._weiboLogin.bind(this)
    // this._qqLogin = this._qqLogin.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.signup = this.signup.bind(this)
  }

  componentWillMount() {
    this.loadCaptcha()
  }

  componentDidMount() {
    this.props.navigation.setParams({
      signup: this.signup
    })
  }

  signup() {
    const { navigate } = this.props.navigation
    navigate('Forgot')
  }

  loadCaptcha() {
    
    const self = this
    const { getCaptchaId } = this.props

    getCaptchaId({
      callback: function (res) {

        if (!self._reactInternalInstance) {
          return
        }

        if (res && res.success && res.data) {
          self.setState({ captchaId: res.data })
        }
      }
    })

  }

  handleSignIn(access_token) {

    const self = this

    // 储存token
    AsyncStorage.setItem('token', access_token, function(errs, result){
      // 储存token有效时间
      AsyncStorage.setItem('token_expires', (new Date().getTime() + 1000 * 60 * 60 * 24 * 30) + '', function(errs, result){

        // setTimeout(()=>{

          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Welcome' })
            ]
          })

          self.props.navigation.dispatch(resetAction)

        // }, 1000)

      })

    })

  }

  submit() {
    const self = this
    const { account, password, captcha, captchaId } = this.state
    const { signin } = this.props

    const { navigation } = this.props
    const { navigate } = this.props.navigation

    let routeName = ''

    if (!account) return self.refs.email.focus()
    if (!password) return self.refs.password.focus()
    if (self.refs.captcha && !captcha) return self.refs.captcha.focus()

    self.setState({ visible: true, error: '' })

    let data = {
      email: account.indexOf('@') != -1 ? account : '',
      phone: account.indexOf('@') == -1 ? account : '',
      password
    }

    if (captcha) data.captcha = captcha
    if (captchaId) data.captcha_id = captchaId

    signin({
      data,
      callback: (res)=>{

        if (!res.success) {

          self.refs.password.clear()
          if (self.refs.captcha) self.refs.captcha.clear()

          self.loadCaptcha()
          self.setState({
            visible: false,
            error: res.error
          })
        } else {
          self.setState({ visible: false })
          setTimeout(()=>{
            self.handleSignIn(res.data.access_token)
          }, 1000)
        }

      }
    })


  }

  render() {

    const self = this
    const { captchaId, visible, error } = this.state
    const { navigate } = this.props.navigation

    return (<ImageBackground source={require('../../images/bg.png')}  style={{ flex:1 }} resizeMode="cover">
      <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>

      <View style={styles.title}><Text style={styles.titleText}>登陆</Text></View>

      {error ? <View style={styles.error}><Text style={styles.errorText}>账号或密码错误</Text></View> : null}

      <TextInput
          ref="email"
          style={styles.textInput}
          autoCapitalize={'none'}
          onChangeText={(account) => this.setState({account})}
          placeholder='请输入手机号或邮箱'
          autoFocus={true}
          maxLength={60}
          underlineColorAndroid='transparent'
          placeholderTextColor='#96d7ff'
          selectionColor="#fff"
        />

      <TextInput
          ref="password"
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          placeholder='请输入密码'
          maxLength={60}
          underlineColorAndroid='transparent'
          placeholderTextColor='#96d7ff'
          selectionColor="#fff"
        />

        {captchaId ?
            <View>
              <TextInput
                  ref="captcha"
                  style={styles.textInput}
                  onChangeText={(captcha) => this.setState({captcha})}
                  placeholder='请输入验证码'
                  maxLength={6}
                  keyboardType={'numeric'}
                  underlineColorAndroid='transparent'
                  placeholderTextColor='#96d7ff'
                  selectionColor="#fff"
                />
            <TouchableOpacity onPress={this.loadCaptcha}
              style={{
                position: 'absolute',
                marginTop: 12,
                marginLeft: screenWidth - 130
              }}
              >
              <Image source={{ uri:api_url + '/' + api_verstion + '/captcha-image/' + captchaId }} style={{ width:80, height:30 }}  />
            </TouchableOpacity>
          </View>
          : null}

      <TouchableOpacity onPress={this.submit} style={styles.button}>
        <Text style={styles.buttonText}>登录</Text>
      </TouchableOpacity>

      {visible ? <Wait /> : null}

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

  title: { marginBottom: 30, backgroundColor: 'transparent' },
  titleText: { color:'#fff', fontSize:32, fontWeight:'bold' },

  textInput: {
    // marginTop:15,
    color: '#fff',
    marginBottom:10,
    // borderBottomWidth:1,
    // borderColor: '#96d7ff',
    // paddingTop:15,
    // paddingBottom:15
    padding:15,
    borderRadius: 6,
    backgroundColor: '#1681c4'
  },

  button: {
    // marginTop:20,
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

  error: {
    paddingLeft:0,
    marginBottom:15
  },

  errorText: {
    fontSize: 16,
    color: '#fff'
  }

})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    signin: bindActionCreators(signin, dispatch),
    getCaptchaId: bindActionCreators(getCaptchaId, dispatch)
  })
)(SignIn)
