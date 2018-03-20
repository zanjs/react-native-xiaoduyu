
import React, { Component } from 'react';
import { StyleSheet, Text, View, ListView, Image, TouchableOpacity, PixelRatio } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { loadTopicList, followTopic, unfollowTopic } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'
import FollowButton from '../../components/follow-button'

import Loading from '../ui/loading'
import Nothing from '../nothing'

import ListFooter from '../ui/list-footer'

class TopicList extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isRefreshing: false
    }
    this.goTo = this.goTo.bind(this)
    this.loadPostsList = this.loadPostsList.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.toTopic = this.toTopic.bind(this)
  }

  toTopic(topic) {
    const { navigate } = this.props.navigation

    navigate('TopicDetail', { title: topic.name, topic })
  }

  componentDidMount() {

    const self = this
    const { list } = this.props

    if (!list.data) {
      this.loadPostsList(()=>{})
    }

  }

  loadPostsList(callback, restart) {
    const { name, filters } = this.props
    this.props.loadTopicList({
      name:name,
      filters,
      callback,
      restart
    })
  }

  renderHeader() {
    return (
      <View style={styles.head}></View>
    )
  }

  renderFooter() {
    const { list } = this.props
    if (list.loading) {
      return (<View><Text>加载中</Text></View>)
    }
    return (<View><Text>没有更多了</Text></View>)
  }

  render() {

    const { list } = this.props

    if (list.loading && list.data.length == 0 || !list.data) {
      return (<Loading />)
    }

    if (!list.loading && !list.more && list.data.length == 0) {
      return (<Nothing content="没有话题" />)
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let topics = ds.cloneWithRows(list.data || [])

    return (
        <ListView
          enableEmptySections={true}
          dataSource={topics}
          renderRow={(topic) => (<TouchableOpacity onPress={()=>{this.toTopic(topic)}} activeOpacity={0.8}>
            <View style={styles.item}>
              <View style={styles.itemLeft}><Image source={{uri:'https:'+topic.avatar}} style={styles.avatar} /></View>
              <View style={styles.itemCenter}><Text style={styles.topicNameText}>{topic.name}</Text><Text style={styles.brief}>{topic.brief}</Text></View>
              <View style={styles.itemRight}>
                <FollowButton topic_id={topic._id} follow={topic.follow} />
              </View>
            </View>
          </TouchableOpacity>)}
          scrollEventThrottle={50}
          removeClippedSubviews={false}
          onScroll={this.onScroll.bind(this)}
          renderHeader={this.renderHeader}
          renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
        />
    )
  }

  goTo(posts){
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
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
        }, 1000)
      })
    }

  }

  _onRefresh() {
    const self = this
    this.setState({ isRefreshing: true })
    self.loadPostsList(()=>{
      self.setState({ isRefreshing: false })
    }, true)
  }

}

const styles = StyleSheet.create({
  head: {
    marginTop: 10
  },
  item: {
    backgroundColor: '#fff',
    padding:15,
    borderBottomWidth: 1/PixelRatio.get(),
    borderColor: '#d4d4d4',
    flexDirection: 'row'
  },
  itemLeft: {
    width:50
  },
  itemCenter: {
    flex:1
  },
  itemRight: {
    marginLeft:10
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
  },
  topicNameText: {
    fontWeight:'bold',
    color: '#23232b'
  },
  brief: {
    marginTop:3,
    color: '#6f6f6f',
    lineHeight: 20
  }
})

export default connect((state, props) => ({
    list: getTopicListByName(state, props.name)
  }),
  (dispatch) => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)(TopicList)
