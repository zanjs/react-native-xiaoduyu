import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Button, Image, TextInput, TouchableOpacity } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { resetBrief } from '../../actions/user'

import HeadButton from '../../components/ui/head-button'

class ResetBrief extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      title: '个性签名',
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
    this.state.brief = me.brief
    this.props.navigation.setParams({
      submit: this.submit
    })
  }

  submit() {

    const self = this
    const { me, resetBrief, navigation } = this.props
    const { brief } = this.state

    if (me.brief == brief) return navigation.goBack()

    resetBrief({
      brief,
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

    return (<View>
              <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  onChangeText={(brief) => this.setState({brief})}
                  placeholder='请用一句话介绍你自己'
                  defaultValue={me.brief}
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
    marginTop:10,
    padding:10,
    backgroundColor:'#fff'
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    resetBrief: bindActionCreators(resetBrief, dispatch)
  })
)(ResetBrief);
