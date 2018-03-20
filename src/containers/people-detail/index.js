import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput, navigator, Dimensions, Alert } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadPeopleById } from '../../actions/people'
import { block, unblock } from '../../actions/block'
import { getPeopleById } from '../../reducers/people'
import { getUserInfo } from '../../reducers/user'

import { ListItem } from '../../components/ui'
import FollowButton from '../../components/follow-button'
import Loading from '../../components/ui/loading'

import MenuIcon from '../../components/ui/icon/menu'

import Lightbox from 'react-native-lightbox'
import Carousel from 'react-native-looped-carousel-2'

import Wait from '../../components/ui/wait'

const S = global.styles

const WINDOW_WIDTH = Dimensions.get('window').width;
const BASE_PADDING = 10;

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

class PeopleDetail extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

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
      visibleWait: false
    }
    this.menu = this.menu.bind(this)
    this.showSheet = this.showSheet.bind(this)
  }

  menu(key) {
    this.ActionSheet.show()
  }

  showSheet(key) {

    const self = this
    const { navigate } = this.props.navigation;
    const [ people ] = this.props.people
    const { block, unblock, me } = this.props

    if (!key) return
    if (key == 2) return navigate('Report', { people })
    if (key == 1) {

      self.setState({ visibleWait: true })

      if (me.block_people.indexOf(people._id) == -1) {

        block({
          data: { people_id: people._id },
          callback: (res)=>{

            self.setState({ visibleWait: false }, ()=>{
              setTimeout(()=>{
                if (res && res.success) {
                  Alert.alert('', '屏蔽成功')
                } else {
                  Alert.alert('', res.error || '提交失败')
                }
              }, 1000)
            })

          }
        })

      } else {

        unblock({
          data: { people_id: people._id },
          callback: (res)=>{

            self.setState({ visibleWait: false }, ()=>{
              setTimeout(()=>{
                if (res && res.success) {
                  Alert.alert('', '取消屏蔽成功')
                } else {
                  Alert.alert('', res.error || '提交失败')
                }
              }, 1000)
            })

            /*
            if (res && res.success) {
              Alert.alert('', '取消屏蔽成功')
            } else {
              Alert.alert('', res.error || '提交失败')
            }
            */
          }
        })

      }

    }
  }

  componentWillMount() {

    const self = this
    const { id } = this.props.navigation.state.params
    const { loadPeopleById, me } = this.props
    const [ people ] = this.props.people

    if (!people) {
      loadPeopleById({
        id,
        callback:(res) => {
          if (me && res && me._id != res._id) {
            self.props.navigation.setParams({
              menu: self.menu
            })
          }
        }
      })
      return
    }

    if (me && me._id != people._id) {
      self.props.navigation.setParams({
        menu: this.menu
      })
    }

  }

  render() {

    const [ people ] = this.props.people
    const { navigate } = this.props.navigation
    const { me } = this.props

    if (!people) return (<Loading />)

    let renderCarousel = null

    if (people.avatar_url) {

      renderCarousel = () => {
        return (<Carousel style={{ width: WINDOW_WIDTH, height: WINDOW_WIDTH }}>
          <Image
            style={{ flex: 1 }}
            resizeMode="contain"
            source={{ uri: 'https:'+people.avatar_url.split('&')[0] }}
          />
        </Carousel>)
      }

    }

    return (<ScrollView>

      <View style={[styles.head, S['m-b-10'], S['m-t-10']]}>
        <View>
          {people.avatar_url ?
            <Lightbox springConfig={{tension: 15, friction: 7}} swipeToDismiss={false} renderContent={renderCarousel}>
              <Image source={{uri:'https:'+people.avatar_url}} style={styles.avatar} />
            </Lightbox> : null}
        </View>
        <View style={[S['f-d-r'], {flex:1,justifyContent:'space-between'}]}>
          <View>
            {people.nickname ? <Text style={styles.nickname}>{people.nickname}</Text> : null}
            <View style={styles.other}>
              {people.fans_count ? <Text style={styles.fans}>{people.fans_count} 粉丝</Text> : null}
              {people.follow_people_count ? <Text>{people.follow_people_count} 关注</Text> : null}
            </View>
            <View>
              {people.brief ? <Text>{people.brief}</Text> : null}
            </View>
          </View>
          <View>
            <FollowButton people_id={people._id} follow={people.follow} />
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'PostsList', id: people._id, filters: { user_id: people._id, sort_by: 'create_at', sort: -1 }, title: people.nickname + '的帖子', hideUserInfo: true }) }}>
        <ListItem name={"他发布的帖子"} rightText={people.posts_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'CommentList', id: people._id, filters: { user_id: people._id, sort: -1, include_reply: -1, parent_exists:-1 }, canClick:false, title: people.nickname + '的评论' }) }}>
        <ListItem name={"他的评论"} rightText={people.comment_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'TopicList', id: people._id, filters: { people_id: people._id, child:1 }, title: people.nickname + '关注的话题' }) }}>
        <ListItem name={"他的关注的话题"} rightText={people.follow_topic_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'FollowPosts', id: people._id + '-posts', filters: { user_id: people._id, posts_exsits: 1 }, title: people.nickname + '关注的帖子' }) }}>
        <ListItem name={"他关注的帖子"} rightText={people.follow_posts_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'FollowPeopleList', id: people._id + '-follow', filters: { user_id: people._id, people_exsits: 1 }, title: people.nickname + '关注的人' }) }}>
        <ListItem name={"他关注的人"} rightText={people.follow_people_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'FollowPeopleList', id: people._id + '-fans', filters: { people_id: people._id, people_exsits: 1 }, title: people.nickname + '的粉丝' }) }}>
        <ListItem name={"他的粉丝"} rightText={people.fans_count} />
      </TouchableOpacity>

      <ActionSheet
        ref={o => this.ActionSheet = o}
        options={[ '取消', me.block_people.indexOf(people._id) == -1 ? '屏蔽' : '取消屏蔽', '举报' ]}
        cancelButtonIndex={0}
        destructiveButtonIndex={0}
        onPress={this.showSheet}
      />

      {this.state.visibleWait ? <Wait /> : null}

    </ScrollView>)
  }
}


const styles = StyleSheet.create({
  head: {
    padding:20,
    // marginBottom:10,
    backgroundColor: '#fff',
    flexDirection: 'row'
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20
  },
  brief: {
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  other: {
    flexDirection: 'row',
    marginBottom: 10
  },
  nickname: {
    fontWeight: 'bold',
    marginBottom: 10
  },
  fans: {
    marginRight: 10
  }
})

export default connect((state, props) => ({
    me: getUserInfo(state),
    people: getPeopleById(state, props.navigation.state.params.id)
  }),
  (dispatch) => ({
    unblock: bindActionCreators(unblock, dispatch),
    block: bindActionCreators(block, dispatch),
    loadPeopleById: bindActionCreators(loadPeopleById, dispatch)
  })
)(PeopleDetail);
