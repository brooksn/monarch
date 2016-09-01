import { throttle } from 'lodash'
import EventEmitter from 'events'
import AppDispatcher from '../dispatcher/AppDispatcher.js'
//eslint-disable-next-line
const mapStore = new EventEmitter()
export const MAP_STORE_CHANGE_EVENT = 'mapStore changed.'

const maps = {}

const unthrottledEmitChange = function unthrottledEmitChange(e) {
  mapStore.emit(MAP_STORE_CHANGE_EVENT, e)
}
const emitChange = throttle(unthrottledEmitChange, 200)

function removeMap(mapName, changeEvent) {
  if (maps[mapName]) {
    delete maps[mapName]
  }
  emitChange({changeEvent, mapName})
}
function updateMap(mapName, map, changeEvent) {
  if (!maps[mapName]) {
    maps[mapName] = map
    emitChange({changeEvent, mapName})
  } else if (maps[mapName].toBBoxString && maps[mapName].toBBoxString() !== map.toBBoxString()) {
    maps[mapName] = map
    emitChange({changeEvent, mapName})
  }
}

export function getBoundingBoxOfMap(mapName) {
  return maps[mapName]
}

AppDispatcher.register(dispatch => {
  switch (dispatch.actionType) {
    case 'Map Changed':
      updateMap(dispatch.data.mapName, dispatch.data.map, dispatch.data.changeEvent)
      break;
    case 'Map Removed':
      removeMap(dispatch.data.mapName)
      break;
    default:
      break;
  }
})

//Object.freeze(mapStore)
export default mapStore
