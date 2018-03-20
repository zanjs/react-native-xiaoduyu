import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Button, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadTopicList } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

class ChooseTopic extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      // header: null,
      title: '选择话题'
      // tabBarLabel: (props) => {
      //   return (<View style={stylesIcon.tabBarLabel}>
      //     <View style={stylesIcon.tabBarLabelView}><Text>话题</Text></View>
      //     <View style={[stylesIcon.tabBarLabelLine, props.focused ? stylesIcon.focused : null ]}></View>
      //     </View>)
      // }
    }
  }

  constructor (props) {
    super(props)
    this.cancel = this.cancel.bind(this)
    this.choose = this.choose.bind(this)
  }

  componentWillMount() {
    const { topicList, loadTopicList } = this.props
    if (topicList && topicList.data) {
    } else {
      loadTopicList({ name: 'all-topic', filters: { per_page: 500 } })
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      cancel: this.cancel
    })
  }

  cancel() {
    const { navigation } = this.props
    navigation.goBack()
  }

  choose(topic) {
    const { navigate } = this.props.navigation
    const { goBackKey } = this.props.navigation.state.params
    navigate('WritePosts', { topic, goBackKey })
  }

  render() {

    const { topicList } = this.props

    if (!topicList.data) {
      return (<View></View>)
    }

    let parentTopicList = []
    let childTopicList = {}

    if (topicList.data) {

      for (let i = 0, max = topicList.data.length; i < max; i++) {

        let topic = topicList.data[i]

        if (!topic.parent_id) {
          parentTopicList.push(topic)
        } else {
          if (!childTopicList[topic.parent_id]) {
            childTopicList[topic.parent_id] = []
          }
          childTopicList[topic.parent_id].push(topic)
        }
      }
    }

    return (<ScrollView style={styles.container}>
      <View style={styles.slogan}><Text style={[styles.sloganText, styles.black]}>选择一个话题与大家讨论吧</Text></View>
      {parentTopicList.map(item=>{
        return (<View key={item._id} style={styles.group}>
                  <View><Text style={[styles.title, styles.black]}>{item.name}</Text></View>
                  <View style={styles.itemContainer}>
                    {childTopicList[item._id] && childTopicList[item._id].map(item=>{
                      return (<TouchableOpacity
                        style={styles.item}
                        key={item._id}
                        onPress={()=>{this.choose(item)}}>
                          <Text style={styles.black}>{item.name}</Text>
                        </TouchableOpacity>)
                    })}
                  </View>
                </View>)
      })}
    </ScrollView>)
  }
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    backgroundColor:'#fff'
  },
  slogan: {
    paddingTop:10,
    paddingBottom:30
  },
  sloganText: {
    fontSize:22,
    fontWeight: 'bold'
  },
  group: {
    marginBottom:30
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item: {
    paddingTop: 10,
    paddingRight: 10
  },
  title: {
    color:'#rgb(120, 120, 120)'
  },
  black: {
    color: '#23232b'
  }
});

const stylesIcon = StyleSheet.create({
  icon: { width: 24, height: 24 },
  tabBarLabel: {
    marginTop:20,
    flex:1,
    width:'100%',
    // height:45,
    // flexDirection: 'row'
  },
  tabBarLabelView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarLabelLine: {
    height:3,
    backgroundColor:'#fff'
  },
  focused: {
    backgroundColor:'#08f'
  }
})

export default connect(state => ({
    topicList: getTopicListByName(state, 'all-topic')
  }),
  (dispatch) => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)(ChooseTopic);
