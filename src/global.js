
import React, { PureComponent } from 'react'
import { AsyncStorage, Dimensions } from 'react-native'

import { loadUserInfo, addAccessToken, cleanUserInfo } from './actions/user'
import { cleanAllNotification } from './actions/notification'
import { cleanAllPosts } from './actions/posts'
import { cleanAllComment } from './actions/comment'
import { cleanAllFollow } from './actions/follow'
import { cleanAllPeople } from './actions/people'
import { cleanAllTopic } from './actions/topic'
import { cleanAllBlock } from './actions/block'

import { checkClientInstalled } from './actions/client-installed'
import { exchangeNewToken } from './actions/token'
import styles from './styles'

global.styles = styles

export default ({ dispatch, getState }) => {

  const load = (accessToken, callback) => {
    loadUserInfo({ accessToken, callback: (res)=>{

      if (res && res.success) {
        // 正常登陆
        addAccessToken({ accessToken })(dispatch, getState)
        callback('has sign in')
      } else if (res && !res.success) {
        // token失效
        AsyncStorage.removeItem('token',()=>{
          // 判断账户是否是被封
          if (res._error && res._error == 10007) {
            callback('block account')
          } else {
            callback('sign in')
          }
        })
      } else {
        // api
        callback('network error')
      }

    }})(dispatch, getState)
  }

  global.screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }

  // 清空redux的所有数据
  global.cleanRedux = () => {
    cleanUserInfo()(dispatch, getState)
    cleanAllPosts()(dispatch, getState)
    cleanAllComment()(dispatch, getState)
    cleanAllNotification()(dispatch, getState)
    cleanAllFollow()(dispatch, getState)
    cleanAllPeople()(dispatch, getState)
    cleanAllTopic()(dispatch, getState)
    cleanAllBlock()(dispatch, getState)
  }

  // 初始化redux数据
  global.initReduxDate = (callback) => {

    // 清空之前的数据
    global.cleanRedux()

    // 检测是否安装了某些客户端
    checkClientInstalled()(dispatch, getState)

    // 如果存在token，那么检测token，是否有效
    AsyncStorage.getItem('token', (errs, accessToken)=>{

      if (!accessToken) return callback('sign in')

      AsyncStorage.getItem('token_expires', (errs, expires)=>{

        // 提前7天兑换新的token
        if (expires && new Date().getTime() > parseInt(expires) - 1000 * 60 * 60 * 24 * 7) {

          exchangeNewToken({
            accessToken,
            callback: (res)=>{

              if (res && res.success) {
                // 储存token
                AsyncStorage.setItem('token', res.data.access_token, function(errs, result){
                  // 储存token有效时间
                  AsyncStorage.setItem('token_expires', (new Date().getTime() + 1000 * 60 * 60 * 24 * 30) + '', function(errs, result){
                    load(accessToken, callback)
                  })
                })
              } else if (res && !res.success) {

                // 判断账户是否是被封
                if (res._error && res._error == 10007) {
                  callback('block account')
                } else {
                  callback('sign in')
                }

              } else {
                callback('network error')
              }

            }
          })(dispatch, getState)

          return
        }

        load(accessToken, callback)

      })
    })

  }

}
