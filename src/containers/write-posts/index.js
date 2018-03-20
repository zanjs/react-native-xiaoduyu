import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Button, TextInput, Alert, TouchableOpacity } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { addPosts, updatePostsById } from '../../actions/posts'

import Editor from '../../components/editor'
import Wait from '../../components/ui/wait'

class WritePosts extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    const { topic, submit, allowPost = false } = params
    return {
      title: topic.name,
      headerLeft: <TouchableOpacity style={styles.button} onPress={()=>{ navigation.goBack() }}>
                    <Text style={styles.buttonText}>取消</Text>
                   </TouchableOpacity>,
      headerRight: <TouchableOpacity style={styles.button} onPress={allowPost ? ()=>submit() : ()=>{}}>
                    <Text style={allowPost ? styles.buttonText : styles.inactiveButtonText}>发布</Text>
                   </TouchableOpacity>
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      contentJSON: '',
      contentHTML: ''
    }
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      submit: this.submit
    })
  }

  submit() {

    const self = this
    const { addPosts, updatePostsById, navigation } = this.props
    const { navigate } = navigation
    const { topic, posts, goBackKey, goBack } = navigation.state.params
    const { title, contentJSON, contentHTML } = this.state

    if (!title) return Alert.alert('', '请输入标题')

    self.setState({ visible: true })

    if (posts) {
      // 更新
      updatePostsById({
        id: posts._id,
        title: title,
        content: contentJSON,
        contentHTML: contentHTML,
        topicId: topic._id,
        // device: 1,
        type: 1,
        callback: (res)=>{
          self.setState({ visible: false })
          if (res && res.success) {
            navigation.goBack()
          } else {
            setTimeout(()=>{
              Alert.alert('', res && res.error ? res.error : '更新失败')
            }, 2000)
          }
        }
      })
    } else {
      // 添加
      addPosts({
        title: title,
        detail: contentJSON,
        detailHTML: contentHTML,
        topicId: topic._id,
        device: 1,
        type: 1,
        callback: (res)=>{
          self.setState({ visible: false })
          if (res && res.success) {
            let posts = res.data

            if (goBackKey == 'Home') {
              // console.log('123');
              self.props.navigation.dispatch(NavigationActions.reset({
                index: 1,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'Main'
                  }),
                  NavigationActions.navigate({
                    routeName: 'PostsDetail',
                    params: { title: posts.title, id: posts._id }
                  })
                ]
              }))
              return
            }

            navigation.goBack(goBackKey)
            navigate('PostsDetail', { title: posts.title, id: posts._id })
          } else {
            setTimeout(()=>{
              Alert.alert('', res && res.error ? res.error : '发布失败')
            }, 2000)
          }
        }
      })
    }
  }

  render() {

    const self = this
    const { topic, posts } = this.props.navigation.state.params

    return (<View style={styles.container}>
      <View>
        <TextInput
          style={styles.title}
          onChangeText={(title) => {
            self.setState({title})
            self.props.navigation.setParams({
              allowPost: title ? true : false
            })
          }}
          placeholder='请输入标题'
          defaultValue={posts ? posts.title : ''}
          autoFocus={true}
          underlineColorAndroid='transparent'
          />
      </View>
      <View style={{ flex:1 }}>
        <Editor
          transportContent={(data)=>{
            self.state.contentJSON = data.json
            self.state.contentHTML = data.html
          }}
          initialContentJSON={posts ? posts.content : null}
        />
      </View>
      {this.state.visible ? <Wait /> : null}
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  title: {
    justifyContent: 'center',
    borderColor: '#efefef',
    borderWidth: 1,
    padding: 15,
    fontSize:18,
    backgroundColor: '#fff'
  },
  button: {
    height: 45,
    paddingLeft:20,
    paddingRight:20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#08f'
  },
  inactiveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c9c9c9'
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    addPosts: bindActionCreators(addPosts, dispatch),
    updatePostsById: bindActionCreators(updatePostsById, dispatch)
  })
)(WritePosts)
