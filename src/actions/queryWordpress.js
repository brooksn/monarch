import 'whatwg-fetch'
import querystring from 'querystring'
import catchHTTPStatus from './catchHTTPStatus'
export default function queryWordpress(opts) {
  const blog = opts.blog
  const postType = opts.type || 'any'
  const qs = querystring.stringify({
    type: postType
  })
  return fetch(`https://public-api.wordpress.com/rest/v1.1/sites/${blog}/posts?${qs}`)
  .then(catchHTTPStatus)
  .then(res => res.json())
}
