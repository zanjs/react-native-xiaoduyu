
import merge from 'lodash/merge'

let initialState = {
  other: {
    data: []
  }
}

export default function topic(state = initialState, action = {}) {

  switch (action.type) {

    case 'CLEAN_ALL_TOPIC':
      return merge({}, {
        other: {
          data: []
        }
      }, {})

    case 'SET_TOPIC_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'ADD_NODE':
      var { node } = action
      state.other.data.push(node)
      return merge({}, state, {})

    // 添加新的列表
    case 'SET_NODE_LIST':
      var { name, filters, data, loading, more } = action

      state[name] = {
        filters: filters,
        data: data,
        loading: loading,
        more: more
      }
      return merge({}, state, {})

    case 'SET_NODE':
      return merge({}, action.state, {})

    case 'FOLLOW_TOPIC':

      const { id, status } = action

      for (let i in state) {

        if (!state[i].data) continue

        state[i].data.map(item=>{

          if (item._id == id) {
            item.follow_count += status ? 1 : -1
            item.follow = status
          }

          if (!item.children) return

          item.children.map(item=>{
            if (item._id == id) {
              item.follow_count += status ? 1 : -1
              item.follow = status
            }
          })

        })

      }

      return merge({}, state, {})

    default:
      return state
  }

}


export const getTopicListByName = (state, name) => {
  return state.topic[name] ? state.topic[name] : {}
}

export const getTopicById = (state, nodeId) => {

  let nodeList = state.topic

  for (let i in nodeList) {

    let nodes = nodeList[i]
    nodes = nodes.data

    for (let n = 0, length = nodes.length; n < length; n++) {
      if (nodes[n]._id == nodeId) {
        return [nodes[n]]
      }
    }

  }

  return []
}
