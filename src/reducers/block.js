
import merge from 'lodash/merge'

let initialState = {}

export default function block(state = initialState, action = {}) {
  switch (action.type) {

    case 'CLEAN_ALL_BLOCK':
      return merge({}, {}, {})

    case 'SET_BLOCK_PEOPLE':
      return merge({}, action.state, {})

    case 'SET_BLOCK_LIST_BY_NAME':
      var { name, data } = action
      state[name] = data
      return merge({}, state, {})

    case 'ADD_BLOCK_PEOPLE':
      if (state['people']) {
        state['people'].data.push(action.data)
      }
      return merge({}, state, {})

    case 'ADD_BLOCK_POSTS':
      if (state['posts']) {
        state['posts'].data.push(action.data)
      }
      return merge({}, state, {})

    case 'UNBLOCK_BY_POSTS_ID':
      for (let i in state) {
        for (let n = 0, max = state[i].data.length; n < max; n++) {
          if (state[i].data[n].posts_id && state[i].data[n].posts_id._id == action.posts_id) {
            state[i].data.splice(n, 1)
            break
          }
        }
      }
      return merge({}, state, {})

    case 'UNBLOCK_BY_PEOPLE_ID':
      for (let i in state) {
        for (let n = 0, max = state[i].data.length; n < max; n++) {
          if (state[i].data[n].people_id && state[i].data[n].people_id._id == action.people_id) {
            state[i].data.splice(n, 1)
            break
          }
        }
      }
      return merge({}, state, {})

    default:
      return state
  }
}


export const getBlockListByName = (state, name)=>{
  return state.block[name] || {}
}
