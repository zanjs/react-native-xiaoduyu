
import React, { Component } from 'react';
import { Text, View, ListView, Image, ScrollView, TouchableOpacity } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import styles from './style'
import CommentItem from '../../components/comment-item'

class PostsItem extends Component {

  constructor (props) {
    super(props)

    this.state = {
    }
    this.goTo = this.goTo.bind(this)
    this.goToComment = this.goToComment.bind(this)
    this.toPeople = this.toPeople.bind(this)
  }

  toPeople(people) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: people.nickname, id: people._id })
  }

  goTo(posts) {
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
  }

  goToComment(comment) {
    const { navigate } = this.props.navigation;
    navigate('CommentDetail', { title: comment.content_summary, id: comment._id })
  }

  renderHeader() {
    // return (<View><Text>发表</Text></View>)
  }

  render() {

    const self = this
    const { posts } = this.props

    return (<View style={styles.item}>

            <View style={styles.topicItem}>
              <TouchableOpacity onPress={()=>{this.goTo(posts)}}>
                <View>
                  {posts.user_id && typeof posts.user_id == 'object' ?
                    <View style={styles.itemHead}>
                      <View>
                        <TouchableOpacity onPress={()=>{this.toPeople(posts.user_id)}}>
                          <Image source={{uri:'https:'+posts.user_id.avatar_url}} style={styles.avatar}  />
                        </TouchableOpacity>
                      </View>
                      <View>
                        <Text onPress={()=>{this.toPeople(posts.user_id)}} style={styles.nickname}>{posts.user_id.nickname}</Text>
                        <View style={styles.itemHeadOther}>
                          {posts.topic_id ? <Text style={styles.itemHeadOtherItem}>{posts.topic_id.name}</Text> : null}
                          {posts.view_count ? <Text style={styles.itemHeadOtherItem}>{posts.view_count+'次浏览'}</Text> : null}
                          {posts.like_count ? <Text style={styles.itemHeadOtherItem}>{posts.like_count+'个赞'}</Text> : null}
                          {posts.follow_count ? <Text style={styles.itemHeadOtherItem}>{posts.follow_count+'人关注'}</Text> : null}
                        </View>
                      </View>
                    </View>
                    : null}
                  <View style={styles.itemMain}>
                    <Text style={styles.title}>{posts.title}</Text>
                    {posts.content_summary ? <Text style={styles.contentText}>{posts.content_summary}</Text> : null}
                    {/*posts.images ?
                      <View style={styles.flexContainer}>
                        {posts.images.map(img=>{
                          let _img = 'https:' + img.split('?')[0] + '?imageMogr2/auto-orient/thumbnail/!200/format/jpg'
                          return (<Image key={img} source={{uri:_img}} style={styles.images} />)
                        })}
                      </View>
                      : null*/}
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {posts.comment && posts.comment.map(item=>{
                return (<View key={item._id}>
                  <TouchableOpacity onPress={()=>{this.goToComment(item)}}>
                    <CommentItem {...this.props} comment={item} displayEdit={false} canClick={false} />
                  </TouchableOpacity>
                </View>)
              })}

            {posts.comment && posts.comment_count > posts.comment.length ?
              <TouchableOpacity onPress={()=>{this.goTo(posts)}} style={styles.more}><Text>还有{posts.comment_count - posts.comment.length}条评论，查看全部</Text></TouchableOpacity>
              : null}

          </View>)
  }

}

export default connect((state, props) => ({
  }),
  (dispatch) => ({
  })
)(PostsItem)
