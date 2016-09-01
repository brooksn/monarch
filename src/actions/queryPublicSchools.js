import 'whatwg-fetch'
import catchHTTPStatus from './catchHTTPStatus.js'
export default function queryPublicSchools(bbox) {
  return fetch(`http://services.gis.ca.gov/arcgis/rest/services/Society/CaliforniaSchools/MapServer/0/query?where=OBJECTID%3C%3D10000&text=&objectIds=&time=&geometry=${bbox}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelContains&relationParam=&outFields=OBJECTID%2C+School%2C+Street%2C+City%2C+Zip%2C+State&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=json`).then(catchHTTPStatus).then(res => res.json())
}
