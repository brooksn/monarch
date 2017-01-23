import geocoderFieldNames from '../utils/geocoderFieldNames.js'
//const geocoderRequestFields = geocoderFieldNames.slice(0,14)

export function updateMap(mapName, map, changeEvent) {
  if (typeof mapName !== 'string') throw new Error('mapName must be a string. ')
  if (!Array.isArray(map)) throw new Error('map must be an array. ')
  return {
    actionType: 'Map Changed',
    data: {
      mapName,
      map,
      changeEvent
    }
  }
}

export function removeMap(mapName) {
  if (typeof mapName !== 'string') throw new Error('mapName must be a string. ')
  return {
    actionType: 'Map Removed',
    data: {
      mapName
    }
  }
}

export function updatePolygons(mapName, polygons) {
  if (typeof mapName !== 'string') throw new Error('mapName must be a string. ')
  return {
    actionType: 'Polygons changed',
    data: { mapName, polygons }
  }
}

export function createGeocodeJob(fileID, filename, csv, constants, fields) {
  const indicies = {}
  csv[0].forEach((fName, index) => indicies[fName] = index)
  let text = 'Bing Spatial Data Services, 2.0\n'
  text += geocoderFieldNames.join(', ')
  for (let index = 1; index < csv.length; index ++) {
    const row = csv[index]
    const cellsInRow = []
    geocoderFieldNames.forEach(gField => {
      let val = constants[gField] || ''
      if (fields[gField] && typeof indicies[fields[gField]] === 'number') {
        val = row[indicies[fields[gField]]]
      } 
      cellsInRow.push(val)
    })
    text += '\n'
    text += cellsInRow.join(',')
  }
  return {
    actionType: 'Create geocode job',
    data: {
      id: fileID + Date.now(),
      requestText: text,
      description: filename
    }
  }
}
