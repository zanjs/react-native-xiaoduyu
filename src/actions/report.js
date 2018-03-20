

import Ajax from '../common/ajax'

export function loadReportList({ callback = ()=>{} }) {
  return (dispatch, getState) => {

    return Ajax({
      url: '/get-report-list',
      type: 'get',
      callback: (res)=>{
        if (res && res.success) {
          dispatch({ type: 'ADD_REPORT_LIST', state: res.data })
          callback(res)
        } else {
          callback(null)
        }
      }
    })

  }
}

export const addReport = ({ data = {}, callback = ()=>{} }) => {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/add-report',
      type: 'post',
      data,
      headers: { AccessToken: accessToken },
      callback
    })

  }
}
