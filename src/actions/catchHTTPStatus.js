const catchHTTPStatus = res => {
  if (res.status < 200 || res.status >= 300) {
    throw new Error('Bad response: ' + res.statusText)
  }
  return res
}
export default catchHTTPStatus
