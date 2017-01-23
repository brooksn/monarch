import AppDispatcher from '../dispatcher/AppDispatcher.js'
import { throttle } from 'lodash'
import EventEmitter from 'events'
const drawStore = new EventEmitter()
export const DRAW_STORE_CHANGE_EVENT = 'blogStore changed.'

const polygons = {}

const unthrottledEmitChange = function unthrottledEmitChange() {
  drawStore.emit(DRAW_STORE_CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 100)

const updatePolygons = (mapName, polygons) => {
  if (!polygons[mapName]) polygons[mapName] = []
  //const map = polygons[mapName]
  emitChange()
}

export const getPolygons = (mapName) => {
  return polygons[mapName]
}

AppDispatcher.register(dispatch => {
  switch (dispatch.actionType) {
    case 'Polygons changed':
      updatePolygons(dispatch.data.mapName, dispatch.data.polygons)
      //addPolygon(dispatch.data.mapName, dispatch.data.map, dispatch.data.changeEvent)
      break;
    default:
      break;
  }
})

//Object.freeze(drawStore)
export default drawStore
