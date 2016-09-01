export default function leafletBoundingBoxToPolygon(bbox) {
  return [[
    [bbox._southWest.lng, bbox._southWest.lat],
    [bbox._southWest.lng, bbox._northEast.lat],
    [bbox._northEast.lng, bbox._northEast.lat],
    [bbox._northEast.lng, bbox._southWest.lat],
    [bbox._southWest.lng, bbox._southWest.lat]
  ]]
}
