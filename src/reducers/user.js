
import merge from 'lodash/merge'

let initialState = {
  profile: {},
  unreadNotice: [],
  accessToken: ''
}

export default function user(state = initialState, action = {}) {

  switch (action.type) {

    case 'ADD_ACCESS_TOKEN':
      state.accessToken = action.accessToken
      return merge({}, state, {})

    case 'REMOVE_ACCESS_TOKEN':
      state.accessToken = ''
      state.unreadNotice = []
      state.profile = {}
      return merge({}, state, {})

    case 'SET_USER':
      state.profile = action.userinfo
      return merge({}, state, {})

    case 'SET_UNREAD_NOTICE':
      state.unreadNotice = action.unreadNotice
      return merge({}, state, {})

    case 'REMOVE_UNREAD_NOTICE':
      var index = state.unreadNotice.indexOf(action.id)
      if (index != -1) state.unreadNotice.splice(index, 1)
      return merge({}, state, {})

    case 'ADD_BLOCK_PEOPLE_ID':
      state.profile.block_people.push(action.people_id)
      state.profile.block_people_count = state.profile.block_people_count + 1
      return merge({}, state, {})

    case 'REMOVE_BLOCK_PEOPLE_ID':
      var index = state.profile.block_people.indexOf(action.people_id)
      if (index != -1) state.profile.block_people.splice(index, 1)
      state.profile.block_people_count = state.profile.block_people_count - 1
      return merge({}, state, {})

    case 'ADD_BLOCK_POSTS_ID':
      state.profile.block_posts.push(action.posts_id)
      state.profile.block_posts_count = state.profile.block_posts_count + 1
      return merge({}, state, {})

    case 'REMOVE_BLOCK_POSTS_ID':
      var index = state.profile.block_posts.indexOf(action.posts_id)
      if (index != -1) state.profile.block_posts.splice(index, 1)
      state.profile.block_posts_count = state.profile.block_posts_count - 1
      return merge({}, state, {})

    case 'CLEAN_USEINFO':
      return merge({}, {
        profile: {},
        unreadNotice: [],
        accessToken: ''
      }, {})

    default:
      return state
  }

}

export function getUserInfo(state) {
  return state.user.profile._id ? state.user.profile : null
}

export function getProfile(state) {
  return state.user.profile || {}
}

export function getUnreadNotice(state) {
  return state.user.unreadNotice || []
}

export const getAccessToken = (state) => state.user.accessToken
