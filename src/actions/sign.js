import Ajax from '../common/ajax'

export function signout() {
  return dispatch => {
    dispatch({ type: 'REMOVE_ACCESS_TOKEN' })
  }
}

// 登录
export function signin({ data, callback = ()=>{} }) {
  return dispatch => {

    return Ajax({
      url: '/signin',
      type: 'post',
      data: data,
      callback: (res) => {

        // console.log(res);

        if (res && res.success) {
          // dispatch({ type: 'ADD_ACCESS_TOKEN', accessToken:res.data })

          // const { access_token, expires } = res.data
          //
          // let option = { path: '/' }
          //
          // if (expires) {
          //   option.expires = new Date(expires)
          // }

        }

        callback(res)
      }
    })

  }
}

// 注册
export function signup({ data, callback }) {
  return dispatch => {
    Ajax({ url: '/signup', type: 'post', data: data, callback })
  }
}


// 注册邮箱验证
export function signupEmailVerify(code, callback) {
  return dispatch => {

    Ajax({
      url: '/signup-email-verify',
      type: 'post',
      data: { code: code },
      callback: (result) => {
        if (result.success) {
          callback(null, result)
        } else {
          callback(true, result)
        }
      }
    })

  }
}
