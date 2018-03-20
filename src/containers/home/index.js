import React, { Component } from 'react'
import { View, Text, ScrollView, Image, StyleSheet, Alert, TouchableOpacity, AsyncStorage } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Platform from 'Platform'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'
import { cleanAllComment } from '../../actions/comment'
import { loadPostsList, showNewPosts } from '../../actions/posts'
import { getPostListByName } from '../../reducers/posts'

import PostsList from '../../components/posts-list'
import TabBar from '../../components/tab-bar'

import WriteIcon from '../../components/ui/icon/write'


class Home extends Component {

  static navigationOptions = {
    header: null,
    title: '首页',
    tabBarIcon: ({ tintColor }) => (<Image
      source={require('./images/home.png')}
      style={[styles.icon, {tintColor: tintColor}]}
    />)
  }

  constructor (props) {
    super(props)
    this.state = {
      listener: null,
      tab: 0,
      ready: false,
      redPointTab: []
    }
  }

  componentWillMount() {

    const self = this
    const { me, loadPostsList } = this.props
    const { redPointTab } = this.state

    const initTab = ()=>{

      AsyncStorage.getItem('tab', (errs, result)=>{
        self.setState({ tab: result || 0, ready: true })

        if (result == 1) return

        loadPostsList({
          name: 'find_one_recent_posts',
          filters: { weaken: 1, method: 'user_custom', device: 'ios', per_page:1 },
          callback: (res) => {
            if (res && res.success && res.data && res.data[0]) {
              if (new Date(res.data[0].sort_by_date).getTime() > new Date(me.last_find_posts_at || 0).getTime()) {
                if (redPointTab.indexOf(1) == -1) {
                  redPointTab.push(1)
                }
              }
            }
          }
        })

      })

    }

    if (Platform.OS === 'android') {
      setTimeout(initTab, 1000)
    } else {
      initTab()
    }

  }

  componentDidMount() {

    const { me, cleanAllComment } = this.props
    const { navigate } = this.props.navigation

    this.state.listener = (result) => {

      if (Platform.OS === 'android') {
        result = JSON.parse(result.extras)
      }

      if (result.routeName && result.params) {
        cleanAllComment()

       

        navigate(result.routeName, result.params)
      }
    }

  



    if (me.phone) return

    // 提示绑定手机
    AsyncStorage.getItem('binding-phone-tips', (errs, result)=>{
      result = null
      if (result && new Date().getTime() > parseInt(result)) {

        Alert.alert('绑定手机号', '亲爱的用户，应2017年10月1日起实施的《中华人民共和国网络安全法》要求，网站须强化用户实名认证机制。您需要验证手机方可使用社区功能，烦请您将账号与手机进行绑定。', [
          {
            text: '暂不',
            onPress: () => {
              AsyncStorage.setItem('binding-phone-tips', (new Date().getTime() + 1000 * 60 * 60 * 24 * 3) + '', ()=>{})
            }
          },
            {
              text: '去绑定',
              onPress: () => navigate('BindingPhone')
            }
          ]
        )
      } else if (!result) {
        AsyncStorage.setItem('binding-phone-tips', (new Date().getTime() + 1000 * 60 * 60 * 24 * 3) + '', ()=>{})
      }

    })

  }

  componentWillUnmount() {
    if (this.state.listener) {
      // 移除监听事件
      this.state.listener = null
    }
  }

  render() {

    const self = this
    const { navigation, newPostsList, showNewPosts } = this.props
    const { tab, ready, redPointTab } = this.state

    if (!ready) return (<View></View>)

    const rightContent = (<View style={styles.tabbatRight}><TouchableOpacity
                            style={styles.write}
                            onPress={()=>{ navigation.navigate('ChooseTopic') }}
                            activeOpacity={0.8}>
                            <WriteIcon />
                          </TouchableOpacity></View>)

    return (<ScrollableTabView
      renderTabBar={() => <TabBar
        onScroll={(e)=>{ self.updateAnimation = e }}
        rightContent={rightContent}
        redPointTab={newPostsList.data && newPostsList.data.length ? redPointTab.concat([0]) : redPointTab}
        initialPage={parseInt(tab)}
      />}
      onScroll={(e)=>self.updateAnimation(e)}
      onChangeTab={tab=>{
        AsyncStorage.setItem('tab', tab.i + '')

        //  && redPointTab.indexOf(0) != -1
        if (tab.i == 0 && redPointTab.indexOf(0) != -1) {
          showNewPosts()
          // console.log(self.discoverScrollView);
          self.discoverScrollView.scrollTo({ x: 0, y: 0, animated: true })
          self.onRefresh()
        } else if (tab.i == 1) {
          let index = redPointTab.indexOf(1)
          if (index != -1) {
            redPointTab.splice(index)
            self.setState({ redPointTab })
          }
        }

      }}
      initialPage={parseInt(tab)}
      >

      <PostsList {...this.props} navigation={navigation}
        tabLabel='发现'
        name="discover"
        getRef={(obj)=>{
          self.discoverScrollView = obj
          // console.log(obj);
        }}
        onRefresh={(onRefresh)=>{
          self.onRefresh = onRefresh
        }}
        filters={{ weaken: 1 }} />

      <PostsList {...this.props} navigation={navigation}
        tabLabel='关注'
        name="follow"
        filters={{ weaken: 1, method: 'user_custom', device: 'ios' }} />

    </ScrollableTabView>)
  }
}

const styles = StyleSheet.create({
  icon: { width: 26, height: 26, marginTop:-5 },
  tabbatRight: { flex:1, flexDirection:'row-reverse' },
  write: { width: 50, justifyContent: 'center', alignItems: 'center' }
})

export default connect(state => ({
    me: getUserInfo(state),
    newPostsList: getPostListByName(state, 'new')
  }),
  (dispatch) => ({
    cleanAllComment: bindActionCreators(cleanAllComment, dispatch),
    loadPostsList: bindActionCreators(loadPostsList, dispatch),
    showNewPosts: bindActionCreators(showNewPosts, dispatch)
  })
)(Home)
