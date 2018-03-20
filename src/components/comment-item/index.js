import React from 'react'
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, PixelRatio } from 'react-native'
import HtmlView from '../html-view'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById } from '../../actions/comment'
import { like, unlike } from '../../actions/like'
// import LinkeButton from '../like-button'

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
// const CANCEL_INDEX = 0
// const DESTRUCTIVE_INDEX = 0
// const options = [ '取消', '回复', '赞', '编辑']

const S = global.styles

class CommentItem extends React.Component {

  constructor(props) {
    super(props)
    this.toPeople = this.toPeople.bind(this)
    this.reply = this.reply.bind(this)
    this.editComment = this.editComment.bind(this)
    this.showSheet = this.showSheet.bind(this)
  }

  toPeople(people) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: people.nickname, id: people._id })
  }

  reply(comment) {
    const { navigate } = this.props.navigation;
    navigate('WriteComment', {
      postsId: comment.posts_id._id,
      parentId: comment.parent_id || comment._id,
      replyId: comment._id
    })
  }

  editComment(comment) {

    const { navigate } = this.props.navigation;
    const { loadCommentById } = this.props

    loadCommentById({
      id: comment._id,
      callback: (res)=>{
        if (res) {
          navigate('WriteComment', { comment: res })
        }
      }
    })

  }

  showSheet(key) {

    if (!key) return

    const { comment, handleUnlike, handleLike, me } = this.props
    const { navigate } = this.props.navigation

    if (key == 1) {

      let fn = comment.like ? handleUnlike : handleLike

      fn({
        data: {
          type: comment.parent_id ? 'reply' : 'comment',
          target_id: comment._id,
          mood: 1
        },
        callback: (res)=> {

          // console.log(res);
          if (res && !res.success) {
            Alert.alert('', res.error : '提交失败')
          }
        }
      })

      return
    }

    if (key == 2) return this.reply(comment)
    if (me && me._id == comment.user_id._id && key == 3) return this.editComment(comment)
    if (key == 3 || key == 4) return navigate('Report', { comment })
  }

  render() {

    const self = this
    const {
      comment,
      displayLike = false,
      displayReply = false,
      subitem = false,
      displayCreateAt = false,
      displayEdit = true,
      canClick = true,
      me
    } = this.props

    let options = ['取消']
    options.push(comment.like ? '取消赞' : '赞')
    options.push('回复')
    if (displayEdit && me && me._id == comment.user_id._id) options.push('编辑')
    options.push('举报')

    let main = (<View style={[styles.item, subitem ? styles.subitem : null]}>

      <View style={styles.head}>

        <View>
          <TouchableOpacity onPress={()=>{ this.toPeople(comment.user_id) }} activeOpacity={1} style={styles.head}>
            <Image source={{uri:'https:'+comment.user_id.avatar_url}} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        <View>
          <View style={styles.nicknameView}>
            <Text style={styles.nickname} onPress={()=>{this.toPeople(comment.user_id)}}>{comment.user_id.nickname}</Text>
            {comment.reply_id ?
              <View style={[S['m-r-5'], S['m-l-5'], {marginTop:4}]}>
                <Image source={require('./images/arrow.png')} style={[{width:8,height:8}]} resizeMode="cover" />
              </View>
              : null}
            {comment.reply_id ? <Text style={styles.nickname} onPress={()=>{this.toPeople(comment.reply_id.user_id)}}>{comment.reply_id.user_id.nickname}</Text> : null}
          </View>
          
          <View style={[S['f-d-r'], S['m-t-5']]}>
            {displayCreateAt ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-30']]}>{comment._create_at}</Text> : null}
            {comment.reply_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-30']]}>{comment.reply_count + '个回复'}</Text> : null}
            {comment.like_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-30']]}>{comment.like_count + '个赞'}</Text> : null}
          </View>

        </View>
      </View>

      <View style={styles.main}>
        {comment.content_summary ?
          <Text style={styles.contentText}>{comment.content_summary}</Text> :
          <HtmlView html={comment.content_html} imgOffset={subitem ? 75 : 30} />}
      </View>

    </View>)

    if (canClick) {
      main = <TouchableOpacity onPress={()=>{ this.ActionSheet.show() }} activeOpacity={0.7}>
        {main}
      </TouchableOpacity>
    }

    return (<View>

        {main}

        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={options}
          cancelButtonIndex={0}
          destructiveButtonIndex={0}
          onPress={this.showSheet}
        />

      </View>)
  }
}

const styles = StyleSheet.create({
  item: {
    // flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#d4d4d4',
    borderTopWidth: 1/PixelRatio.get(),
    padding: 15
  },
  avatar:{
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight:10,
    marginTop:-2
  },
  main: {
    // marginTop: 5
  },
  head:{
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom:5
  },
  nicknameView: {
    flexDirection: 'row'
  },
  headLeft: {
    flexDirection: 'row'
  },
  nickname: {
    fontSize:13,
    fontWeight: 'bold'
    // marginRight: 10
  },
  other: {
    color: 'rgb(138, 138, 138)',
    fontSize: 12
  },
  headRight: {
    flexDirection: 'row'
  },
  like: {
    marginRight:15
  },
  subitem: {
    paddingLeft: 0
  },
  content: {
    flex:1,
    // paddingRight: 15
  },
  contentText: {
    lineHeight: 18
  }
})

export default connect((state, props) => {
    return {
    }
  },
  (dispatch, props) => ({
    loadCommentById: bindActionCreators(loadCommentById, dispatch),
    handleLike: bindActionCreators(like, dispatch),
    handleUnlike: bindActionCreators(unlike, dispatch)
  })
)(CommentItem)
