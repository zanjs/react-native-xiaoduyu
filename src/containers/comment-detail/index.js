

import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, Button, TouchableOpacity } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById } from '../../actions/comment'
import { getCommentById } from '../../reducers/comment'
import { getUserInfo } from '../../reducers/user'

import HTMLView from '../../components/html-view'
import CommentList from '../../components/comment-list'
import BottomBar from '../../components/bottom-bar'
import MenuIcon from '../../components/ui/icon/menu'

import Loading from '../../components/ui/loading'
import Nothing from '../../components/nothing'

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

import { NavigationActions } from 'react-navigation'


class CommentDetail extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

    // console.log(navigation);

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
    this.toPeople = this.toPeople.bind(this)
    this.showSheet = this.showSheet.bind(this)
    this.menu = this.menu.bind(this)
  }

  componentDidMount() {

    const self = this
    const id = this.props.navigation.state.params.id
    const { loadCommentById, comment, me } = this.props
    let { data } = comment

    // let { state } = self.props.navigation

    // console.log(state);

    // state.params.menu = self.menu

    // const setParamsAction = NavigationActions.setParams(state)

    if (!data || !data.length) {
      loadCommentById({
        id,
        callback: (res)=>{

          if (!res) return self.state({ nothing: true })

          self.props.navigation.setParams({
            menu: self.menu
          })

          // setTimeout(()=>{
          //   self.props.navigation.dispatch(setParamsAction)
          // })
        }
      })
      return
    }

    // setTimeout(()=>{
    //   self.props.navigation.dispatch(setParamsAction)
    // })

    self.props.navigation.setParams({
      menu: self.menu
    })

  }

  menu(key) {
    this.ActionSheet.show()
  }

  showSheet(key) {

    if (!key) return

    const { me } = this.props
    const { navigate } = this.props.navigation
    const { data, loading } = this.props.comment

    let comment = data && data[0] ? data[0] : null

    if (me._id == comment.user_id._id && key == 1) {
      navigate('WriteComment', { comment })
    } else if (key == 1 || key == 2) {
      navigate('Report', { comment })
    }

  }

  toPeople(user) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: user.nickname, id: user._id })
  }

  render() {

    const { restart = false } = this.props.navigation.state.params

    let { data, loading } = this.props.comment
    const { nothing } = this.state
    const { me } = this.props

    let comment = data && data[0] ? data[0] : null

    if (nothing) return (<Nothing content="评论不存在或已删除" />)
    if (!data || loading) return <Loading />

    let options = ['取消']

    if (me._id == comment.user_id._id) options.push('编辑')
    options.push('举报')

    return (<View style={styles.container}>
      <ScrollView style={styles.main}>

        <View style={styles.itemHead}>
          <View>
            <TouchableOpacity onPress={()=>{this.toPeople(comment.user_id)}}>
              <Image source={{uri:'https:'+comment.user_id.avatar_url}} style={styles.avatar}  />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={()=>{this.toPeople(comment.user_id)}}>
              <Text>{comment.user_id.nickname}</Text>
            </TouchableOpacity>
            <View>
              <Text>{comment._create_at}</Text>
            </View>
          </View>
        </View>

        <View style={styles.comment}>
          <HTMLView html={comment.content_html} />
        </View>

        <View>
          <CommentList
            {...this.props}
            name={comment._id + '-reply'}
            filters={{ parent_id: comment._id, parent_exists: 1, per_page: 100 }}
            displayReply={true}
            displayLike={true}
            displayCreateAt={true}
            restart={restart}
            />
        </View>
      </ScrollView>
      <BottomBar {...this.props} comment={comment} />
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
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  main: {
    flex: 1
  },
  comment: {
    padding:15,
    borderBottomWidth: 1,
    borderColor: '#efefef'
  },
  itemHead: {
    padding:15,
    paddingBottom:0,
    flexDirection: 'row'
  },
  head: {
    flexDirection: 'row'
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
  }
})

export default connect(
  (state, props) => {
    const id = props.navigation.state.params.id
    return {
      comment: getCommentById(state, id),
      me: getUserInfo(state)
    }
  },
  (dispatch, props) => ({
    loadCommentById: bindActionCreators(loadCommentById, dispatch)
  })
)(CommentDetail);
