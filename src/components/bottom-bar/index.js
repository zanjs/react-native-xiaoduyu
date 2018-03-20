
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, PixelRatio } from 'react-native'
// import PropTypes from 'prop-types'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getUserInfo } from '../../reducers/user'
import { getClientInstalled } from '../../reducers/client-installed'

import LikeButton from '../../components/like-button'
import FollowButton from '../../components/follow-button'

import { wechat_appid, official_website } from '../../../config'


import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 0
const options = [ '取消', '分享到微信好友/群', '分享到微信朋友圈']

const S = global.styles

class BottomBar extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  goWriteComment() {

    const { navigate } = this.props.navigation
    const { me, posts, comment } = this.props

    let data = {}

    if (posts) {
      data.postsId = posts._id
    }

    if (comment) {
      data.postsId = comment.posts_id._id
      data.parentId = comment.parent_id ? comment.parent_id : comment._id
      data.replyId = comment._id
    }

    navigate('WriteComment', data)
  }

  share() {
    this.ActionSheet.show()
  }

  shareToWeChat(type) {

    if (!type) return

    const { posts, me } = this.props

        let title = posts.title
        let thumbImage = posts.images && posts.images[0] ? 'https:'+posts.images[0] : 'https://qncdn.xiaoduyu.com/300.png'
        let webpageUrl = official_website + '/posts/'+posts._id+'?sharer='+me._id

        if (type == 1) {

          let description = posts.content_html.replace(/\s/ig,'');
          description = description.replace(/<[^>]+>/g,"");

          if (description.length > 100) description = description.slice(0, 100)+'...'


console.log({
  type: 'news',
  title,
  description,
  webpageUrl,
  thumbImage
});

          WeChat.shareToSession({
            type: 'news',
            title,
            description,
            webpageUrl,
            thumbImage
          }).catch((e)=>{
            console.log(e)
          })

        } else {
          WeChat.shareToTimeline({
            type: 'news',
            title,
            webpageUrl,
            thumbImage
          }).catch((e)=>{
            console.log(e)
          })
        }

      // })
  }

  render() {

    const { posts, comment, clientInstalled } = this.props

    if (!posts && !comment) {
      return (<View></View>)
    }

    let target = posts || comment



    return (
        <View style={styles.bottomBar}>

          {comment ?
            <TouchableOpacity onPress={this.goWriteComment.bind(this)} style={styles.item}>
              <Image source={require('../comment-item/images/reply.png')} style={[{width:22,height:22}]} resizeMode="cover" />
              <Text style={[S['f-s-13'], S['m-l-5'], {color:'#595858'}]}>{target.reply_count || ''}</Text>
            </TouchableOpacity>
            : null}

          {posts ?
            <TouchableOpacity onPress={this.goWriteComment.bind(this)} style={styles.item}>
              <Image source={require('../comment-item/images/reply.png')} style={[{width:22,height:22}]} resizeMode="cover" />
              <Text style={[S['f-s-13'], S['m-l-5'], {color:'#595858'}]}>{target.comment_count || ''}</Text>
            </TouchableOpacity>
            : null}

          {clientInstalled.weixin && posts ?
            <TouchableOpacity onPress={this.share.bind(this)} style={styles.item}>
              <Image source={require('./images/share.png')} style={[{width:22,height:22}]} resizeMode="cover" />
            </TouchableOpacity>
            : null}

          <LikeButton likeType={posts ? 'posts' : 'comment'} target_id={target._id} {...target} />
          {posts ? <View style={styles.item}><FollowButton posts_id={posts._id} {...target} /></View> : null}

          <ActionSheet
            ref={o => this.ActionSheet = o}
            options={options}
            cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={DESTRUCTIVE_INDEX}
            onPress={this.shareToWeChat}
          />

        </View>
      )
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    ...ifIphoneX({
      height: 65,
      backgroundColor: '#fff',
      borderTopWidth: 1/PixelRatio.get(),
      borderColor: '#d4d4d4',
      flexDirection: 'row',
      paddingBottom: 15
    }, {
      height: 50,
      backgroundColor: '#fff',
      borderTopWidth: 1/PixelRatio.get(),
      borderColor: '#d4d4d4',
      flexDirection: 'row'
    })

  },
  comment: {
    // width: 50,
    // height: 50,
    // lineHeight: 50,
    // textAlign: 'center'
  },
  item: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect((state, props) => {
    return {
      me: getUserInfo(state),
      clientInstalled: getClientInstalled(state)
    }
  },
  (dispatch) => ({
  })
)(BottomBar)
