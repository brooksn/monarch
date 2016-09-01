export function updateMap(mapName, map, changeEvent) {
  if (typeof mapName !== 'string') throw new Error('mapName must be a string. ')
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
