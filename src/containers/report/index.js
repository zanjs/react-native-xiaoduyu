
import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, Button, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadReportList, addReport } from '../../actions/report'
import { getReportList } from '../../reducers/report'
import gStyles from '../../styles'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import Wait from '../../components/ui/wait'

class Report extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: '举报'
  })

  constructor (props) {
    super(props)
    this.state = {
      submitting: false,
      reportId: 0,
      detail: '',
      showDetail: false
    }
    this.submit = this.submit.bind(this)
    this.chooseReportItem = this.chooseReportItem.bind(this)
  }

  componentWillMount() {

    const { reportList, loadReportList } = this.props

    if (reportList.length == 0) {
      loadReportList({})
    }

  }

  chooseReportItem(index, value) {
    this.state.reportId = value

    if (value == 3 || value == 4 || value == 6) {
      this.setState({ reportId: value, showDetail: true })
    } else {
      this.setState({ reportId: value, showDetail: false })
    }

  }

  submit() {

    const { reportId, detail, showDetail } = this.state
    const { addReport, navigation } = this.props
    const { people, comment, posts } = this.props.navigation.state.params

    if (!reportId) return Alert.alert('', '请选择举报类型')
    if (showDetail && !detail) return this.refs.detail.focus()

    let data = { report_id: reportId }

    if (people) data.people_id = people._id
    if (comment) data.comment_id = comment._id
    if (posts) data.posts_id = posts._id
    if (showDetail) data.detail = detail

    addReport({
      data,
      callback: (res)=>{

        if (res && res.success) {
          Alert.alert('','您的举报已提交成功，感谢')
          navigation.goBack()
        } else {
          Alert.alert('', res.error || '提交失败')
        }

      }
    })

  }

  render() {

    const self = this
    const { reportList } = this.props
    const { people, comment, posts } = this.props.navigation.state.params
    const { showDetail } = this.state

    let text = ''
    if (people) text = '举报用户 ' + people.nickname
    if (comment) text = '举报用户 ' + comment.user_id.nickname + ' 的评论'
    if (posts) text = '举报用户 ' + posts.user_id.nickname + ' 的帖子'

    return (<ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
      <View style={gStyles['m-15']}>

        <View style={gStyles['m-15']}><Text>{text}</Text></View>

        <RadioGroup onSelect = {this.chooseReportItem}>
          {reportList.map(item=>{
            return (<RadioButton value={item.id} key={item.id}>
              <Text>{item.text}</Text>
            </RadioButton>)
          })}
        </RadioGroup>

        {showDetail ?
          <View style={gStyles['m-15']}>
            <Text>需要补充举报说明：</Text>
            <TextInput
              ref="detail"
              onChangeText={(detail) => this.setState({detail})}
              multiline={true}
              style={{ height:100, borderWidth: 1, borderColor: '#e2e2e2', paddingLeft:10, marginTop:20 }}
              />
          </View>
          : null}

        <TouchableOpacity onPress={this.submit} style={[gStyles.fullButton, gStyles['m-10']]}>
          <Text style={gStyles.white}>提交</Text>
        </TouchableOpacity>

      </View>

      {this.state.visible ? <Wait /> : null}

      <KeyboardSpacer />
    </ScrollView>)
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#ffff'
  }
})

export default connect(
  (state, props) => {
    return {
      reportList: getReportList(state)
    }
  },
  (dispatch, props) => ({
    addReport: bindActionCreators(addReport, dispatch),
    loadReportList: bindActionCreators(loadReportList, dispatch)
  })
)(Report)
