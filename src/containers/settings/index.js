import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity, AsyncStorage } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getUserInfo } from '../../reducers/user'
import { signout } from '../../actions/sign'
import { getClientInstalled } from '../../reducers/client-installed'

import { ListItem } from '../../components/ui'

import Platform from 'Platform'

import websocket from '../../common/websocket'

class Settings extends React.Component {

  static navigationOptions = {
    title: '设置'
  }

  constructor (props) {
    super(props)
    this.state = {
      qq: false,
      weibo: false
    }
    this.signOut = this.signOut.bind(this)
  }

  signOut() {

    const self = this
    const { navigation, signout } = this.props

    Alert.alert('', '您确认退出吗？', [
      {text:'取消',onPress:()=>{}},
      {text:'确定',onPress:()=>{
        signout()

        AsyncStorage.removeItem('binding-phone-tips', function(res){})

        AsyncStorage.removeItem('token', function(res){


          // 设置别名
         
          websocket.stop()

          global.cleanRedux()

          global.signIn = false


            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'Welcome'})
              ]
            })

            self.props.navigation.dispatch(resetAction)



        })

      }}
    ])

  }

  render() {

    const { me, clientInstalled } = this.props
    const { navigate } = this.props.navigation
    // const { qq, weibo } = this.state

    if (!me || !me._id) {
      return (<View></View>)
    }

    return (<ScrollView>
          <View style={styles.main}>

            <TouchableOpacity onPress={()=>{ navigate('ResetAvatar', {}) }}>
              <ListItem
                name={"头像"}
                rightElement={<Image source={{uri:'https:'+me.avatar_url}} style={{width:50,height:50,margin:10,borderRadius:25}} />}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('ResetNickname', {}) }}>
              <ListItem name={"名字"} rightText={me.nickname} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('ResetGender', {}) }}>
              <ListItem name={"性别"} rightText={typeof me.gender != 'undefined' ? (me.gender == 1 ? '男' : '女') : ''} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('ResetBiref', {}) }}>
              <ListItem name={"个性签名"} rightText={me.brief} />
            </TouchableOpacity>

            <View style={styles.gap}></View>

            {me.email || me.phone ?
              <TouchableOpacity onPress={()=>{ navigate('ResetPassword', {}) }}>
                <ListItem name={"密码"} />
              </TouchableOpacity>
              :null}

            <View style={styles.gap}></View>

            {me.email ?
              <TouchableOpacity onPress={()=>{ navigate('ResetEmail', {}) }}>
                <ListItem name={"邮箱"} rightText={me.email} />
              </TouchableOpacity>
              : <ListItem name={"邮箱"} rightText={'未绑定'} />}

            {me.phone ?
              <TouchableOpacity onPress={()=>{ navigate('ResetPhone', {}) }}>
                <ListItem name={"手机号"} rightText={me.phone} />
              </TouchableOpacity>
              : <TouchableOpacity onPress={()=>{ navigate('BindingPhone') }}>
                <ListItem name={"手机号"} rightText={'未绑定'} />
              </TouchableOpacity>}

            {clientInstalled.qq ?
              <TouchableOpacity onPress={()=>{ navigate('SocialAccount', { socialName: 'qq' }) }}>
                <ListItem name={"QQ"} rightText={me.qq ? '已绑定' : '未绑定'} />
              </TouchableOpacity>
              : null}

            {clientInstalled.weibo ?
              <TouchableOpacity onPress={()=>{ navigate('SocialAccount', { socialName: 'weibo' }) }}>
                <ListItem name={"微博"} rightText={me.weibo ? '已绑定' : '未绑定'} />
              </TouchableOpacity>
              :null}

            <TouchableOpacity onPress={()=>{ navigate('SocialAccount', { socialName: 'github' }) }}>
              <ListItem name={"GitHub"} rightText={me.github ? '已绑定' : '未绑定'} />
            </TouchableOpacity>

            <View style={styles.gap}></View>

            <TouchableOpacity onPress={()=>{ navigate('Block') }}>
              <ListItem name={"屏蔽设置"} />
            </TouchableOpacity>

            <View style={styles.gap}></View>

            <TouchableOpacity onPress={()=>{this.signOut()}}>
              <ListItem type="center" name={"退出"} />
            </TouchableOpacity>

          </View>
      </ScrollView>)
  }
}

const styles = StyleSheet.create({
  main: {
    marginTop: 10
  },
  avatarItem: {
    alignItems:'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  avatar: {
    width:20,
    height:20,
    backgroundColor: '#efefef'
  },
  icon: {
    width: 24,
    height: 24,
  },
  itme: {
    flexDirection: 'row',
    minHeight: 45,
    alignItems:'center',
    justifyContent: 'space-between',
    // justifyContent:'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    paddingLeft:20,
    paddingRight: 20
  },
  itemIcon: {
    width:20
  },
  arrowRight: {
    width:20,
    height:20,
  },
  gap: {
    height: 10
  },
  itmeCenter: {
    flexDirection: 'row',
    minHeight: 45,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    paddingLeft:20,
    paddingRight: 20
  }
})

export default connect(state => ({
    me: getUserInfo(state),
    clientInstalled: getClientInstalled(state)
  }),
  (dispatch) => ({
    signout: bindActionCreators(signout, dispatch)
  })
)(Settings)
