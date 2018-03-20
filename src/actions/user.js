import Ajax from '../common/ajax'

function setUser(userinfo) {
  return { type: 'SET_USER', userinfo }
}

export function removeAccessToken() {
  return { type: 'REMOVE_ACCESS_TOKEN' }
}

export function addAccessToken({ accessToken }) {
  return (dispatch, getState) => {
    dispatch({ type: 'ADD_ACCESS_TOKEN', accessToken })
  }
}

export function loadUserInfo({ accessToken = null, callback = ()=>{} }) {
  return (dispatch, getState) => {

    accessToken = accessToken || getState().user.accessToken

    return Ajax({
      url: '/user',
      type: 'post',
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (res && res.success) {
          dispatch(setUser(res.data))
        }
        callback(res)
      }
    })

  }
}

export function resetAvatar({ avatar, callback =()=>{} }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/reset-avatar',
      type: 'post',
      data: { avatar: avatar },
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) loadUserInfo({
          callback: (res)=>{
            if (res && res.success) {
              dispatch({ type: 'UPDATE_POSTS_LIST_USER_AVATAR_BY_USER_ID', userId: res.data._id, avatar: res.data.avatar_url })
            }
          }
        })(dispatch, getState)
        callback(res)
      }
    })

  }
}

export function resetNickname({ nickname, callback =()=>{} }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return Ajax({
      url: '/reset-nickname',
      type: 'post',
      data: { nickname: nickname },
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) loadUserInfo({})(dispatch, getState)
        callback(res)
      }
    })

  }
}

export function resetGender({ gender, callback =()=>{} }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/reset-gender',
      type: 'post',
      data: { gender: gender },
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) loadUserInfo({})(dispatch, getState)
        callback(res)
      }
    })

  }
}

export function resetBrief({ brief, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/reset-brief',
      type: 'post',
      data: { brief: brief },
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) loadUserInfo({})(dispatch, getState)
        callback(res)
      }
    })

  }
}

export function cleanUserInfo() {
  return (dispatch, getState) => {
    dispatch({ type: 'CLEAN_USEINFO' })
  }
}
