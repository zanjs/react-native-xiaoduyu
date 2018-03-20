
import React, { Component } from 'react';
import { Text, View, ListView, Image, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadPostsList } from '../../actions/posts';
import { getPostListByName } from '../../reducers/posts'

import styles from './style'
import CommentItem from '../../components/comment-item'
import Loading from '../../components/ui/loading'
import Nothing from '../../components/nothing'
import ListFooter from '../../components/ui/list-footer'
// import RefreshControl from '../../components/ui/refresh-control'

// import ListViewOnScroll from '../../common/list-view-onscroll'

class PostsList extends Component {

  constructor (props) {
    super(props)

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      loadMore: false,
      isRefreshing: false,
      loading: false
    }
    this.goTo = this.goTo.bind(this)
    this.goToComment = this.goToComment.bind(this)
    this.loadPostsList = this.loadPostsList.bind(this)
    this.toPeople = this.toPeople.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  componentWillMount() {
    const { list } = this.props
    if (!list.data) this.loadPostsList()
  }

  componentDidMount() {

    const self = this
    // 将 scroll view 传递给父组件
    const { getRef = ()=>{}, onRefresh = ()=>{} } = this.props

    getRef(this.refs['scroll-view'])
    onRefresh(()=>{
      self._onRefresh()
    })

    // setTimeout(()=>{
    //   let scrollView = this.refs['scroll-view']
    //   console.log(scrollView.scrollTo({
    //     x: 0,
    //     y: 200,
    //     animated: true
    //   }))
    // }, 1000)


  }

  toPeople(people) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: people.nickname, id: people._id })
  }

  loadPostsList(callback, restart) {
    const { name, filters } = this.props
    this.props.loadPostsList({ name, filters, callback, restart })
  }

  goTo(posts){
    const { navigate } = this.props.navigation;
    // navigate('PostsDetail', { title: posts.title, id: '58b2850ed8831fe9027a5f92' })
    navigate('PostsDetail', { title: posts.title, id: posts._id })
  }

  goToComment(comment) {
    const { navigate } = this.props.navigation;
    navigate('CommentDetail', { title: comment.content_summary, id: comment._id })
  }

  renderHeader() {
    // return (<View><Text>发表</Text></View>)
  }

  _onRefresh() {
    const self = this
    this.setState({ isRefreshing: true })

    self.loadPostsList(()=>{
      self.setState({ isRefreshing: false })
    }, true)
    /*
    self.load(()=>{
      self.setState({ isRefreshing: false })
    }, true)
    */
  }

  onScroll(event) {

    const self = this
    const y = event.nativeEvent.contentOffset.y;
    const height = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    if (y + height >= contentHeight - 50 && !self.state.loading) {
      self.state.loading = true
      self.loadPostsList(()=>{
        setTimeout(()=>{
          self.state.loading = false
        }, 2000)
      })
    }

  }

  render() {

    const self = this
    const {
      list,
      // 是否显示用户信息
      hideUserInfo = false,
      // 自定义header
      renderHeader
    } = this.props

    // if (list.loading && list.data.length == 0 || !list.data) {
    //   return (<Loading />)
    // }

    // if (!list.loading && !list.more && list.data.length == 0) {
      // return (<Nothing content="没有帖子" />)
    // }

    // console.log(list.data);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let topics = ds.cloneWithRows(list.data || [])

    return (
        <ListView
          enableEmptySections={true}
          dataSource={topics}
          renderRow={(topic) => {

            let imagesUrl = ''

            if (topic.images && topic.images[0]) {
              imagesUrl = 'https:' + topic.images[0].split('?')[0] + '?imageMogr2/auto-orient/thumbnail/!400/format/jpg'
            }

            return(<TouchableOpacity style={styles.item} onPress={()=>{this.goTo(topic)}} activeOpacity={0.8}>

            <View style={styles.topicItem}>
                <View>
                  <View style={styles.itemHead}>

                    {!hideUserInfo ?
                      <View>
                        <TouchableOpacity onPress={()=>{this.toPeople(topic.user_id)}} activeOpacity={0.8}>
                          <Image source={{uri:'https:'+topic.user_id.avatar_url}} style={styles.avatar}  />
                        </TouchableOpacity>
                      </View>
                      : null}

                    <View>
                      {!hideUserInfo ?
                        <Text onPress={()=>{this.toPeople(topic.user_id)}} style={styles.nickname}>{topic.user_id.nickname}</Text>
                        : null}
                      <View style={styles.itemHeadOther}>
                        <Text style={styles.itemHeadOtherItem}>{topic.topic_id.name}</Text>
                        {topic.view_count ? <Text style={styles.itemHeadOtherItem}>{topic.view_count+'次浏览'}</Text> : null}
                        {topic.like_count ? <Text style={styles.itemHeadOtherItem}>{topic.like_count+'个赞'}</Text> : null}
                        {topic.comment_count ? <Text style={styles.itemHeadOtherItem}>{topic.comment_count+'个评论'}</Text> : null}
                        {topic.follow_count ? <Text style={styles.itemHeadOtherItem}>{topic.follow_count+'人关注'}</Text> : null}
                      </View>
                    </View>
                  </View>

                  {imagesUrl ?
                    <View><Image source={{uri:imagesUrl}} style={styles.images} resizeMode="cover" /></View>
                    : null}

                  <View style={styles.itemMain}>

                    <Text style={styles.title}>{topic.title}</Text>
                    {topic.content_summary ? <Text style={styles.contentText}>{topic.content_summary}</Text> : null}
                    {/*
                    <View style={styles.flexContainer}>
                      topic.images.map(img=>{
                        let _img = 'https:' + img.split('?')[0] + '?imageMogr2/auto-orient/thumbnail/!200/format/jpg'
                        return (<Image key={img} source={{uri:_img}} style={styles.images} />)
                      })
                    </View>
                    */}
                  </View>
                </View>

            </View>

            {/*topic.comment && topic.comment.map(item=>{
                return (<View key={item._id}>
                  <TouchableOpacity onPress={()=>{this.goToComment(item)}}>
                    <CommentItem {...this.props} comment={item} displayEdit={false} canClick={false} />
                  </TouchableOpacity>
                </View>)
              })*/}

            {/*topic.comment && topic.comment_count > topic.comment.length ?
              <TouchableOpacity onPress={()=>{this.goTo(topic)}} style={styles.more}><Text>还有{topic.comment_count - topic.comment.length}条评论，查看全部</Text></TouchableOpacity>
              : null*/}

          </TouchableOpacity>)
          }}
          renderHeader={renderHeader || this.renderHeader}
          renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
          removeClippedSubviews={false}
          onScroll={this.onScroll}
          scrollEventThrottle={50}
          ref='scroll-view'
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#484848"
              title="加载中..."
              titleColor="#484848"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffffff"
            />
          }
        />
    )
  }

}

/*
refreshControl={<RefreshControl onRefresh={callback=>self.loadPostsList(callback, true)} />}




*/

export default connect((state, props) => ({
    // state: state，
    list: getPostListByName(state, props.name)
  }),
  (dispatch) => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)(PostsList)
