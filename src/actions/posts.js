
import Ajax from '../common/ajax'
import { DateDiff } from '../common/date'

const abstractImages = (str) => {

  let images = []

  var imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  var result = [];
  var img ;
  while(img = imgReg.exec(str)){
    result.push(img[0]);//这里的下标是匹配结果，跟你说的下标不是一回事
  }

  if (result && result.length > 0) {
    result.map((item, index) => {
      images[index] = item.match(srcReg)[1];
    })
  }

  return images

}

// 加工问题列表
const processPostsList = (list) => {

  list.map(function(posts){

    posts.images = abstractImages(posts.content_html)

    let text = posts.content_html.replace(/<[^>]+>/g,"")
    if (text.length > 140) text = text.slice(0, 140)+'...'
    posts.content_summary = text

    posts._create_at = DateDiff(posts.create_at)

    // 在ios，html渲染需要转换格式
    posts.content_html = posts.content_html.replace(/\/\/img/g, 'https://img')
    // posts.content_html = posts.content_html.replace(/\<p\>/g, '<span>')
    // posts.content_html = posts.content_html.replace(/\<\/p\>/g, '</span>')

    if (posts.comment) {
      posts.comment.map(function(comment){

        comment.images = abstractImages(comment.content_html)

        comment._create_at = DateDiff(comment.create_at)

        let text = comment.content_html.replace(/<img[^>]+>/g,"[图片]")
        text = text.replace(/<[^>]+>/g,"")

        if (text.length > 140) text = text.slice(0, 140)+'...'
        comment.content_summary = text

      })
    }

  })

  return list

}

export function loadPostsList({ name, filters = {}, callback=()=>{}, restart = false, url }) {
  return (dispatch, getState) => {

    let postsList = getState().posts[name] || {}
    let accessToken = getState().user.accessToken

    if (restart) postsList = { data: postsList.data || [] }
    if (typeof(postsList.more) != 'undefined' && !postsList.more || postsList.loading) {
      callback()
      return
    }

    if (!postsList.data) postsList.data = []

    if (!postsList.filters) {
      if (!filters.per_page) filters.per_page = 20
      postsList.filters = filters
    } else {
      filters = postsList.filters
      if (postsList.data[postsList.data.length - 1]) {
        filters.lt_date = new Date(postsList.data[postsList.data.length - 1].sort_by_date).getTime()
      }
    }

    if (!postsList.more) postsList.more = true
    if (!postsList.count) postsList.count = 0
    if (!postsList.loading) postsList.loading = true

    dispatch({ type: 'ADD_POSTS_LIST', name, list: postsList })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    return Ajax({
      url: '/posts',
      data: filters,
      headers,
      callback: (res) => {

        if (!res || !res.success) return callback(res)

        if (restart) postsList.data = []

        postsList.more = res.data.length < postsList.filters.per_page ? false : true
        postsList.data = postsList.data.concat(processPostsList(res.data))
        postsList.filters = filters
        postsList.count = 0
        postsList.loading = false

        dispatch({ type:'ADD_POSTS_LIST', name, list: postsList })
        callback(res)

      }
    })

  }
}

export function loadPostsById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    return loadPostsList({
      name: id,
      filters: { posts_id: id, per_page: 1, draft: 1 },
      restart: true,
      callback: (result)=>{
        if (!result || !result.success || !result.data || result.data.length == 0) {
          return callback(result)
        }
        callback(result.data[0])
      }
    })(dispatch, getState)
  }
}

export function cleanAllPosts() {
  return (dispatch, getState) => {
    dispatch({ type: 'CLEAN_ALL_POSTS' })
  }
}

// 添加问题
export function addPosts({ title, detail, detailHTML, topicId, device, type, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/add-posts',
      type:'post',
      data: {
        title: title, detail: detail, detail_html: detailHTML,
        topic_id: topicId, device_id: device, type: type
      },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}


export function updatePostsById({ id, type, topicId, title, content, contentHTML, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let state = getState().posts

    return Ajax({
      url: '/update-posts',
      type:'post',
      data: {
        id: id, type: type, title: title,
        topic_id: topicId, content: content, content_html: contentHTML
      },
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (!res || !res.success) return callback(res)

        loadPostsById({
          id,
          callback: (posts)=> {

            if (!posts) return callback(res)

            for (let i in state) {

              if (i == id) {
                state[i].data[0] = posts
              } else {
                state[i].data.map((item, index)=>{
                  if (item._id == id) {
                    posts.comment = item.comment
                    posts.comment_count = item.comment_count
                    state[i].data[index] =  posts
                  }
                })
              }
            }

            dispatch({ type: 'SET_POSTS', state })
            res.data = posts
            callback(res)

          }
        })(dispatch, getState)

      }
    })

  }
}


export function addViewById({ id, callback = ()=>{ } }) {
  return (dispatch, getState) => {

    return Ajax({
      url: '/view-posts',
      type: 'get',
      data: { posts_id: id },
      callback: (result) => {
        if (result && result.success) {
          dispatch({ type: 'UPDATE_POSTS_VIEW', id: id })
        }
        callback(result)
      }
    })
  }
}



// 首页拉取新的帖子的时间
let lastFetchAt = null

// 获取新的主题
export function loadNewPosts(timestamp) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let postsList = getState().posts['discover'] || null
    let newPostsList = getState().posts['new'] || null
    let me = getState().user.profile || null

    if (!postsList) return
    if (!lastFetchAt) lastFetchAt = timestamp

    let filters = {
      gt_create_at: lastFetchAt,
      per_page: 100,
      postsSort: 'create_at:-1'
    }

    if (accessToken) {
      filters.method = 'user_custom'
    }

    return loadPostsList({
      name: 'new',
      filters: filters,
      callback: (res) =>{
        console.log(res);
      }
    })(dispatch, getState)
  }

}


// 显示新的帖子
export function showNewPosts() {
  return (dispatch, getState) => {

      dispatch({ type: 'ADD_POSTS_LIST', name:'new', data: { data: [] } })

      /*
      return

      let homeList = getState().posts['discover']
      let newList = getState().posts['new']


      let i = newList.data.length
      while (i--) {
        homeList.data.unshift(newList.data[i])
      }

      lastFetchAt = newList.data[0].create_at

      dispatch({ type: 'ADD_POSTS_LIST', name:'discover', data: homeList })



      setTimeout(()=>{
        dispatch({ type: 'ADD_POSTS_LIST', name:'new', data: { data: [] } })
        console.log('123123123');
      })
      */
    }
}
