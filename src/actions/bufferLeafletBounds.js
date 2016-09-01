import turf from 'turf'
import leafletBoundingBoxToPolygon from './leafletBoundingBoxToPolygon.js'
export default function bufferLeafletBounds(bbox, miles) {
  const coordinates = leafletBoundingBoxToPolygon(bbox)
  const geoJSON = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates
    }
  }
  return turf.envelope(turf.buffer(geoJSON, miles, 'miles'))
}
