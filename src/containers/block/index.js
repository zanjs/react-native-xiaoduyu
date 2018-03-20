import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity, AsyncStorage } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getUserInfo } from '../../reducers/user'

import { ListItem } from '../../components/ui'

class Block extends React.Component {

  static navigationOptions = {
    title: '屏蔽设置'
  }

  constructor (props) {
    super(props)
  }

  render() {

    const { me } = this.props
    const { navigate } = this.props.navigation

    return (<ScrollView>
          <View>

            <TouchableOpacity
              onPress={()=>{
                navigate('List', {
                  componentName: 'BlockList',
                  id: 'people',
                  filters: { people_exsits:1 },
                  title: '屏蔽的用户'
                })
              }}>
              <ListItem name={"屏蔽的用户"} rightText={me.block_people_count || ''} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={()=>{
                navigate('List', {
                  componentName: 'BlockList',
                  id: 'posts',
                  filters: { posts_exsits:1 },
                  title: '屏蔽的帖子'
                })
              }}>
              <ListItem name={"屏蔽的帖子"} rightText={me.block_posts_count || ''} />
            </TouchableOpacity>

          </View>
      </ScrollView>)
  }
}

const styles = StyleSheet.create({
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
  })
)(Block)
