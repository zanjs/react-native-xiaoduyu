
import Ajax from '../common/ajax'

export function addTopic({ name, brief, avatar, description, parentId, callback = ()=>{} }) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken

    Ajax({
      url: '/add-topic',
      type: 'post',
      data: {
        parent_id: parentId,
        name: name,
        brief: brief,
        avatar: avatar,
        description: description
      },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function updateTopicById({ id, name, brief, avatar, description, parentId, callback = ()=>{} }) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken
    let state = getState().topic

    Ajax({
      url: '/update-topic',
      type: 'post',
      data: {
        id: id,
        parent_id: parentId,
        name: name,
        brief: brief,
        avatar: avatar,
        description: description
      },
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && res.success) {
          for (let i in state) {
            let data = state[i].data
            if (data.length > 0) {
              for (let n = 0, max = data.length; n < max; n++) {
                if (data[n]._id == id) {
                  state[i].data[n].name = name
                  state[i].data[n].brief = brief
                  state[i].data[n].avatar = avatar
                  state[i].data[n].description = description
                  state[i].data[n].parent_id = parentId
                }
              }
            }
          }
          dispatch({ type: 'SET_NODE', state })
        }

        callback(res)
      }
    })

  }
}

export function loadTopicById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    Ajax({
      url: '/topic',
      data: { topic_id: id },
      callback: (res)=>{
        if (res && res.success && res.data && res.data.length > 0) {
          dispatch({ type: 'ADD_NODE', node: res.data[0] })
          callback(res.data[0])
        } else {
          callback(null)
        }

      }
    })

  }
}


export function loadTopicList({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken
    let nodeList = getState().topic[name] || {}

    if (typeof(nodeList.more) != 'undefined' && !nodeList.more || nodeList.loading) {
      return
    }

    if (!nodeList.data) {
      nodeList.data = []
    }

    if (!nodeList.filters) {

      if (!filters.page) {
        filters.page = 0
      }

      if (!filters.per_page) {
        filters.per_page = 30
      }

      nodeList.filters = filters
    } else {
      filters = nodeList.filters
      filters.page = filters.page + 1
    }

    if (!nodeList.more) {
      nodeList.more = true
    }

    if (!nodeList.loading) {
      nodeList.loading = true
    }

    dispatch({ type: 'SET_TOPIC_LIST_BY_NAME', name, data: nodeList })

    let headers = {}

    if (accessToken) {
      headers.AccessToken = accessToken
    } else {
      headers = null
    }

    return Ajax({
      url: '/topic',
      data: filters,
      headers,
      callback: (res)=>{

        nodeList.loading = false

        if (res.success) {
          nodeList.more = res.data.length < nodeList.filters.per_page ? false : true
          nodeList.data = nodeList.data.concat(res.data)
          nodeList.filters = filters
          nodeList.count = 0
        }

        dispatch({ type: 'SET_TOPIC_LIST_BY_NAME', name, data: nodeList })
        callback(res)
      }
    })

  }
}

export const cleanAllTopic = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'CLEAN_ALL_TOPIC' })
  }
}
