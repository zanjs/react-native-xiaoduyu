import Ajax from '../common/ajax'

export function follow({ data = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    let selfId = getState().user.profile._id

    return Ajax({
      url: '/add-follow',
      type: 'post',
      data: data,
      headers: { AccessToken: accessToken },
      callback: (result)=>{
        if (result && result.success) {
          if (data.posts_id) {
            dispatch({ type: 'UPDATE_POSTS_FOLLOW', id: data.posts_id, followStatus: true  })
          } else if (data.people_id) {
            dispatch({ type: 'UPLOAD_FOLLOW_PEOPLE_FOLLOW_STATUS', peopleId: data.people_id, selfId: selfId, followStatus: true })
            dispatch({ type: 'UPLOAD_PEOPLE_FOLLOW', peopleId: data.people_id, selfId: selfId, followStatus: true })
          } else if (data.topic_id) {
            dispatch({ type: 'FOLLOW_TOPIC', id: data.topic_id, status: true })
          }
        }
        callback(result)
      }
    })

  }
}

export function unfollow({ data = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    let selfId = getState().user.profile._id

    return Ajax({
      url: '/remove-follow',
      type: 'post',
      data: data,
      headers: { AccessToken: accessToken },
      callback: (result)=>{
        if (result && result.success) {
          if (data.posts_id) {
            dispatch({ type: 'UPDATE_POSTS_FOLLOW', id: data.posts_id, followStatus: false  })
          } else if (data.people_id) {
            dispatch({ type: 'UPLOAD_FOLLOW_PEOPLE_FOLLOW_STATUS', peopleId: data.people_id, selfId: selfId, followStatus: false })
            dispatch({ type: 'UPLOAD_PEOPLE_FOLLOW', peopleId: data.people_id, selfId: selfId, followStatus: false })
          } else if (data.topic_id) {
            dispatch({ type: 'FOLLOW_TOPIC', id: data.topic_id, status: false })
          }
        }
        callback(result)
      }
    })

  }
}

/*
export function loadFollowPeoples({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let list = getState().followPeople[name] || {}

    if (typeof(list.more) != 'undefined' && !list.more || list.loading) return

    if (!list.filters) {
      if (!filters.page) filters.page = 0
      if (!filters.per_page) filters.per_page = 30
      list.filters = filters
    } else {
      filters = list.filters
      filters.page = filters.page + 1
    }

    if (!list.data) list.data = []
    if (!list.more) list.more = true
    if (!list.loading) list.loading = true

    dispatch({ type: 'SET_FOLLOW_PEOPLE_LIST_BY_NAME', name, data: list })

    return Ajax({
      url: '/follow',
      type: 'get',
      params: filters,
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && !res.success) {
          callback(res)
          return
        }

        list.loading = false
        list.more = res.data.length < list.filters.per_page ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        list.count = 0

        dispatch({ type: 'SET_FOLLOW_PEOPLE_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

  }
}

export function loadFans({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let list = getState().followPeople[name] || {}

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

    dispatch({ type: 'SET_FOLLOW_PEOPLE_LIST_BY_NAME', name, data: list })

    return Ajax({
      url: '/follow',
      // url: '/fetch-fans',
      type: 'get',
      params: filters,
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && !res.success) {
          callback(res)
          return
        }

        list.loading = false
        list.more = res.data.length < list.filters.per_page ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        list.count = 0

        dispatch({ type: 'SET_FOLLOW_PEOPLE_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

  }
}

*/

export function loadFollowPosts({ name, filters = {}, callback = ()=>{}, restart = false }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let list = getState().followPeople[name] || {}

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

    dispatch({ type: 'SET_FOLLOW_PEOPLE_LIST_BY_NAME', name, data: list })

    return Ajax({
      url: '/follow',
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

        dispatch({ type: 'SET_FOLLOW_PEOPLE_LIST_BY_NAME', name, data: list })

        callback(res)
      }
    })

  }
}

export const cleanAllFollow = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'CLEAN_ALL_FOLLOW_PEOPLE' })
  }
}
