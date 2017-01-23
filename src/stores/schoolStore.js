import mapStore, { MAP_STORE_CHANGE_EVENT } from './mapStore.js'
import { throttle, defer } from 'lodash'
import catchHTTPStatus from '../actions/catchHTTPStatus.js'
import querystring from 'querystring'
import EventEmitter from 'events'
import rbush from 'rbush'
const tree = rbush(100)

export const SCHOOL_STORE_CHANGE_EVENT = 'schoolStore changed.'
const recordsMissingCoordinates = 320
const schoolStore = new EventEmitter()

const unthrottledEmitChange = function unthrottledEmitChange() {
  schoolStore.emit(SCHOOL_STORE_CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 100)

function getSchoolsInSomeLeafletBBox(bbox) {
  //const buffer = theBuffer || 0
  const searchArea = {minX: bbox[0], minY: bbox[1], maxX: bbox[2], maxY: bbox[3]}
  return tree.search(searchArea)
}

export function getAllSchools() {
  return tree.all()
}

export function getSchoolsInLeafletBBox(bbox) {
  return getSchoolsInSomeLeafletBBox(bbox)
}
export function getSchoolsInBufferedLeafletBBox(bbox) {
  return getSchoolsInSomeLeafletBBox(bbox)
}

mapStore.on(MAP_STORE_CHANGE_EVENT, (mapStoreChange) => {
  //const bbox = getBoundingBoxOfMap(mapStoreChange.mapName)
  //const envelope = bbox && bbox.toBBoxString ? bbox.toBBoxString() : bbox.join(',')
})

function fetchInitialStoreData(lastOBJECTID) {
  const andWhere = lastOBJECTID ? ` AND OBJECTID > ${lastOBJECTID}` : ''
  const where = `OBJECTID <=100000${andWhere}`
  const qs = querystring.stringify({
    where,
    outSR: 4326,
    orderByFields: 'OBJECTID ASC',
    f: 'json',
    outFields: ['OBJECTID', 'School', 'Street', 'City', 'Zip'].join(',')
  })
  fetch(`http://services.gis.ca.gov/arcgis/rest/services/Society/CaliforniaSchools/MapServer/0/query?${qs}`)
  .then(catchHTTPStatus)
  .then(res => res.json())
  .then(json => {
    const features = json.features.filter(feature => !isNaN(feature.geometry.x)).map(feature => {
      const pin = {
        id: 'school_' + feature.attributes.OBJECTID,
        school: feature.attributes.School,
        street: feature.attributes.Street,
        city: feature.attributes.City,
        lat: feature.geometry.y,
        lng: feature.geometry.x,
        minY: feature.geometry.y,
        minX: feature.geometry.x,
        maxY: feature.geometry.y,
        maxX: feature.geometry.x
      }
      localStorage.setItem(pin.id, JSON.stringify(pin))
      return pin
    })
    defer((pins, didExceedTransferLimit, lastOBJECTID) => {
      tree.load(pins)
      if (didExceedTransferLimit) fetchInitialStoreData(lastOBJECTID)
      emitChange()
    }, features, json.exceededTransferLimit, json.features[json.features.length-1].attributes.OBJECTID)
  })
}

fetch('http://services.gis.ca.gov/arcgis/rest/services/Society/CaliforniaSchools/MapServer/0/query?where=OBJECTID+%3C%3D100000&returnCountOnly=true&f=json')
.then(catchHTTPStatus)
.then(res => res.json())
.then(json => {
  const lastSchoolID = `school_${json.count}`
  const localStorageKeys = Object.keys(localStorage).filter(k => k.substr(0, 7) === 'school_')
  if (localStorageKeys.length < parseInt(json.count-recordsMissingCoordinates, 10) 
    || !localStorage.getItem(lastSchoolID)) {
    fetchInitialStoreData(null) //Some data appears to be missing from localStorage; best fetch all the pages.
  } else {
    localStorageKeys.forEach(localStorageKey => {
      defer(key => {
        const datum = JSON.parse(localStorage.getItem(key))
        tree.insert(datum)
        emitChange()
      }, localStorageKey)
    })
  }
})

export default schoolStore
