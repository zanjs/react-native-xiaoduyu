import Ajax from '../common/ajax'

export function block({ data = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/add-block',
      type: 'post',
      data: data,
      headers: { AccessToken: accessToken },
      callback: (result)=>{
        if (result && result.success) {
          if (data.posts_id) {
            dispatch({ type: 'REMOVE_POSTS_BY_ID', id: data.posts_id })
            dispatch({ type: 'ADD_BLOCK_POSTS_ID', posts_id: data.posts_id })
            dispatch({ type: 'ADD_BLOCK_POSTS', data: result.data })
          } else if (data.people_id) {
            dispatch({ type: 'ADD_BLOCK_PEOPLE', data: result.data })
            dispatch({ type: 'ADD_BLOCK_PEOPLE_ID', people_id: data.people_id })
          }
        }
        callback(result)
      }
    })
    
  }
}

export function unblock({ data = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/remove-block',
      type: 'post',
      data: data,
      headers: { AccessToken: accessToken },
      callback: (result)=>{
        if (result && result.success) {
          if (data.posts_id) {
            dispatch({ type: 'REMOVE_BLOCK_POSTS_ID', posts_id: data.posts_id })
            dispatch({ type: 'UNBLOCK_BY_POSTS_ID', posts_id: data.posts_id })
          } else if (data.people_id) {
            dispatch({ type: 'REMOVE_BLOCK_PEOPLE_ID', people_id: data.people_id })
            dispatch({ type: 'UNBLOCK_BY_PEOPLE_ID', people_id: data.people_id })
          }
        }
        callback(result)
      }
    })

  }
}

export function loadBlockList({ name, filters = {}, callback = ()=>{}, restart = false }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let list = getState().block[name] || {}

    if (restart) list = { data: list.data || [] }
    if (typeof(list.more) != 'undefined' && !list.more || list.loading) return

    if (!list.filters) {
      if (!filters.page) filters.page = 0
      if (!filters.per_page) filters.per_page = 20
      list.filters = filters
    } else {
      filters = list.filters
      filters.page = filters.page + 1
    }

    if (!list.data) list.data = []
    if (!list.more) list.more = true
    if (!list.loading) list.loading = true

    dispatch({ type: 'SET_BLOCK_LIST_BY_NAME', name, data: list })

    return Ajax({
      url: '/block',
      type: 'get',
      data: filters,
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && !res.success) return callback(res)

        if (restart) list.data = []

        list.loading = false
        list.more = res.data.length < list.filters.per_page ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        list.count = 0

        dispatch({ type: 'SET_BLOCK_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

  }
}

export const cleanAllBlock = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'CLEAN_ALL_BLOCK' })
  }
}
