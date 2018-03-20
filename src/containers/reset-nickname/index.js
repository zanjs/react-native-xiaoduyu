import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Image, TextInput, Button, TouchableOpacity } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { resetNickname } from '../../actions/user'
import { ListItem } from '../../components/ui'
import HeadButton from '../../components/ui/head-button'

import gStyles from '../../styles'

class ResetNickname extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      title: '名字',
      headerRight: (<TouchableOpacity onPress={()=>params.submit()}>
        <HeadButton name="提交" />
      </TouchableOpacity>)
    }
  }

  constructor (props) {
    super(props)
    this.state = {}
    this.submit = this.submit.bind(this)
  }

  componentWillMount() {
    const { me } = this.props
    this.state.nickname = me.nickname
    this.props.navigation.setParams({
      submit: this.submit
    })
  }

  submit() {

    const self = this
    const { me, resetNickname, navigation } = this.props
    const { nickname } = this.state

    if (me.nickname == nickname) return navigation.goBack()
    if (!nickname) return Alert.alert('', '请输入您的名字')

    resetNickname({
      nickname,
      callback: (res) => {
        if (!res.success) {
          Alert.alert('', res.error)
        } else {
          navigation.goBack()
        }
      }
    })

  }

  render() {

    const { me } = this.props

    return (<View style={styles.container}>
              <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  onChangeText={(nickname) => this.setState({nickname})}
                  placeholder='你的名字'
                  defaultValue={me.nickname}
                  autoFocus={true}
                  underlineColorAndroid='transparent'
                />
          </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop:10,
  },
  input: {
    padding:10,
    backgroundColor:'#fff'
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    resetNickname: bindActionCreators(resetNickname, dispatch)
  })
)(ResetNickname);
