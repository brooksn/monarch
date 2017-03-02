import 'whatwg-fetch'
import querystring from 'querystring'
import catchHTTPStatus from '../actions/catchHTTPStatus.js'
import AppDispatcher from '../dispatcher/AppDispatcher.js'
import { throttle } from 'lodash'
import EventEmitter from 'events'
const geocoderStore = new EventEmitter()
export const GEOCODER_STORE_CHANGE_EVENT = 'geocoderStore changed.'
const MONARCH_SERVER = process.env.REACT_APP_MONARCH_SERVER
const jobs = {}
export const Status = {
  Missing: 'Missing',
  Pending: 'Pending',
  Unconfirmed: 'Unconfirmed',
  Completed: 'Completed'
}
Object.freeze(Status)

const unthrottledEmitChange = function unthrottledEmitChange() {
  geocoderStore.emit(GEOCODER_STORE_CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 100)

function newJobFromID(jobID) {
  return {id: jobID, status: Status.Unconfirmed, checked: new Date()}
}

export function downloadLink(jobID) {
  console.log('downladLink?')
  console.log(jobs[jobID])
  if (jobs[jobID] && jobs[jobID].id && jobs[jobID].status === Status.Completed) {
    return `${MONARCH_SERVER}/downloadGeocodeJob/${jobs[jobID].id}.csv`
  }
}

export function started(jobID) {
  return jobs[jobID] && !!jobs[jobID].id
}

export function geocodeID(jobID) {
  return jobs[jobID] && jobs[jobID].id
}

export function getStatus(jobID) {
  if (!jobs[jobID]) {
    jobs[jobID] = newJobFromID(jobID)
    checkJob(jobID)
  }
  if (jobs[jobID]) return JSON.parse(JSON.stringify(jobs[jobID]))
}

function checkJob(jobID) {
  console.log('checking job:')
  console.log(jobs[jobID])
  if (jobs[jobID] && jobs[jobID].status !== Status.Missing) {
    const job = jobs[jobID]
    fetch(`${MONARCH_SERVER}/checkGeocodeJob/${job.id}`)
    .then(catchHTTPStatus)
    .then(res => res.json())
    .then(json => {
      const data = json.data
      jobs[jobID].createdDate = jobs[jobID].createdDate || new Date(data.resourceSets[0].resources[0].createdDate)
      jobs[jobID].checked = new Date()
      jobs[jobID].status = Status[data.resourceSets[0].resources[0].status]
      emitChange()
    })
    .catch(err => {
      if (jobs[jobID].status === Status.Unconfirmed) jobs[jobID].status = Status.Missing
      emitChange()
    })
  } else {
    jobs[jobID] = newJobFromID(jobID)
    checkJob(jobID)
  }
}

function sendJob(jobID, body, description) {
  if (jobs[jobID]) throw new Error(`jobID ${jobID} should be unique, but it already exists. `)
  const qs = querystring.stringify({input: 'csv', description})
  fetch(`${MONARCH_SERVER}/createGeocodeJob?${qs}`, {method: 'POST',body})
  .then(catchHTTPStatus)
  .then(res => res.json())
  .then(json => {
    const data = json.data
    jobs[jobID] = {
      id: data.resourceSets[0].resources[0].id,
      status: Status[data.resourceSets[0].resources[0].status],
      url: data.resourceSets[0].resources[0].links[0].url,
      createdDate: new Date(data.resourceSets[0].resources[0].createdDate),
      checked: new Date()
    }
    console.log('jobs: ')
    console.log(jobs)
    emitChange()
  })
}

AppDispatcher.register(dispatch => {
  switch (dispatch.actionType) {
    case 'Create geocode job':
      sendJob(dispatch.data.id, dispatch.data.requestText, dispatch.data.description)
      break;
    default:
      break;
  }
})

const poll = setInterval(() => {
  const now = new Date()
  for (const jobID in jobs) {
    //been 5 seconds since this 1-minute-old has been checked
    const veryFresh = now - jobs[jobID].createdDate < 1000 * 60 && now - jobs[jobID].checked > 1000 * 5
    //been 30 seconds since this 5-minute-old has been checked
    const fairlyFresh = now - jobs[jobID].createdDate < 1000 * 60 * 5 && now - jobs[jobID].checked > 1000 * 30
    //been 2 minutes since last check
    const stale = now - jobs[jobID].checked > 1000 * 60 * 2
    if (jobs[jobID].status === Status.Pending && (veryFresh || fairlyFresh || stale)) {
      checkJob(jobID)
    }
  }
}, 1000 * 5)

//Object.freeze(geocoderStore)
export default geocoderStore

