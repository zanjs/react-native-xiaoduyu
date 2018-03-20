import React, { Component } from 'react'
import { StyleSheet, Text, ScrollView, View, Alert, Image, TextInput, TouchableOpacity, AsyncStorage } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { resetPassword } from '../../actions/account'
import { loadUserInfo } from '../../actions/user'
import { signout } from '../../actions/sign'
import { ListItem } from '../../components/ui'

import { NavigationActions } from 'react-navigation'

import gStyles from '../../styles'

class ResetPassword extends React.Component {

  static navigationOptions = {
    title: '修改密码'
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
    const { resetPassword, loadUserInfo, signout } = this.props
    const { currentPassword, newPassword, confirmPassword, submitting } = this.state
    const { navigation } = this.props

    if (submitting) return
    if (!currentPassword) return Alert.alert('', '请输入当前密码')
    if (!newPassword) return Alert.alert('', '请输入新密码')
    if (!confirmPassword) return Alert.alert('', '请再次输入新密码')
    if (!newPassword != !confirmPassword) return Alert.alert('', '两次密码不相同')
    if (currentPassword == newPassword) return Alert.alert('', '新密码不能与当前密码相同')

    self.setState({ submitting: true })

    resetPassword({
      currentPassword,
      newPassword,
      callback: (res) => {

        if (!res.success) {
          self.setState({ submitting: false })
          Alert.alert('', res.error)
        } else {

          // loadUserInfo({
          //   callback: ()=>{
          //     self.setState({ submitting: false })
              Alert.alert('', '密码修改成功，请重新登录')


              // signout()

              AsyncStorage.removeItem('token', function(res){

                global.cleanRedux()

                // setTimeout(()=>{

                  global.signIn = false

                  const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'SignIn'})
                    ]
                  })

                  self.props.navigation.dispatch(resetAction)

                // }, 2000)

                // navigation.goBack()
              })

              // navigation.goBack()
            // }
          // })

        }
      }
    })

  }

  render() {

    const { me } = this.props
    const { submitting } = this.state

    return (<ScrollView style={styles.container} keyboardShouldPersistTaps="always">
              <TextInput
                style={gStyles.radiusInputTop}
                autoCapitalize="none"
                onChangeText={(currentPassword) => this.setState({currentPassword})}
                secureTextEntry={true}
                placeholder='请输入当前密码'
                autoFocus={true}
                underlineColorAndroid='transparent'
                />
              <TextInput
                style={gStyles.radiusInputCenter}
                autoCapitalize="none"
                onChangeText={(newPassword) => this.setState({newPassword})}
                secureTextEntry={true}
                placeholder='请输入新密码'
                underlineColorAndroid='transparent'
                />
              <TextInput
                style={gStyles.radiusInputBottom}
                autoCapitalize="none"
                onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                secureTextEntry={true}
                placeholder='请再次输入新密码'
                underlineColorAndroid='transparent'
                />
              <TouchableOpacity onPress={this.submit} style={[gStyles.fullButton, gStyles.mt10]}>
                <Text style={gStyles.white}>{submitting ? "提交中..." : "提交"}</Text>
              </TouchableOpacity>
          </ScrollView>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:15
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    resetPassword: bindActionCreators(resetPassword, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    signout: bindActionCreators(signout, dispatch)
  })
)(ResetPassword)
