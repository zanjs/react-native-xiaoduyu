
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View, Button, Image, ImagePickerIOS, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'

import Platform from 'Platform'

import Qiniu,{ Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu'

import KeyboardSpacer from 'react-native-keyboard-spacer'

import { WebView } from 'react-native-webview-messaging/WebView'

import ImagePicker from 'react-native-image-crop-picker'

import { getQiNiuToken } from '../../actions/qiniu'
import { uploadFile } from '../../common/upload-qiniu'

class Editor extends Component {

  constructor() {
    super()
    this.state = {
      qiniu: null,
      json: '',
      html: '',
      loading: false
    }
    this.addPhoto = this.addPhoto.bind(this)
    this.init = this.init.bind(this)
  }

  componentWillMount() {
    const self = this
    // 获取七牛的token
    this.props.getQiNiuToken({
      callback: (res)=>{
        if (res) self.setState({ qiniu: res })
      }
    })

  }

  componentDidMount() {
    // KeyboardManager.setEnable(true);
  }

  render() {
    const self = this
    const { qiniu, loading } = this.state
    const { style } = this.props

    const source = (Platform.OS == 'ios') ? require('../../../editor/dist/index.html') : { uri: 'file:///android_asset/index.html' }

    // source={{uri:'http://192.168.1.106:9000'}}
    // source={require('../../../editor/dist/index.html')}
    return (<View style={styles.container}>

            <WebView
              // source={{uri:'http://192.168.1.106:9000'}}
              source={source}
              style={styles.editor}
              ref={ webview => { this.webview = webview; }}
              onLoad={()=>{ self.init() }}
              scalesPageToFit={false}
              />

            {qiniu ? <View style={styles.control}>
                      {!loading ?
                        <TouchableOpacity onPress={this.addPhoto} style={styles.addPhoto}>
                          <Image source={require('./images/photo.png')} style={styles.photoIcon} />
                          <Text style={styles.photoText}>上传图片</Text>
                        </TouchableOpacity>
                        : <View style={styles.addPhoto}><Text>图片上传中...</Text></View>}
                      <View style={{flex:1}}></View>
                    </View>: null}

            {Platform.OS === 'android' ? null : <KeyboardSpacer />}
          </View>)
  }

  _refWebView = (webview) => {
    this.webview = webview
  }

  init() {
    const self = this
    const { initialContentJSON, transportContent, focus } = this.props
    const { messagesChannel } = this.webview

    messagesChannel.on('transport-content', transportContent)

    if (initialContentJSON) {
      self.webview.emit('initial-content', initialContentJSON)
    }

    // console.log(this.webview);

    // if (focus) {
      // setTimeout(()=>{
        // console.log('123');
        // self.webview.emit('focus')
      // }, 1000)
    // }

  }

  uploadQiniu(image, callback) {

    const { qiniu } = this.state
    let id = image.localIdentifier

    Rpc.uploadFile(image.path, qiniu.token, { key : id }).then((response) => {

      if (response.responseText) {
        let res = JSON.parse(response.responseText)
        let imageUrl = qiniu.url+'/'+res.key
        callback(100, imageUrl)
      }

    }).then((responseText) => {
      // console.log(responseText);
    }).catch((error) => {
      // console.warn(error);
    })

  }

  addPhoto = () => {

    const self = this
    const { me } = this.props
    const { qiniu } = this.state

    ImagePicker.openPicker({
      compressImageMaxWidth: 900,
      compressImageMaxHeight: 900
    }).then(image => {

      self.setState({ loading: true })

      uploadFile({
        name: new Date().getTime() + '-' + me._id,
        imagePath: image.path,
        qiniu,
        callback: (progress, imageUrl)=>{

          if (imageUrl) {
            self.setState({ loading: false })
            self.webview.emit('add-photo', imageUrl)
          }

        }
      })

    })


  }

}

Editor.defaultProps = {
  initialContentJSON: '',
  transportContent: (data)=>{},
  focus: true,
  placeholder: '请输入...'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
  editor: {
    flex: 1
  },
  control: {
  },
  addPhoto: {
    paddingTop:8,
    paddingBottom:8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  photoIcon: {
    height:20,
    width:20
  },
  photoText: {
    marginLeft: 5,
    color: '#rgb(129, 129, 129)'
  }
})

export default connect(
  (state, props) => {
    return {
      me: getUserInfo(state)
    }
  },
  (dispatch, props) => ({
    getQiNiuToken: bindActionCreators(getQiNiuToken, dispatch)
  })
)(Editor)
