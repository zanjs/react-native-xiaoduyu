

import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getCaptcha } from '../../actions/captcha'

class CaptchaButton extends Component {

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      countdown: 0
    }
    this.getCaptcha = this.getCaptcha.bind(this)
  }

  getCaptcha() {

    const self = this
    const { getCaptcha, sendCaptcha } = this.props
    let { loading } = this.state

    sendCaptcha((data)=>{

      if (loading) return

      self.setState({ loading: true })

      getCaptcha({
        data,
        callback: (result)=>{

          if (result && !result.success) {
            self.setState({ loading: false })
            Alert.alert('', result.error)
            return
          }

          self.setState({ countdown: 60 })

          let run = () =>{

            if (!self._reactInternalInstance) {
              return
            }

            if (self.state.countdown == 0) {
              self.setState({ loading: false })
              return
            }
            self.setState({ countdown: self.state.countdown - 1 })
            setTimeout(()=>{ run() }, 1000)
          }

          run()

      }
      })
    })

  }

  render() {

    const { countdown } = this.state

    return (<TouchableOpacity onPress={this.getCaptcha}>
            <View style={styles.captchaButton}>
              <Text style={styles.text}>{countdown > 0 ? `发送成功 (${countdown})` : "获取验证码"}</Text>
            </View>
          </TouchableOpacity>)
  }
}


const styles = StyleSheet.create({
  captchaButton:{
    height:30,
    width:100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
    // backgroundColor: '#2eaaf7'
  },
  text: {
    color:'#fff',
    fontSize: 14
  }
})

export default connect((state, props) => {
    return {
    }
  },
  (dispatch) => ({
    getCaptcha: bindActionCreators(getCaptcha, dispatch)
  })
)(CaptchaButton)
