import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Image, TextInput, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { resetGender, loadUserInfo } from '../../actions/user'
import { ListItem } from '../../components/ui'

class ResetGender extends React.Component {

  static navigationOptions = {
    title: '性别'
  }

  constructor (props) {
    super(props)
    this.state = {
      submitting: false
    }
    this.submit = this.submit.bind(this)
  }

  submit(gender) {

    const self = this
    const { resetGender, loadUserInfo } = this.props
    const { submitting } = this.state
    const { navigation } = this.props

    if (submitting) return

    self.setState({ submitting: true })

    resetGender({
      gender: gender,
      callback: (res) => {

        if (!res.success) {
          self.setState({ submitting: true })
          Alert.alert('', res.error)
        } else {

          loadUserInfo({
            callback: ()=>{
              self.setState({ submitting: true })
              navigation.goBack()
            }
          })

        }
      }
    })

  }

  render() {

    const { me } = this.props
    const { submitting } = this.state

    return (<View style={{marginTop:10}}>
            <TouchableOpacity onPress={()=>{this.submit(1)}}><ListItem type={me.gender == 1 ? "hook" : "none"} name={"男"} /></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.submit(0)}}><ListItem type={me.gender == 0 ? "hook" : "none"} name={"女"} /></TouchableOpacity>
          </View>)
  }
}

const styles = StyleSheet.create({
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    resetGender: bindActionCreators(resetGender, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetGender);
