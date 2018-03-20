

import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View, Image, Button, ScrollView, WebView, TouchableOpacity, AsyncStorage, Alert, PixelRatio } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPostsById, addViewById } from '../../actions/posts'
import { getPostsById } from '../../reducers/posts'
import { getUserInfo } from '../../reducers/user'
import { block, unblock } from '../../actions/block'

import HTMLView from '../../components/html-view'
import Img from '../../components/image'
import CommentList from '../../components/comment-list'
import BottomBar from '../../components/bottom-bar'
import MenuIcon from '../../components/ui/icon/menu'

import Loading from '../../components/ui/loading'
import Nothing from '../../components/nothing'

import Wait from '../../components/ui/wait'

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

const S = global.styles

class PostsDetail extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    // <Button onPress={()=>params.menu()} title={"菜单"} />
    let option = {
      headerTitle: params.title
    }

    if (params.menu) {
      option.headerRight = (<TouchableOpacity onPress={()=>params.menu()}><MenuIcon /></TouchableOpacity>)
    }

    return option
  }

  constructor (props) {
    super(props)
    this.state = {
      nothing: false
    }
    this.goWriteComment = this.goWriteComment.bind(this)
    this.toPeople = this.toPeople.bind(this)
    this.menu = this.menu.bind(this)
    this.showSheet = this.showSheet.bind(this)
  }

  componentWillMount() {

    const self = this
    const id = this.props.navigation.state.params.id
    const { loadPostsById, me } = this.props
    const [ posts ] = this.props.posts

    if (!posts || !posts.content) {
      loadPostsById({ id, callback: (res)=>{

        if (!res) return self.setState({ nothing: true })

        this.props.navigation.setParams({
          menu: this.menu
        })

      }})
      return
    }

    this.props.navigation.setParams({
      menu: this.menu
    })

  }

  componentDidMount() {

    const self = this
    const id = this.props.navigation.state.params.id
    const { addViewById } = this.props

    AsyncStorage.getItem('view-posts', (errs, viewPosts)=>{

        if (!viewPosts) viewPosts = ''

      AsyncStorage.getItem('last-viewed-posts-at', (errs, lastViewPostsAt)=>{
        if (!lastViewPostsAt) {
          lastViewPostsAt =  new Date().getTime()
        } else {
          lastViewPostsAt = parseInt(lastViewPostsAt)
        }

        // 如果超过1小时，那么浏览数据清零
        if (new Date().getTime() - lastViewPostsAt > 3600000) viewPosts = ''

        viewPosts = viewPosts.split(',')

        if (!viewPosts[0]) viewPosts = []

        if (viewPosts.indexOf(id) == -1) {

          viewPosts.push(id)

          AsyncStorage.setItem('view-posts', viewPosts.join(','), function(errs, result){})
          AsyncStorage.setItem('last-viewed-posts-at', new Date().getTime()+'', function(errs, result){})
          addViewById({ id: id })
        }

      })
    })

  }

  menu(key) {
    this.ActionSheet.show()
  }

  showSheet(key) {

    if (!key) return

    const self = this
    const [ posts ] = this.props.posts
    const { navigate } = this.props.navigation
    const { me, block, unblock, navigation } = this.props

    if (me._id == posts.user_id._id && key == 1) {
      navigate('WritePosts', { topic: posts.topic_id, posts })
    } else if (key == 1) {

      self.setState({ visibleWait: true })

      if (me.block_posts.indexOf(posts._id) == -1) {

        block({
          data: { posts_id: posts._id },
          callback: (res)=>{
            self.setState({ visibleWait: false }, ()=>{
              if (res && res.success) {
                navigation.goBack()
              } else {
                setTimeout(()=>{
                  Alert.alert('', res.error || '提交失败')
                }, 1000)
              }
            })
          }
        })
      } else {
        unblock({
          data: { posts_id: posts._id },
          callback: (res)=>{

            self.setState({ visibleWait: false }, ()=>{
              if (res && res.success) {
                navigation.goBack()
              } else {
                setTimeout(()=>{
                  Alert.alert('', res.error || '提交失败')
                }, 1000)
              }
            })

          }
        })
      }
    } else if (key == 2) {
      navigate('Report', { posts })
    }

  }

  toPeople(user) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: user.nickname, id: user._id })
  }

  goWriteComment() {

    const { navigate } = this.props.navigation
    const [ posts ] = this.props.posts
    const { me } = this.props

    if (me) {
      navigate('WriteComment', { postsId: posts._id })
    } else {
      navigate('SignIn')
    }

  }

  render() {

    const [ posts ] = this.props.posts
    const { nothing } = this.state
    const { me } = this.props

    if (nothing) return (<Nothing content="帖子不存在或已删除" />)
    if (!posts) return <Loading />

    let options = [ '取消' ]
    if (me._id == posts.user_id._id) {
      options.push('编辑')
    } else {
      options.push(me.block_posts.indexOf(posts._id) == -1 ? '屏蔽' : '取消屏蔽')
      options.push('举报')
    }

    return (<View style={styles.container}>
        <ScrollView style={styles.main}>
          <View>

            <View style={styles.itemHead}>
              <View>
                <TouchableOpacity onPress={()=>{this.toPeople(posts.user_id)}}>
                  <Image source={{uri:'https:'+posts.user_id.avatar_url}} style={styles.avatar}  />
                </TouchableOpacity>
              </View>
              <View>
                <Text onPress={()=>{this.toPeople(posts.user_id)}} style={[S['bold'], S['m-b-5']]}>{posts.user_id.nickname}</Text>
                <View style={{ flexDirection: 'row' }}>
                  {posts.topic_id.name ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40'] ]}>{posts.topic_id.name}</Text> : null}
                  {posts.view_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40'] ]}>{posts.view_count}次浏览</Text> : null}
                  {posts.like_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40'] ]}>{posts.like_count}个赞</Text> : null}
                  {posts.follow_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40'] ]}>{posts.follow_count}人关注</Text> : null}
                  <Text style={[S['m-r-5'], S['f-s-12'], S['black-40'] ]}>{posts._create_at}</Text>
                </View>
              </View>
            </View>

            <View style={styles.posts}>
              <View style={styles.itemMain}>
                <View style={styles.titleView}><Text style={styles.titleText}>{posts.title}</Text></View>
                <HTMLView html={posts.content_html} imgOffset={30} />
              </View>
            </View>

            <View>
              <CommentList
                {...this.props}
                name={posts._id}
                filters={{ posts_id: posts._id, parent_exists: 0, per_page: 100 }}
                displayLike={true}
                displayReply={true}
                displayCreateAt={true}
                />
            </View>
          </View>
        </ScrollView>

        <BottomBar {...this.props} posts={posts} />

        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={options}
          cancelButtonIndex={0}
          destructiveButtonIndex={0}
          onPress={this.showSheet}
        />

        {this.state.visibleWait ? <Wait /> : null}

      </View>)
  }
}


const styles = StyleSheet.create({
  centerContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  posts: {
    padding:15
    // borderBottomWidth: 1,
    // borderColor: '#efefef'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  main: {
    flex: 2
  },
  topicItem: {
    backgroundColor: '#fff',
    padding:20,
    borderBottomWidth: 1,
    borderColor: '#efefef'
  },
  itemHead: {
    padding:15,
    flexDirection: 'row',
    borderBottomWidth: 1/PixelRatio.get(),
    borderColor: '#d4d4d4',
  },
  avatar: {
    width:35,
    height:35,
    borderRadius: 35/2,
    marginRight:10,
    marginTop: -1
  },
  itemMain: {
    // marginTop:10
  },
  bottomBar: {
    height: 50,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row'
  },
  comment: {
    width: 50,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  },
  like: {
    width: 50,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  },
  follow: {
    flex: 1,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  },

  titleView: {
    // borderBottomWidth: 1,
    // borderColor: '#efefef',
  },

  titleText: {
    fontSize:20,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});

export default connect((state, props) => {
    const id = props.navigation.state.params.id
    return {
      posts: getPostsById(state, id),
      me: getUserInfo(state)
    }
  },
  (dispatch) => ({
    loadPostsById: bindActionCreators(loadPostsById, dispatch),
    addViewById: bindActionCreators(addViewById, dispatch),
    block: bindActionCreators(block, dispatch),
    unblock: bindActionCreators(unblock, dispatch)
  })
)(PostsDetail);
