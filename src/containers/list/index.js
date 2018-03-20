

import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, AsyncStorage, TouchableOpacity } from 'react-native'

import CommentList from '../../components/comment-list'
import PostsList from '../../components/posts-list'
import TopicList from '../../components/topic-list'
import FollowPeopleList from '../../components/follow-people-list'
import FollowPosts from '../../components/follow-posts'
import BlockList from '../../components/block-list'

class List extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.title
  })

  constructor (props) {
    super(props)
  }

  render() {

    const { navigation } = this.props
    const { id, filters, componentName, canClick = true, hideUserInfo = false } = this.props.navigation.state.params

    let component = null

    switch(componentName) {
      case 'PostsList':
        component = <PostsList {...this.props} name={id} filters={filters} hideUserInfo={hideUserInfo} />
        break
      case 'CommentList':
        component = <CommentList {...this.props} name={id} filters={filters} canClick={canClick} onlyDisplayComment={true} />
        break
      case 'TopicList':
        component = <TopicList {...this.props} name={id} filters={filters} />
        break
      case 'FollowPeopleList':
        component = <FollowPeopleList {...this.props} name={id} filters={filters} />
        break
      case 'FollowPosts':
        component = <FollowPosts {...this.props} name={id} filters={filters} />
        break
      case 'BlockList':
        component = <BlockList {...this.props} name={id} filters={filters} />
        break
    }

    return (<View style={styles.container}>{component}</View>)
  }
}


var styles = StyleSheet.create({
  container: {
    flex:1
  }
})

export default List
