import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Button, Image, TextInput, TouchableOpacity } from 'react-native'

// import { NavigationActions } from 'react-navigation'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { resetAvatar, loadUserInfo } from '../../actions/user'
import { ListItem } from '../../components/ui'

import { getQiNiuToken } from '../../actions/qiniu'
import Qiniu,{ Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu'
import ImagePicker from 'react-native-image-crop-picker'

// import Loading from 'react-native-loading-w'
import Wait from '../../components/ui/wait'
import HeadButton from '../../components/ui/head-button'

import { uploadFile } from '../../common/upload-qiniu'

// console.log(uploadFile);

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 0
const options = [ '取消', '拍照', '从手机相册选中']
const title = ''

class ResetAvatar extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

    let option = { title: '头像' }

    if (params.showActionSheet) {
      option.headerRight = (<TouchableOpacity onPress={()=>params.showActionSheet()}>
                    <HeadButton name="修改" />
                  </TouchableOpacity>)
    }

    return option
  }

  constructor (props) {
    super(props)
    this.state = {
      qiniu: null,
      submitting: false
    }
    this.handlePress = this.handlePress.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
    this.uploadQiniu = this.uploadQiniu.bind(this)
    this.updateAvatar = this.updateAvatar.bind(this)
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
    this.props.navigation.setParams({
      showActionSheet: this.showActionSheet
    })
  }

  // getLoading() {
  // 	return this.refs['loading'];
  // }

  updateAvatar(imageUrl, callback) {

    const { resetAvatar, loadUserInfo } = this.props

    resetAvatar({
      avatar: imageUrl,
      callback: (res) => {

        if (res && res.success) {
          callback(true)
        } else {
          Alert.alert('', res && res.error ? res.error : '上传失败')
          callback(false)
        }

      }
    })

  }

  showActionSheet() {
    this.ActionSheet.show()
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

  handlePress(i) {

    const self = this
    const { me } = this.props
    const { qiniu } = this.state

    if (!i) {
    } else if (i == 1) {

      ImagePicker.openCamera({
        width: 512,
        height: 512,
        cropping: true
      }).then(image => {

        image.localIdentifier = new Date().getTime() + '-' + me._id
        // self.getLoading().show('头像上传中...');
        self.setState({ visible: true })

        uploadFile({
          name: new Date().getTime() + '-' + me._id,
          imagePath: image.path,
          qiniu,
          callback: (progress, imageUrl)=>{
            if (imageUrl) {
              self.updateAvatar(imageUrl,()=>{
                self.setState({ visible: false })
                // self.getLoading().dismiss()
              })
            }
          }
        })

        /*
        image.localIdentifier = new Date().getTime() + '-' + me._id

        self.getLoading().show('头像上传中...');

        self.uploadQiniu(image, (progress, imageUrl)=>{
          if (imageUrl) {
            self.updateAvatar(imageUrl,()=>{
              self.getLoading().dismiss()
            })
          }
        })
        */

      })

    } else if (i == 2) {

      ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true
      }).then(image => {

        image.localIdentifier = new Date().getTime() + '-' + me._id
        // self.getLoading().show('头像上传中...');

        self.setState({ visible: true })

        uploadFile({
          name: new Date().getTime() + '-' + me._id,
          imagePath: image.path,
          qiniu,
          callback: (progress, imageUrl)=>{
            if (imageUrl) {
              self.updateAvatar(imageUrl,()=>{
                self.setState({ visible: false })
                // self.getLoading().dismiss()
              })
            }
          }
        })

        /*
        self.uploadQiniu(image, (progress, imageUrl)=>{

          console.log(progress);
          console.log(imageUrl);

          if (imageUrl) {
            self.updateAvatar(imageUrl,()=>{
              self.getLoading().dismiss()
            })
          }
        })
        */

      })

    }
  }

  render() {

    const { me } = this.props
    const { submitting } = this.state

    let avatar = 'https:' + me.avatar_url.replace('thumbnail/!50', 'thumbnail/!300')

    return (<View style={styles.container}>
              <Image source={{uri: avatar}} style={styles.avatar} />

              <ActionSheet
                ref={o => this.ActionSheet = o}
                title={title}
                options={options}
                cancelButtonIndex={CANCEL_INDEX}
                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                onPress={this.handlePress}
              />

              {this.state.visible ? <Wait text="头像上传中..." /> : null}

              {/*<Loading ref={'loading'} text={'Loading...'} />*/}

          </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
  avatar: {
    width: 300,
    height: 300,
    borderRadius: 150
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    getQiNiuToken: bindActionCreators(getQiNiuToken, dispatch),
    resetAvatar: bindActionCreators(resetAvatar, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetAvatar);
