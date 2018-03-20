import Ajax from '../common/ajax'
import { DateDiff } from '../common/date'


export function addComment({ data, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let commentState = getState().comment
    let postsState = getState().posts

    return Ajax({
      url: '/write-comment',
      type: 'post',
      data: data,
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (!res || !res.success) {
          return callback(res)
        }

        const { parent_id, posts_id } = data

        for (let i in commentState) {

          // 评论 和 回复
          if (!parent_id && i == posts_id || parent_id && i == parent_id || parent_id && i == parent_id + '-reply') {
            commentState[i].data.push(res.data)
          }

          commentState[i].data.map(item=>{
            if (item._id == parent_id) {
              item.reply.push(res.data)
              item.reply_count += 1
            }
          })

        }

        dispatch({ type: 'SET_COMMENT', state: commentState })

        /*
        if (!parent_id) {
          for (let i in postsState) {
            postsState[i].data.map(item=>{
              if (item._id == posts_id) {
                item.comment.push(res.data)
              }
            })
          }
          dispatch({ type: 'SET_POSTS', state: postsState })
        }
        */

        callback(res)

      }
    })

  }
}

export function updateComment({ id, contentJSON, contentHTML, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let comment = getState().comment
    let posts = getState().posts

    return Ajax({
      url: '/update-comment',
      type: 'post',
      data: {
        id : id,
        content : contentJSON,
        content_html: contentHTML
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (!res || !res.success) return callback(res)

        for (let i in comment) {
          comment[i].data.map(item=>{
            if (item._id == id) {
              item.content = contentJSON
              item.content_html = contentHTML
            }
          })
        }

        for (let i in posts) {

          posts[i].data.map(item=>{

            if (!item.comment) return

            item.comment.map((comment, index)=>{
              if (comment._id == id) {
                item.comment[index].content_html = contentHTML

                let text = contentHTML.replace(/<img[^>]+>/g,"[图片]")
                text = text.replace(/<[^>]+>/g,"")

                if (text.length > 200) text = text.slice(0, 200)+'...'

                item.comment[index].content_summary = text
              }
            })

          })

        }

        dispatch({ type: 'SET_POSTS', state:posts })
        dispatch({ type: 'SET_COMMENT', state:comment })

        callback(res)

      }
    })

  }
}

export function loadCommentList({ name, filters = {}, callback = ()=>{}, restart = false }) {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken
    let commentList = getState().comment[name] || {}

    if (restart) {
      commentList = {}
    }

    if (typeof(commentList.more) != 'undefined' && !commentList.more ||
      commentList.loading
    ) {
      callback()
      return
    }

    if (!commentList.data) commentList.data = []

    if (!commentList.filters) {
      filters.gt_create_at = filters.gt_create_at || 0
      filters.per_page = filters.per_page || 30
      commentList.filters = filters
    } else {
      filters = commentList.filters
      if (commentList.data[commentList.data.length - 1]) {
        filters.gt_create_at = new Date(commentList.data[commentList.data.length - 1].create_at).getTime()
      }
    }

    if (!commentList.more) commentList.more = true
    if (!commentList.count) commentList.count = 0
    if (!commentList.loading) commentList.loading = true

    dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: commentList })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    return Ajax({
      url: '/comments',
      data: filters,
      headers,
      callback: (res) => {

        if (!res || !res.success) {
          callback(res)
          return
        }

        let _commentList = res.data

        commentList.more = res.data.length < commentList.filters.per_page ? false : true
        commentList.data = commentList.data.concat(processCommentList(_commentList))
        commentList.filters = filters
        commentList.count = 0
        commentList.loading = false

        dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: commentList })
        callback(res)
      }
    })

  };
}

export const loadCommentById = ({ id, callback = () => {} }) => {
  return (dispatch, getState) => {

    return loadCommentList({
      name: id,
      filters: { comment_id: id, per_page: 1, draft: 1 },
      restart: true,
      callback: (res) => {

        if (res && res.success && res.data && res.data.length > 0) {
          callback(res.data[0])
        } else {
          callback(null)
        }

      }
    })(dispatch, getState)

  }
}

export const cleanAllComment = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'CLEAN_ALL_COMMENT' })
  }
}

const processCommentList = (list) => {
  list.map(item=>{
    item._create_at = DateDiff(item.create_at)

    item.content_html = item.content_html.replace(/\/\/img/g, 'https://img')
    // item.content_html = item.content_html.replace(/\<p\>/g, '<span>')
    // item.content_html = item.content_html.replace(/\<\/p\>/g, '</span>')

    if (item.reply) {
      item.reply.map(item=>{
        item._create_at = DateDiff(item.create_at)

        item.content_html = item.content_html.replace(/\/\/img/g, 'https://img')
        // item.content_html = item.content_html.replace(/\<p\>/g, '<span>')
        // item.content_html = item.content_html.replace(/\<\/p\>/g, '</span>')

      })
    }
  })
  return list
}
