
import PostsList from '../../components/posts-list'
import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, Button, AsyncStorage, TouchableOpacity } from 'react-native'
import WriteIcon from '../../components/ui/icon/write'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class TopicDetail extends Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    return {
      title: params.title
      // headerRight: (<TouchableOpacity onPress={()=>params.createPosts()}><WriteIcon /></TouchableOpacity>)
    }

  }

  constructor (props) {
    super(props)
    this.state = {
      content: ''
    }

    this.createPosts = this.createPosts.bind(this)
  }

  createPosts() {

    const { navigate } = this.props.navigation
    const { topic } = this.props.navigation.state.params
    navigate('WritePosts', { topic })
  }

  render() {

    const { topic } = this.props.navigation.state.params

    const { navigation } = this.props

    return (<View style={styles.container}>
          <PostsList
            navigation={navigation}
            filters={{
              topic_id: topic._id
            }}
            name={topic._id}
            renderHeader={()=>{
              return (<TouchableOpacity style={styles.write} onPress={this.createPosts}>
                <Text style={styles.writeButton}>创建新主题</Text>
              </TouchableOpacity>)
            }}
            />
          </View>)
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  write: {
    marginTop:10,
    flex:1,
    height: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  writeButton: {
    fontSize: 16
  }
})

export default connect(state => ({
    state
  }),
  (dispatch) => ({
  })
)(TopicDetail);
