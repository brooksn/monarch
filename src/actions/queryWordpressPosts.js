import 'whatwg-fetch'
import catchHTTPStatus from './catchHTTPStatus'
export default function queryWordpressPosts(blog) {
  return fetch(`https://public-api.wordpress.com/rest/v1.1/sites/${blog}/posts`)
  .then(catchHTTPStatus)
  .then(res => res.json())
}
