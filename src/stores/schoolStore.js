import queryPublicSchools from '../actions/queryPublicSchools.js'
import mapStore, { getBoundingBoxOfMap, MAP_STORE_CHANGE_EVENT } from './mapStore.js'
import { throttle, defer } from 'lodash'
import catchHTTPStatus from '../actions/catchHTTPStatus.js'
import turf from 'turf'
import EventEmitter from 'events'
import { GeoStore } from 'terraformer-geostore'
import { RTree } from 'terraformer-rtree'
import { Memory as MemoryGeoStore } from 'terraformer-geostore-memory'
export const SCHOOL_STORE_CHANGE_EVENT = 'schoolStore changed.'
const schoolStore = new EventEmitter()
const fetchHistory = {}
const geoStore = new GeoStore({
  store: new MemoryGeoStore(),
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
  fetchHistory[envelopeString] = {status: 'pending'}
  if (!fetchHistory[envelopeString]) {
    //new query.
  } else if (fetchHistory[envelopeString].status === 'pending') {
    //do nothing.
  } else {
    //emit change()
  }
  return queryPublicSchools(envelopeString)
  .then(catchHTTPStatus)
  .then(json => {
    if (json.features) {
      json.features.forEach((feature, ind, features) => {
        const geoFeature = turf.point([feature.geometry.x, feature.geometry.y], {
          id: 'school_' + feature.attributes.OBJECTID,
          objectid: feature.attributes.OBJECTID,
          school: feature.attributes.School,
          street: feature.attributes.Street,
          city: feature.attributes.City
        })
        geoFeature.id = 'school_' + feature.attributes.OBJECTID
        defer((gf, i, arr) => {
          //const lsKey = geoStore.store.key(geoFeature.id)
          if (!geoStore.store.data[geoFeature.id]) {
            geoStore.add(gf, (err, res) => {
              if (i >= arr.length-1) {
                fetchHistory[envelopeString].status = 'completed'
                emitChange()
              }
            })
          } else if (i >= arr.length-1) {
            fetchHistory[envelopeString].status = 'completed'
            emitChange()
          }
        }, geoFeature, ind, features)
      })
    }
  })
}

mapStore.on(MAP_STORE_CHANGE_EVENT, (mapStoreChange) => {
  const bbox = getBoundingBoxOfMap(mapStoreChange.mapName)
  const envelope = bbox && bbox.toBBoxString ? bbox.toBBoxString() : null
  if (envelope && !fetchHistory[envelope]) queryPublicSchoolsInBBox(bbox)
})

//queryPublicSchoolsInBBox('')

//Object.freeze(schoolStore)
export default schoolStore
