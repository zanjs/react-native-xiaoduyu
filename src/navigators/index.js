import Platform from 'Platform'
import { PixelRatio } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Welcome from '../containers/welcome'
import FastSignIn from '../containers/fast-sign-in'
import SignIn from '../containers/sign-in'
import SignUp from '../containers/sign-up'
import OtherSignIn from '../containers/other-sign-in'
import Forgot from '../containers/forgot'
import Home from '../containers/home'
import MineFollow from '../containers/mine-follow'
import PostsDetail from '../containers/posts-detail'
import Topics from '../containers/topics'
import Notifications from '../containers/notifications'
import Me from '../containers/me'
import CommentDetail from '../containers/comment-detail'
import WriteComment from '../containers/write-comment'
import WritePosts from '../containers/write-posts'
import ChooseTopic from '../containers/choose-topic'
import Settings from '../containers/settings'
import TopicDetail from '../containers/topic-detail'
import PeopleDetail from '../containers/people-detail'
import List from '../containers/list'
import SocialAccount from '../containers/social-account'
import Agreement from '../containers/agreement'

// setting
import ResetNickname from '../containers/reset-nickname'
import ResetBiref from '../containers/reset-brief'
import ResetGender from '../containers/reset-gender'
import ResetPassword from '../containers/reset-password'
import ResetEmail from '../containers/reset-email'
import ResetAvatar from '../containers/reset-avatar'
import ResetPhone from '../containers/reset-phone'
import BindingPhone from '../containers/binding-phone'

import Report from '../containers/report'
import Block from '../containers/block'

// test
// import Test from '../containers/test'
// import Editor from '../containers/editor'

let tabBarOptions = {
  style: {
    ...ifIphoneX({
        height: 75,
        backgroundColor:'#fff',
        paddingBottom: 25,
        // borderTopWidth:1
        // borderColor: 'red'
    }, {
        // height: 65,
        backgroundColor:'#fff',
        // borderWidth:0,
        // borderColor: 'red'
    })
  },

  // tabStyle:{
  //   borderTopWidth:1,
  //   borderColor: '#e3e3e3'
  // },

  // activeBackgroundColor:'#fff',
  activeTintColor:'#08f',
  // inactiveBackgroundColor:'#fff',
  inactiveTintColor:'#757575',
  // allowFontScaling: false,

  // indicatorStyle:{ top:0 },

  // activeTabStyle: {
  //   backgroundColor: 'red'
  // },

  // 文本
  // labelStyle: {
    // color: 'rgb(115, 115, 115)'
    // fontSize: 10
    // marginBottom:15,
    // fontWeight: "bold"
  // },
  // indicatorStyle: {
  //   borderBottomWidth:10,
  //   borderColor: 'red',
  //   top:0
  // },
  // showIcon: true
  // showLabel: false
}

if (Platform.OS === 'android') {

  tabBarOptions = {
    style: {
      height: 50,
      backgroundColor:'#fff'
    },
    tabStyle:{
      borderWidth: 0,
    },
    activeTintColor:'#08f',
    inactiveTintColor:'#757575',

    showIcon: true,
    showLabel: true,
    iconStyle: { width:28, height:28 },
    labelStyle:{ fontSize: 9, marginTop:0 },
    indicatorStyle: { backgroundColor: '#fff' }
  }

}

const MainScreenNavigator = TabNavigator({
  Home: { screen: Home },
  // ChooseTopic: { screen: ChooseTopic },
  Topics: { screen: Topics },
  Notifications: { screen: Notifications },
  Me: { screen: Me }
},
{
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  swipeEnabled:false,
  animationEnabled:false,
  lazy: true,
  tabBarOptions: tabBarOptions
})

const App = StackNavigator({
  Main: { screen: MainScreenNavigator },
  PostsDetail: { screen: PostsDetail },
  WriteComment: { screen: WriteComment },
  WritePosts: { screen: WritePosts },
  ChooseTopic: { screen: ChooseTopic },
  CommentDetail: { screen: CommentDetail },
  Welcome: { screen: Welcome },
  SignIn: { screen: SignIn },
  Settings: { screen: Settings },
  SignUp: { screen: SignUp },
  Forgot: { screen: Forgot },
  OtherSignIn: { screen: OtherSignIn },
  TopicDetail: { screen: TopicDetail },
  PeopleDetail: { screen: PeopleDetail },
  List: { screen: List },
  ResetNickname: { screen: ResetNickname },
  ResetBiref: { screen: ResetBiref },
  ResetGender: { screen: ResetGender },
  ResetPassword: { screen: ResetPassword },
  ResetEmail: { screen: ResetEmail },
  ResetAvatar: { screen: ResetAvatar },
  SocialAccount: { screen: SocialAccount },
  FastSignIn: { screen: FastSignIn },
  ResetPhone: { screen: ResetPhone },
  BindingPhone: { screen: BindingPhone },
  Agreement: { screen: Agreement },
  Report: { screen: Report },
  Block: { screen: Block }
  // Test: { screen: Test }
},{
  initialRouteName: 'Welcome',
  // cardStyle: {},
  navigationOptions: {
    headerTruncatedBackTitle: '返回',
    headerBackTitle: null,
    headerStyle: {
      backgroundColor: '#fff',
      ...ifIphoneX({
        paddingTop:30,
        height: 75
        // borderBottomWidth:1
        // borderColor: '#e3e3e3'
      }, {
        height: Platform.OS === 'android' ? 50 : 65
      })
    },
    headerTintColor: '#23232b',
    headerTitleStyle: {
      fontSize: 17,
      color:'#23232b'
    },
    headerBackTitleStyle: {
      backgroundColor: '#333'
    },
    headerBackTitleStyle: {
      fontSize:17
    }
  },
  headerMode: 'screen'
})

/*
const defaultGetStateForAction = App.router.getStateForAction;

App.router.getStateForAction = (action, state) => {


  console.log('进入了-------------------');
  console.log(action.routeName);

  if (action && action.routeName) {

    console.log(action);


    if (global.visitedRouter.indexOf(action.routeName) == -1) {
      global.visitedRouter.push(action.routeName)
    }

    console.log(global.visitedRouter);

  }




  // console.log(state);

  if (!global.signIn) {

    // console.log(action.routeName);

    if (action.routeName == 'WriteComment' ||
      action.routeName == 'Notifications' ||
      action.routeName == 'Me'
      ) {

      const routeName = state ? state.routes[0].routeName : action.routeName

      // console.log(routeName);
      // , params: { backRouteName: routeName  }
      const routes = [
        ...state.routes,
        { key: 'SignIn', routeName: 'SignIn' }
      ]

      return {
        ...state,
        routes,
        index: routes.length - 1
      }
    }

  }



  return defaultGetStateForAction(action, state);
};
*/

export default App
