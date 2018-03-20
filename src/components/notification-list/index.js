
import React, { Component } from 'react'
import { StyleSheet, Text, View, ListView, Image, refreshControl, TouchableOpacity, ActivityIndicator, RefreshControl, PixelRatio } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadNotifications } from '../../actions/notification';
import { getNotificationByName } from '../../reducers/notification'

import { DateDiff } from '../../common/date'

import CommentItem from '../../components/comment-item'
import HTMLView from '../../components/html-view'

import Loading from '../../components/ui/loading'
import Nothing from '../../components/nothing'
import ListFooter from '../../components/ui/list-footer'
// import RefreshControl from '../../components/ui/refresh-control'
// import ListViewOnScroll from '../../common/list-view-onscroll'

class NotificationList extends Component {

  constructor (props) {
    super(props)

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      isRefreshing: false,
      // 打开阅读全部的id
      readAllId: []
    }

    this.loadList = this.loadList.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.renderNotice = this.renderNotice.bind(this)
    this.toPeople = this.toPeople.bind(this)
    this.toPosts = this.toPosts.bind(this)
    this.toComment = this.toComment.bind(this)
    this.toReply = this.toReply.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.addReadAll = this.addReadAll.bind(this)
  }

  componentWillMount() {
    const { list } = this.props
    if (!list.data) this.loadList()
  }

  addReadAll(id) {
    let { readAllId } = this.state

    if (readAllId.indexOf(id) == -1) {
      readAllId.push(id)
      this.setState({ readAllId })
    }

  }

  toPeople(user) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { id: user._id })
  }

  toPosts(posts) {
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
  }

  toComment(comment) {
    const { navigate } = this.props.navigation;
    navigate('CommentDetail', { title: comment.content_trim, id: comment._id })
  }

  toReply(comment) {
    const { navigate } = this.props.navigation;
    navigate('WriteComment', {
      postsId: comment.posts_id._id,
      parentId: comment.parent_id ? comment.parent_id._id : null,
      replyId: comment._id
    })
  }

  loadList(callback, restart) {
    const { name, filters } = this.props
    this.props.loadNotifications({ name, filters, callback, restart })
  }

  renderHeader() {
    // return (<View><Text></Text></View>)
  }

  onScroll(event) {

    const self = this
    const y = event.nativeEvent.contentOffset.y;
    const height = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    if (y + height >= contentHeight - 50 && !self.state.loading) {
      self.state.loading = true
      self.loadList(()=>{
        setTimeout(()=>{
          self.state.loading = false
        }, 2000)
      })
    }

  }

  onRefresh() {
    const self = this
    this.setState({ isRefreshing: true })
    self.loadList(()=>{
      self.setState({ isRefreshing: false })
    }, true)
  }

  renderFooter() {
    const { list } = this.props

    if (list.loading) {
      return (<Loading />)
    } else if (!list.more) {
      return (
        <View>
          <Text>没有更多了</Text>
        </View>
      )
    }
  }

  renderNotice(notice) {

    const { readAllId } = this.state

    const avatar = <TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}} activeOpacity={0.8}><Image source={{ uri: 'https:'+notice.sender_id.avatar_url }} style={styles.avatar} /></TouchableOpacity>

    let content = null

    switch (notice.type) {

      case 'follow-you':
        content = (<View style={styles.itemContent}>
            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>
            <Text style={styles.gray}>关注了你</Text>
          </View>)
        break

      case 'follow-posts':
        content = (<View style={styles.itemContent}>
            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>
            <Text style={styles.title}>
              <Text style={styles.gray}>关注了你的</Text>
              <Text style={styles.black} onPress={()=>{this.toPosts(notice.posts_id)}}>{notice.posts_id.title}</Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>
          </View>)
        break

      case 'like-posts':
        content = (<View style={styles.itemContent}>
            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>
            <Text style={styles.title}>
              <Text style={styles.gray}>赞了你的</Text>
              <Text style={styles.black} onPress={()=>{this.toPosts(notice.posts_id)}}>{notice.posts_id.title}</Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>
          </View>)
        break

      case 'reply':
        content = (<View>
          <View style={styles.itemContent}>
            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>
            <Text style={styles.title}>
              <Text style={styles.gray}>回复了你的</Text>
              <Text style={styles.black} onPress={()=>{this.toComment(notice.comment_id.parent_id)}}>
                {notice.comment_id.reply_id ? notice.comment_id.reply_id.content_trim : notice.comment_id.parent_id.content_trim}
              </Text>
              <Text style={styles.gray}>回复</Text>
            </Text>
            <TouchableOpacity onPress={()=>{this.addReadAll(notice._id)}} activeOpacity={0.8}>
              <View style={styles.commentContent}>

                {readAllId.indexOf(notice._id) != -1 ?
                  <HTMLView html={notice.comment_id.content_html} imgOffset={30} />:
                  <Text style={styles.commentContentText}>
                    {notice.comment_id.content_trim}
                    {notice.comment_id.more ? <Text style={styles.readAll}>阅读全文</Text> : null}
                  </Text>}

              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.replyView} onPress={()=>{this.toReply(notice.comment_id)}} activeOpacity={0.8}>
            <Text>回复</Text>
          </TouchableOpacity>

        </View>)
        break

      case 'comment':
        content = (<View>

          <View style={styles.itemContent}>

            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>

            <Text style={styles.title}>
              <Text style={styles.gray}>评论了你的</Text>
              <Text style={styles.black} onPress={()=>{this.toPosts(notice.comment_id.posts_id)}}>{notice.comment_id.posts_id.title}</Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>

            <TouchableOpacity onPress={()=>{this.addReadAll(notice._id)}} activeOpacity={0.8}>
              <View style={styles.commentContent}>

                {readAllId.indexOf(notice._id) != -1 ?
                  <HTMLView html={notice.comment_id.content_html} imgOffset={30} />:
                  <Text style={styles.commentContentText}>
                    {notice.comment_id.content_trim}
                    {notice.comment_id.more ? <Text style={styles.readAll}>阅读全文</Text> : null}
                  </Text>}

              </View>
            </TouchableOpacity>

          </View>

          <TouchableOpacity style={styles.replyView} onPress={()=>{this.toReply(notice.comment_id)}} activeOpacity={0.8}>
            <Text>回复</Text>
          </TouchableOpacity>

        </View>)
        break

      // 新的回答通知
      case 'new-comment':
        content = (
          <View style={styles.itemContent}>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          <Text style={styles.title}>
            <Text style={styles.gray}>评论了</Text>
            <Text style={styles.black} onPress={()=>{this.toPosts(notice.comment_id.posts_id)}}>{notice.comment_id.posts_id.title}</Text>
            <Text style={styles.gray}>帖子</Text>
          </Text>
          <TouchableOpacity onPress={()=>{this.addReadAll(notice._id)}} activeOpacity={0.8}>

            {readAllId.indexOf(notice._id) != -1 ?
              <HTMLView html={notice.comment_id.content_html} imgOffset={30} />:
              <Text style={styles.commentContentText}>
                {notice.comment_id.content_trim}
                {notice.comment_id.more ? <Text style={styles.readAll}>阅读全文</Text> : null}
              </Text>}

          </TouchableOpacity>
        </View>)
        break

      case 'like-reply':
        content = (
          <View style={styles.itemContent}>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          <Text style={styles.title}>
            <Text style={styles.gray}>赞了你的</Text>
            <Text style={styles.black} onPress={()=>{this.toComment(notice.comment_id)}}>{notice.comment_id.content_trim}</Text>
            <Text style={styles.gray}>回复</Text>
          </Text>
        </View>)
        break

      case 'like-comment':
        content = (
        <View style={styles.itemContent}>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          <Text style={styles.title}>
            <Text style={styles.gray}>赞了你的</Text>
            <Text style={styles.black} onPress={()=>{this.toComment(notice.comment_id)}}>{notice.comment_id.content_trim}</Text>
            <Text style={styles.gray}>评论</Text>
          </Text>
        </View>)
        break
    }

    if (content) {
      return (<View style={styles.item} key={notice._id}>{content}</View>)
    } else {
      return <View></View>
    }

  }

  render() {

    const self = this

    const { list } = this.props

    if (list.loading && list.data.length == 0 || !list.data) {
      return (<Loading />)
    }

    if (!list.loading && !list.more && list.data.length == 0) {
      return (<Nothing content="没有通知" />)
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let itemlist = ds.cloneWithRows(list.data || [])

    return (
        <ListView
          enableEmptySections={true}
          dataSource={itemlist}
          renderRow={(item) => this.renderNotice(item)}
          // renderHeader={this.renderHeader}
          renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
          // renderFooter={this.renderFooter}
          removeClippedSubviews={false}
          // refreshControl={<RefreshControl onRefresh={callback=>self.loadList(callback, true)} />}

          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
              tintColor="#484848"
              title="加载中..."
              titleColor="#484848"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffffff"
            />
          }

          onScroll={this.onScroll}
          // onScroll={this._onScroll.bind(this)}
          scrollEventThrottle={50}
        />
    )
  }

}

const styles = StyleSheet.create({
  item: { marginTop: 10 },
  itemContent: { padding: 15, backgroundColor: '#fff' },
  commentContent:{ padding: 10, marginTop: 10, backgroundColor: '#efefef', borderRadius:5 },
  commentContentText: { lineHeight: 20, color:'#23232b' },
  nickname: { fontWeight: 'bold', marginRight: 10, color:'#23232b' },
  head: { flexDirection:'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 5 },
  avatar: { width: 20, height: 20, borderRadius: 10, marginRight: 5, backgroundColor:'#efefef' },
  gray: { color:'#909090' },
  black: { color:'#23232b' },
  title: { lineHeight: 20 },
  replyView: {
    height: 30,
    borderTopWidth: 1/PixelRatio.get(),
    borderColor: '#d4d4d4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  readAll: { color:'#08f' }
})


export default connect((state, props) => ({
    list: getNotificationByName(state, props.name)
  }),
  (dispatch) => ({
    loadNotifications: bindActionCreators(loadNotifications, dispatch)
  })
)(NotificationList)
