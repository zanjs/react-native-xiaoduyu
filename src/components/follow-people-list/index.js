
import React, { Component } from 'react';
import { StyleSheet, Text, View, ListView, Image, refreshControl, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadFollowPosts } from '../../actions/follow'
import { follow, unfollow } from '../../actions/follow'
import { getPeopleListByName } from '../../reducers/follow-people'

import Loading from '../ui/loading'
import Nothing from '../nothing'
import ListFooter from '../ui/list-footer'
// import RefreshControl from '../ui/refresh-control'
import ListViewOnScroll from '../../common/list-view-onscroll'
import PeopleItem from '../people-item'

class FollowPeopleList extends Component {

  constructor (props) {
    super(props)
    this.state = { isRefreshing: false }
    this.toPeople = this.toPeople.bind(this)
    this.loadList = this.loadList.bind(this)
    this.handleFollow = this.handleFollow.bind(this)
  }

  componentWillMount() {
    const { list } = this.props
    if (!list.data) this.loadList()
  }

  toPeople(people){
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: people.nickname, id: people._id })
  }

  loadList(callback, restart) {
    const { name, filters } = this.props
    this.props.loadList({ name, filters, callback, restart })
  }

  handleFollow(people) {
    const { follow, unfollow } = this.props
    people.follow ?
      unfollow({ data: { people_id: people._id } }) :
      follow({ data: { people_id: people._id } })
  }

  _onRefresh() {
    const self = this
    this.setState({ isRefreshing: true })

    self.loadList(()=>{
      self.setState({ isRefreshing: false })
    }, true)

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
        }, 1000)
      })
    }

  }

  render() {

    const self = this
    const { list } = this.props

    if (list.loading && list.data.length == 0 || !list.data) {
      return (<Loading />)
    }

    if (!list.loading && !list.more && list.data.length == 0) {
      return (<Nothing content="没有数据" />)
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let data = ds.cloneWithRows(list.data || [])

    return (
        <ListView
          enableEmptySections={true}
          dataSource={data}
          renderRow={(item) => (<PeopleItem {...self.props} people={list.filters.user_id ? item.people_id : item.user_id} />)}
          renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
          removeClippedSubviews={false}
          // refreshControl={<RefreshControl onRefresh={callback=>self.loadList(callback, true)} />}
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
          onScroll={this.onScroll.bind(this)}
          // onScroll={ListViewOnScroll(self.loadList)}
          scrollEventThrottle={50}
        />
    )
  }

}

const styles = StyleSheet.create({
  item: {
    padding:10,
    backgroundColor:'#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row'
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
  },
  loading: {
    height: 60
  },
  other: {
    flexDirection: 'row'
  },
  itemCenter:{
    flex: 1
  }
})


export default connect((state, props) => ({
    list: getPeopleListByName(state, props.name)
  }),
  (dispatch) => ({
    loadList: bindActionCreators(loadFollowPosts, dispatch),
    follow: bindActionCreators(follow, dispatch),
    unfollow: bindActionCreators(unfollow, dispatch)
  })
)(FollowPeopleList)
