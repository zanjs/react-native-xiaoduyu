
import React, { Component } from 'react';
import { StyleSheet, Text, View, ListView, Image, refreshControl, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadFollowPosts } from '../../actions/follow'
import { getPeopleListByName } from '../../reducers/follow-people'

import Loading from '../ui/loading'
import Nothing from '../nothing'

class FollowPosts extends Component {

  constructor (props) {
    super(props)

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      topics: ds.cloneWithRows([]),
      sourcePostsList: [],
      loadMore: false,
      more: true,
      isRefreshing: false,
      filters: {
        lt_date: new Date().getTime(),
        per_page: 20
      },
      list: {
        loading: false,
        more: true
      }
    }
    this.toPosts = this.toPosts.bind(this)
    this.loadList = this.loadList.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
  }

  componentWillMount() {
    const { list } = this.props
    if (!list.data) this.loadList()
  }

  toPosts(posts){
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
  }

  loadList(callback, restart) {
    const { name, filters } = this.props
    this.props.loadList({ name: name, filters, callback, restart })
  }

  renderHeader() {
    return (<View><Text></Text></View>)
  }

  renderFooter() {
    const { list } = this.props

    if (list.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator animating={true} color={'#484848'} size={'small'} />
        </View>
      )
    }
  }

  _onScroll(event) {
    const self = this
    if (this.state.loadMore) return
    let y = event.nativeEvent.contentOffset.y;
    let height = event.nativeEvent.layoutMeasurement.height;
    let contentHeight = event.nativeEvent.contentSize.height;
    // console.log('offsetY-->' + y);
    // console.log('height-->' + height);
    // console.log('contentHeight-->' + contentHeight);
    if (y+height>=contentHeight-20) {
      self.loadList()
    }
  }

  _onRefresh() {
    const self = this
    this.setState({ isRefreshing: true })
    self.loadList(()=>{
      self.setState({ isRefreshing: false })
    }, true)
  }

  render() {

    const self = this
    const { list } = this.props

    console.log(list);

    if (list.loading && list.data.length == 0 || !list.data) {
      return (<Loading />)
    }

    if (!list.loading && !list.more && list.data.length == 0) {
      return (<Nothing content="没有关注的帖子" />)
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    let data = ds.cloneWithRows(list.data || [])

    return (
        <ListView
          enableEmptySections={true}
          dataSource={data}
          renderRow={(item) => {
            if (item.posts_id) {
              return (<View><TouchableOpacity onPress={()=>{self.toPosts(item.posts_id)}} style={styles.item}>
                    <View><Text>{item.posts_id.title}</Text></View>
                  </TouchableOpacity></View>)
            } else {
              return (<View></View>)
            }
          }}
          renderHeader={this.renderHeader}
          renderFooter={this.renderFooter}
          removeClippedSubviews={false}
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
          onScroll={this._onScroll.bind(this)}
          scrollEventThrottle={50}
        />
    )
  }

}

const styles = StyleSheet.create({
  item: {
    padding:15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    backgroundColor: '#fff'
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
  },
  loading: {
    height: 60
  }
})


export default connect((state, props) => ({
    list: getPeopleListByName(state, props.name)
  }),
  (dispatch) => ({
    loadList: bindActionCreators(loadFollowPosts, dispatch)
  })
)(FollowPosts)
