import React from 'react'
import { debounce, isEqualWith } from 'lodash'
//import Cluster from './Cluster.js'
import { FeatureGroup, Map, TileLayer } from 'react-leaflet'
import EditControl from '../EditControl.js'
import { basemaps, getAttributionData, updateMapAttribution } from '../esri-utils.js'
import mapStore, { getBoundingBoxOfMap, MAP_STORE_CHANGE_EVENT } from '../stores/mapStore.js'
import schoolStore, { getSchoolsInLeafletBBox, SCHOOL_STORE_CHANGE_EVENT } from '../stores/schoolStore.js'
import AppDispatcher from '../dispatcher/AppDispatcher.js'
import { updateMap, removeMap } from '../actions/ActionCreators.js'
import commonCoordinates from '../commonCoordinates.js'
const style={width: '100%', height: '400px'}
//const center=[lat,lng]
const cities = Object.keys(commonCoordinates)
let cityIndex = 2
while(cityIndex === 2) cityIndex = Math.round(Math.random() * cities.length-1) //Davis is missing schools
const city = cities[cityIndex]
let center = commonCoordinates[city]
let polyline //eslint-disable-line

export default class BannerMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      schools: []
    }
    this.debouncedUpdateStateFromSchoolStore = debounce(this.updateStateFromSchoolStore.bind(this), 200)
  }
  _onEditPath(e) {
    console.log("Path edited !");
  }

  _onCreate(e) {
    polyline = e.layer;
    console.log(polyline)
    // To edit this polyline call : polyline.handler.enable()
    console.log("Path created !");
  }
  onDeleteStart(e) {
    console.log('onDeleteStart: ')
    console.log(e)
  }
  onDeleteStop(e) {
    console.log('onDeleteStop: ')
    console.log(e)
  }
  _onDeleted(e) {
    console.log(e)
    console.log('Path deleted !')
  }

  _mounted(drawControl) {

  }
  mapOnAdd(e) {
    if (e.layer.options && e.layer.options.attributionUrl) {
      getAttributionData(e.layer.options.attributionUrl, e.target)
      AppDispatcher.dispatch(updateMap(this.props.mapName, e.target.getBounds(), e))
    }
  }
  mapOnMoveEnd(e) {
    AppDispatcher.dispatch(updateMap(this.props.mapName, e.target.getBounds(), e))
  }
  updateStateFromSchoolStore() {
    const bbox = getBoundingBoxOfMap(this.props.mapName)
    if (bbox) {
      getSchoolsInLeafletBBox(bbox)
      .then(res => {
        this.setState({schools: res})
      })
    }
  }
  mapStoreChange(ms) {
    if (getBoundingBoxOfMap(this.props.mapName)) {
      if (ms.changeEvent.type !== 'layeradd') updateMapAttribution(ms.changeEvent)
    }
  }
  componentDidMount() {
    mapStore.on(MAP_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
    schoolStore.on(SCHOOL_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
  }
  componentWillUnmount() {
    AppDispatcher.dispatch(removeMap(this.props.mapName))
    mapStore.removeListener(MAP_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
    schoolStore.removeListener(SCHOOL_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (Array.isArray(nextState.schools)) {
      return !isEqualWith(nextState.schools, this.state.schools, (a,b) => {
        if (typeof a.id === 'undefined' || typeof b.id === 'undefined') return false
        return a.id === b.id
      })
    }
    return true
  }
  render() {
    /*
    const clusterable = this.state.schools.map(feature => {
      return {
        position: {lat: feature.geometry.x, lng: feature.geometry.y},
        text: feature.attributes.School
      }
    })
    */
/*
    const schools = clone(this.state.schools)
    const clusters = []
    const bounds = getBoundingBoxOfMap(this.props.mapName)
    if (bounds) {
      const sw = [bounds._southWest.lng, bounds._southWest.lat]
      const ne = [bounds._northEast.lng, bounds._northEast.lat]
      const env = turf.envelope(turf.featureCollection([turf.point(sw), turf.point(ne)]))
      const envArea = turf.area(env)
      const grid = turf.squareGrid(bounds.toBBoxString(), Math.sqrt(envArea)/6, 'meters')
      
    }
*/
/*
    const schoolsGeoJSON = turf.featureCollection(this.state.schools.map(feature => {
      return turf.point([feature.geometry.x, feature.geometry.y])
    }))
    const numberOfSchools = this.state.schools.length || 0
    const markers = this.state.schools
    .filter(() => Math.random() < 40/numberOfSchools)
    .map(feature => {
      return <Marker opacity={Math.random()} key={feature.attributes.School + feature.geometry.x} position={[feature.geometry.y, feature.geometry.x]}></Marker>
    })*/
    //var mkrs = L.markerClusterGroup();
    //mkrs.addLayer(L.marker([this.state.schools[0].geometry.x, this.state.schools[0].geometry.y]));
    
    //this.map.addLayer(mkrs);
    //const cluster = <Cluster data={this.state.schools} />
    const cluster = null
    return (
      <Map center={center} zoom={13} zoomControl={true} 
        style={style}
        maxZoom={15}
        onMoveend={this.mapOnMoveEnd.bind(this)}
        onLayeradd={this.mapOnAdd.bind(this)}
      >
        <TileLayer
          url={basemaps.TILES[this.props.basemapStyle].urlTemplate}
          attribution={'<span class="esri-attributions"></span>'}
          attributionUrl={basemaps.TILES[this.props.basemapStyle].options.attributionUrl}
          subdomains={basemaps.TILES[this.props.basemapStyle].options.subdomains}
        />
      {cluster}
        <FeatureGroup>
          <EditControl
            position='topright'
            onEdited={this._onEditPath}
            onCreated={this._onCreate}
            onDeleted={this._onDeleted}
            onMounted={this._mounted}
            onDeleteStart={this.onDeleteStart}
            onDeleteStop={this.onDeleteStop}
          />
        </FeatureGroup>
      </Map>
    )
  }
}

BannerMap.defaultProps = {
  mapName: 'bannermap',
  basemapStyle: 'Streets'
}
