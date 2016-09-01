import queryWordpressPosts from '../actions/queryWordpressPosts.js'
import { throttle } from 'lodash'
import EventEmitter from 'events'
const blogStore = new EventEmitter()
export const BLOG_STORE_CHANGE_EVENT = 'blogStore changed.'
const BLOG_URL = process.env.REACT_APP_WORDPRESS_BLOG
const blogRequests = []

const unthrottledEmitChange = function unthrottledEmitChange() {
  blogStore.emit(BLOG_STORE_CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 100)

function newQuery(posts, site) {
  blogRequests.push({
    posts,
    site,
    date: new Date()
  })
  emitChange()
}

export function getPosts() {
  if (blogRequests.length > 0) {
    return blogRequests[blogRequests.length-1]
  }
}

//Object.freeze(blogStore)
export default blogStore

queryWordpressPosts(BLOG_URL)
.then(json => {
  if (json.found && parseInt(json.found, 10) > 0 && Array.isArray(json.posts)) {
    newQuery(json.posts, BLOG_URL)
  }
})
