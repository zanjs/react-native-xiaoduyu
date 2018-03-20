import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Image, TextInput, Button, TouchableOpacity, DeviceEventEmitter } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadUserInfo } from '../../actions/user'
import { getUserInfo, getAccessToken } from '../../reducers/user'
import { unbindingSocialAccount } from '../../actions/oauth'
import { weiboGetUserInfo, QQGetUserInfo } from '../../actions/oauth'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { ListItem } from '../../components/ui'

class SocialAccount extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

    let title = ''

    switch (params.socialName) {
      case 'qq': title = '腾讯QQ'; break;
      case 'weibo': title = '微博'; break;
      case 'github': title = 'GitHub'; break;
    }

    return {
      title: title
    }
  }

  constructor (props) {
    super(props)
    this.state = {}
    this.binding = this.binding.bind(this)
    this.unbinding = this.unbinding.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
    this.chooseSheet = this.chooseSheet.bind(this)
  }

  unbinding() {

  }

  binding() {

  }

  showActionSheet() {
    this.ActionSheet.show()
  }

  chooseSheet(key) {
    if (!key) return

    const self = this;
    const { me, accessToken } = this.props
    const { socialName } = this.props.navigation.state.params
    const { unbindingSocialAccount, loadUserInfo, weiboGetUserInfo, QQGetUserInfo } = this.props
    const { navigate } = this.props.navigation

    let binding = me[socialName]

    if (binding) {
      // 解除绑定
      unbindingSocialAccount({
        socialName,
        callback: (res)=>{
          loadUserInfo({
            callback:()=>{
              Alert.alert('', '解绑成功')
            }
          })
        }
      })
      return
    }

    if (socialName == 'github') {

      // 绑定
      navigate('GithubSignIn', {
        accessToken: accessToken,
        successCallback: (token)=>{
          loadUserInfo({
            callback:()=>{
              Alert.alert('', '绑定成功')
            }
          })
        },
        failCallback: (res)=>{
          if (res == 'has_been_binding') {
            Alert.alert('', '该账号已经被绑定了')
          }
        }
      })

    } else if (socialName == 'weibo') {


      if (!self.weiboLogin) {
          self.weiboLogin = DeviceEventEmitter.addListener(
              'managerCallback', (response) => {

                  weiboGetUserInfo({
                    data: {
                      weibo_access_token: response.res.accessToken,
                      refresh_token: response.res.refreshToken,
                      user_id: response.res.userID,
                      expiration_date: response.res.expirationDate
                    },
                    callback: (res)=>{

                      if (res.success) {
                        loadUserInfo({
                          callback:()=>{
                            Alert.alert('', '绑定成功')
                          }
                        })
                      } else {
                        Alert.alert('', res.error || '绑定失败')
                      }

                    }
                  })

                  self.weiboLogin.remove();
                  delete self.weiboLogin;
              }
          )
      }

    } 

  }

  render() {
    const { me, accessToken } = this.props
    const { socialName } = this.props.navigation.state.params

    let name = ''

    switch (socialName) {
      case 'qq': name = '腾讯QQ'; break;
      case 'weibo': name = '微博'; break;
      case 'github': name = 'GitHub'; break;
    }

    return (<View style={styles.container}>

      <TouchableOpacity onPress={this.showActionSheet}>
        <ListItem type="center" name={(me[socialName] ? '已绑定' : '绑定') + name } />
      </TouchableOpacity>

      <ActionSheet
        ref={o => this.ActionSheet = o}
        title={me[socialName] ? '解除绑定后，您将无法通过该 '+name+' 账户登陆' : '绑定后，您将可以通过该 '+name+' 账户登陆'}
        options={['取消', me[socialName] ? '解除绑定' : '绑定']}
        cancelButtonIndex={0}
        destructiveButtonIndex={0}
        onPress={this.chooseSheet}
      />

    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop:10
  }
})

export default connect(state => ({
    me: getUserInfo(state),
    accessToken: getAccessToken(state)
  }),
  (dispatch) => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    unbindingSocialAccount: bindActionCreators(unbindingSocialAccount, dispatch),
    weiboGetUserInfo: bindActionCreators(weiboGetUserInfo, dispatch),
    QQGetUserInfo: bindActionCreators(QQGetUserInfo, dispatch)
  })
)(SocialAccount);
