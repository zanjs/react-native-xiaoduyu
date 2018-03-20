import Ajax from '../common/ajax'

// 登录
export function weiboGetUserInfo({ data, callback = ()=>{} }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    if (accessToken) data.access_token = accessToken

    return Ajax({
      url: '/weibo-get-user-info',
      type: 'post',
      data: data,
      callback
    })
  }
}

export function QQGetUserInfo({ data, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    if (accessToken) data.access_token = accessToken
    
    return Ajax({
      url: '/qq-get-user-info',
      type: 'post',
      data: data,
      callback
    })
  }
}

export function unbindingSocialAccount({ socialName, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    Ajax({
      url: '/unbinding-'+socialName,
      type:'post',
      headers: { AccessToken: accessToken },
      callback
    })
  }
}

/*
export function unbindingQQ({ callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/unbinding-qq',
      type:'post',
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function unbindingWeibo({ callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/unbinding-weibo',
      type:'post',
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function unbindingGithub({ callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    Ajax({
      url: '/unbinding-github',
      type:'post',
      headers: { AccessToken: accessToken },
      callback
    })

  }
}
*/
