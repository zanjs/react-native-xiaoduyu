import Ajax from '../common/ajax'

// 登录
export function exchangeNewToken({ accessToken, callback = ()=>{} }) {
  return (dispatch, getState) => {

    return Ajax({
      url: '/exchange-new-token',
      type: 'post',
      headers: { AccessToken: accessToken },
      callback
    })
  }
}
