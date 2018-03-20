

import Ajax from '../common/ajax'

export function loadPeopleById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/people/'+id,
      type: 'get',
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) {
          dispatch({ type: 'ADD_PEOPLE', people: res.data })
          callback(res.data)
        } else {
          callback(null)
        }
      }
    })

  }
}

export const cleanAllPeople = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'CLEAN_ALL_PEOPLE' })
  }
}
