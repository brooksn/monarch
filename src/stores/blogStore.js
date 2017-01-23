import queryWordpress from '../actions/queryWordpress.js'
import { throttle, uniqBy } from 'lodash'
import EventEmitter from 'events'
const blogStore = new EventEmitter()
export const BLOG_STORE_CHANGE_EVENT = 'blogStore changed.'
const BLOG_URL = process.env.REACT_APP_WORDPRESS_BLOG
const pageStore = []

const unthrottledEmitChange = function unthrottledEmitChange() {
  blogStore.emit(BLOG_STORE_CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 100)

export function getPages() {
  return uniqBy(pageStore, 'slug').filter(page => page.featured_image)
}

//Object.freeze(blogStore)
export default blogStore

queryWordpress({blog: BLOG_URL, type: 'page'})
.then(json => {
  const pages = Array.isArray(json.posts) ? json.posts : []
  pages.forEach(page => pageStore.push(page))
  emitChange()
})
