import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  WebView
} from 'react-native'
import {
  createNavigator,
  createNavigationContainer,
  TabRouter,
  addNavigationHelpers,
} from 'react-navigation';

// import Home from '../home'
// import Topics from '../topics'


class HistoryTabBar extends Component {
  constructor(props) {
      super(props)
      const { routes } = this.props.navigation.state
      const navigation = this.props.navigation
  }
  render () {
      return (
          <WebView source={{uri:'https://www.baidu.com'}} style={{width:3000, height:300}} />
      );
  }
}


export default HistoryTabBar
