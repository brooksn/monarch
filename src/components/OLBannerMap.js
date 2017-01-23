import React, { Component, PropTypes } from 'react'
import OLMap from './OLMap.js'
import OLDrawContainer from './OLDrawContainer.js'
import OLSchoolsCluster from './OLSchoolsCluster.js'
import { basemapKeysArray } from '../esriUtils.js'
import commonCoordinates from '../commonCoordinates.js'
//import mapStore, { getBoundingBoxOfMap, MAP_STORE_CHANGE_EVENT } from '../stores/mapStore.js'
//import schoolStore, { getSchoolsInLeafletBBox, SCHOOL_STORE_CHANGE_EVENT } from '../stores/schoolStore.js'
import AppDispatcher from '../dispatcher/AppDispatcher.js'
import { updateMap, removeMap } from '../actions/ActionCreators.js'

//const style={width: '100%', height: '400px'}
const cities = Object.keys(commonCoordinates)
let cityIndex = 2
while(cityIndex === 2) cityIndex = Math.round(Math.random() * cities.length-1) //Davis is missing schools
const city = cities[cityIndex]
let center = commonCoordinates[city]

export default class OLBannerMap extends Component {
  componentWillUnmount() {
    AppDispatcher.dispatch(removeMap(this.props.mapName))
  }
  render() {
    console.log('center: ')
    console.log(center)
    return (
      <OLMap
        mapName={this.props.mapName}
        onAttributionMayChange={this.onMapChange.bind(this)}
        center={[center[1], center[0]]}
        zoom={8}
        height={256}
      >
        <OLDrawContainer mapName={this.props.mapName} />
        <OLSchoolsCluster mapName={this.props.mapName} />
      </OLMap>
    )
  }
  onMapChange(polygon) {
    const bbox = [
      polygon[0][0],
      polygon[0][1],
      polygon[2][0],
      polygon[2][1]
    ]
    AppDispatcher.dispatch(updateMap(this.props.mapName, bbox))
  }
}

OLBannerMap.propTypes = {
  mapName: PropTypes.string,
  basemapStyle: PropTypes.oneOf(basemapKeysArray).isRequired
}

OLBannerMap.defaultProps = {
  mapName: 'bannermap',
  basemapStyle: 'Streets'
}
