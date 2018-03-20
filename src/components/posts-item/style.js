import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  item: {
    // marginTop: 10
  },
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },

  nothing: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  topicItem: {
    backgroundColor: '#fff',
    padding:15
    // borderBottomWidth: 1,
    // borderColor: '#efefef'
  },
  itemHead: {
    flexDirection: 'row',
    marginBottom: 10
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10,
    marginTop: -4
  },
  nickname: {
    fontWeight: 'bold'
  },
  itemHeadOther: {
    marginTop: 5,
    flexDirection: 'row'
  },
  itemHeadOtherItem: {
    fontSize: 12,
    color: '#aba8a6',
    marginRight: 10
  },
  itemMain: {
    // marginTop:10
  },
  images:{
    // flex: 1,
    width: 100,
    height: 100,
    marginTop:10,
    marginRight:10
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  title: {
    color: '#484848',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom:5
  },
  loading: {
    height: 60
  },
  contentText: {
    lineHeight:18
  },
  more: {
    borderTopWidth: 1,
    borderColor: '#efefef',
    padding:15,
    backgroundColor:'#fff'
  }
})
