import queryPublicSchools from '../actions/queryPublicSchools.js'
import mapStore, { getBoundingBoxOfMap, MAP_STORE_CHANGE_EVENT } from './mapStore.js'
import { throttle, defer } from 'lodash'
import catchHTTPStatus from '../actions/catchHTTPStatus.js'
import querystring from 'querystring'
import turf from 'turf'
import EventEmitter from 'events'
import { GeoStore } from 'terraformer-geostore'
import { RTree } from 'terraformer-rtree'
//import { Memory as MemoryGeoStore } from 'terraformer-geostore-memory'
import { LocalStorage as LocalStorageGeoStore } from './terraformer-geostore-localstorage.js'
export const SCHOOL_STORE_CHANGE_EVENT = 'schoolStore changed.'
const schoolStore = new EventEmitter()
const fetchHistory = {}
const geoStore = new GeoStore({
  store: new LocalStorageGeoStore(),
  index: new RTree()
})
window.geoStore = geoStore
const unthrottledEmitChange = function unthrottledEmitChange() {
  schoolStore.emit(SCHOOL_STORE_CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 100)

function getSchoolsInSomeLeafletBBox(bbox) {
  //const buffer = theBuffer || 0
  const p = new Promise((resolve, reject) => {
    const envelope = turf.envelope(turf.featureCollection([turf.point([bbox._southWest.lng, bbox._southWest.lat]), turf.point([bbox._northEast.lng, bbox._northEast.lat])]))
    geoStore.within(envelope.geometry, (err, res) => {
      if (err) {
        reject(err)
      }
      else if (res) {
        resolve(res)
      }
    })
  })
  return p
}

export function getSchoolsInLeafletBBox(bbox) {
  return getSchoolsInSomeLeafletBBox(bbox)
}
export function getSchoolsInBufferedLeafletBBox(bbox) {
  return getSchoolsInSomeLeafletBBox(bbox)
}

function queryPublicSchoolsInBBox(bbox) {
  const envelopeString = bbox.toBBoxString()
}

mapStore.on(MAP_STORE_CHANGE_EVENT, (mapStoreChange) => {
  const bbox = getBoundingBoxOfMap(mapStoreChange.mapName)
  const envelope = bbox && bbox.toBBoxString ? bbox.toBBoxString() : null
  if (envelope && !fetchHistory[envelope]) queryPublicSchoolsInBBox(bbox)
})

function fetchInitialStoreData(lastOBJECTID) {
  const andWhere = lastOBJECTID ? ` AND OBJECTID > ${lastOBJECTID}` : ''
  const where = `OBJECTID <=100000${andWhere}`
  const qs = querystring.stringify({
    where,
    orderByFields: 'OBJECTID ASC',
    f: 'json',
    outFields: ['OBJECTID', 'School', 'Street', 'City', 'Zip'].join(',')
  })
  fetch(`http://services.gis.ca.gov/arcgis/rest/services/Society/CaliforniaSchools/MapServer/0/query?${qs}`)
  .then(catchHTTPStatus)
  .then(res => res.json())
  .then(json => {
    const exceededTransferLimit = json.exceededTransferLimit
    console.log(json.features.length)
    
    json.features.forEach((feature, ind, features) => {
      const geoFeature = turf.point([feature.geometry.x, feature.geometry.y], {
        id: 'school_' + feature.attributes.OBJECTID,
        objectid: feature.attributes.OBJECTID,
        school: feature.attributes.School,
        street: feature.attributes.Street,
        city: feature.attributes.City
      })
      geoFeature.id = `school_${feature.attributes.OBJECTID}`
      defer((gf, i, arr, etl, OBJECTID) => {
        const localStorageKey = geoStore.store.key(geoFeature.id)
        if (!localStorage.getItem(localStorageKey)) geoStore.add(gf) 
        if (i >= arr.length-1 && etl) {
          fetchInitialStoreData(OBJECTID)
        } else if (!etl) {
          alert('all done: ' + OBJECTID)
          emitChange()
        }
      }, geoFeature, ind, features, exceededTransferLimit, feature.attributes.OBJECTID)
    })
  })
}

fetch('http://services.gis.ca.gov/arcgis/rest/services/Society/CaliforniaSchools/MapServer/0/query?where=OBJECTID+%3C%3D100000&returnCountOnly=true&f=json')
.then(catchHTTPStatus)
.then(res => res.json())
.then(json => {
  let id = geoStore.store.key(`school_${json.count}`)
  if (!localStorage.getItem(id)) {
    console.log(`don't have id ${id}`)
    fetchInitialStoreData(null)
  } else {
    console.log('all here.')
  }
  //fetchInitialStoreData(null, json.maxRecordCount)
})

//fetch last row

//fetchInitialStoreData(null)
export default schoolStore
