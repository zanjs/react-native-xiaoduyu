import React, { Component } from 'react'
import { StyleSheet, Image, View, Text } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUnreadNotice } from '../../reducers/user'
import { loadNewNotifications } from '../../actions/notification'

import NotificationList from '../../components/notification-list'

class Notifications extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    /*

*/
    // params.unreadNotice = 3

    return {
      // header: null,
      title: '通知',
      tabBarLabel: '通知',

      // tabBarLabel: (props) => {
      //   return (<View style={stylesIcon.tabBarLabel}>
      //     <View style={stylesIcon.tabBarLabelView}><Text>通知</Text></View>
      //     <View style={[stylesIcon.tabBarLabelLine, props.focused ? stylesIcon.focused : null ]}></View>
      //     </View>)
      // },

      // tabBarVisible: false,
      tabBarIcon: ({ tintColor }) => (
        <View >
          <View style={styles.tabBarIcon}><Image source={require('./images/notification.png')} style={[styles.icon, {tintColor: tintColor}]} /></View>
          {params.unreadNotice && params.unreadNotice.length > 0 ?
            <View style={styles.subscript}><Text style={styles.subscriptText}>{params.unreadNotice.length > 99 ? 99 : params.unreadNotice.length}</Text></View>
            : null}
      </View>),
      // tabBarOnPress: (scene, jumpToIndex)=>{

      //   const { params = {} } = navigation.state
        
      //   if (params.loadNewNotifications) {
      //     params.loadNewNotifications({ name:'notification', filters: {} })
      //   }

      //   jumpToIndex(scene.index)
      // }
    }

  }

  constructor (props) {
    super(props)
  }

  componentWillMount() {

    // const self = this
    // const { unreadNotice, loadNewNotifications } = this.props
    //
    // this.props.navigation.setParams({
    //   unreadNotice,
    //   loadNewNotifications
    // })
  }

  componentWillReceiveProps(props) {

    if (this.props.unreadNotice != props.unreadNotice) {
      const self = this
      const { unreadNotice, loadNewNotifications } = props
      this.props.navigation.setParams({
        unreadNotice,
        loadNewNotifications
      })
    }
  }

  render() {
    return (<NotificationList {...this.props} name="notification" />)
  }
}

const styles = StyleSheet.create({
  icon: { width: 26, height: 26, marginTop:-5 },
  subscript: {
    position:'absolute',
    zIndex:99,
    marginLeft:3,
    marginTop:-17,
    backgroundColor: 'red',
    borderRadius: 15,
    paddingLeft:5,
    paddingRight:5,
    // minWidth:15,
    height:15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subscriptText: {
    color: '#fff',
    fontSize:11
  },
  tabBarIcon:{
    flex:1,
    alignItems:'center',
    justifyContent: 'center'
  }
})

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
    unreadNotice: getUnreadNotice(state)
  }),
  (dispatch) => ({
    loadNewNotifications: bindActionCreators(loadNewNotifications, dispatch)
  })
)(Notifications)
