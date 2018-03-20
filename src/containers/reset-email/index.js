import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text, View, Alert, Image, TextInput, TouchableOpacity } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { loadUserInfo } from '../../actions/user'
import { resetEmail } from '../../actions/account'
import { ListItem } from '../../components/ui'
import CaptchaButton from '../../components/captcha-button'

import gStyles from '../../styles'

class ResetEmail extends React.Component {

  static navigationOptions = {
    title: '修改邮箱'
  }

  constructor (props) {
    super(props)
    this.state = {
      submitting: false
    }
    this.submit = this.submit.bind(this)
  }

  submit() {

    const self = this
    const { resetEmail, loadUserInfo } = this.props
    const { email, captcha, submitting } = this.state
    const { navigation } = this.props

    if (submitting) return
    if (!email) return Alert.alert('', '请输入你的邮箱')
    if (!captcha) return Alert.alert('', '请输入你的验证码')

    self.setState({ submitting: true })

    resetEmail({
      email,
      captcha,
      callback: (res) => {

        if (!res.success) {
          self.setState({ submitting: true })
          Alert.alert('', res.error)
        } else {

          loadUserInfo({
            callback: ()=>{
              self.setState({ submitting: true })
              // Alert.alert('', '提交成功')
              navigation.goBack()
            }
          })

        }
      }
    })

  }

  sendCaptcha(callback) {
    const { email } = this.state
    if (!email) return Alert.alert('', '请输入新邮箱')
    callback({ email, type: 'reset-email' })
  }

  render() {

    const { me } = this.props
    const { submitting } = this.state

    return (<ScrollView style={styles.container} keyboardShouldPersistTaps="always">
              <TextInput
                style={gStyles.radiusInputTop}
                autoCapitalize="none"
                onChangeText={(email) => this.setState({email})}
                placeholder='请输入你的新邮箱'
                autoFocus={true}
                underlineColorAndroid='transparent'
                />

                <View>
                    <TextInput
                        style={gStyles.radiusInputBottom}
                        onChangeText={(captcha) => this.setState({captcha})}
                        placeholder='验证码'
                        underlineColorAndroid='transparent'
                      />

                      <View style={{
                        position: 'absolute',
                        marginTop: 0,
                        height:45,
                        justifyContent: 'center',
                        marginLeft: global.screen.width - 150
                      }}>
                    <CaptchaButton sendCaptcha={this.sendCaptcha.bind(this)} />
                  </View>
                </View>

              <TouchableOpacity onPress={this.submit} style={[gStyles.fullButton, gStyles.mt10]}>
                <Text style={gStyles.white}>{submitting ? "提交中..." : "提交"}</Text>
              </TouchableOpacity>
          </ScrollView>)
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding:15
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    resetEmail: bindActionCreators(resetEmail, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetEmail)
