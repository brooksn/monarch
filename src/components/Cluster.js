/* global L:false */
/* eslint-disable no-restricted-syntax, no-labels, guard-for-in */
import { PropTypes } from 'react';
import { PropTypes as LeafletPropTypes, Marker } from 'react-leaflet'
import 'leaflet.markercluster'
import { intersection, pullAll } from 'lodash'
const clusterIconHTML = count => `<div style="position:absolute;left:-50%;top:-50%;line-height:30px;text-align:center;width:30px;height:30px;border-style:solid;border-width:3px;border-color:white;border-radius:50%;background-color:gold;color:white;">${count}</div>`

export default class Cluster extends Marker {
  componentWillMount() {
    this.leafletElement = L.markerClusterGroup({
      chunkedLoading: true,
      iconCreateFunction: cluster => L.divIcon({ html: clusterIconHTML(cluster.getChildCount())})
    })
    const markers = this.props.data
    .map(datum => {
      const m = L.marker([datum.geometry.coordinates[1], datum.geometry.coordinates[0]], 
       {
         title: datum.properties.school, 
         id: datum.id
       })
      m.bindPopup(datum.properties.school)
      return m
    })
    this.leafletElement.addLayers(markers)
    this.context.map.addLayer(this.leafletElement)
  }

  componentDidUpdate(prevProps) {
    //this.context.map.removeLayer(this.leafletElement)
    const clusterIDs = this.leafletElement.getLayers().map(newclass => newclass.options.id)
    let currNotInLayer = []
    if (Array.isArray(prevProps.data) && Array.isArray(this.props.data)) {
      const currIDs = this.props.data.map(datum => datum.id)
      const commonIDs = intersection(clusterIDs, currIDs)
      currNotInLayer = pullAll(currIDs, commonIDs)
    }
    const markers = this.props.data
    .filter(datum => {
      return currNotInLayer.indexOf(datum.id) >= 0
    })
    .map(datum => {
      const m = L.marker([datum.geometry.coordinates[1], datum.geometry.coordinates[0]], 
       {
         title: datum.properties.school, 
         id: datum.id
       })
      m.bindPopup(datum.properties.school)
      return m
    })
    //this.leafletElement.removeLayers(prevNotInCurr)
    this.leafletElement.addLayers(markers)
  }
  componentWillUnmount() {
    if (this.context.map && this.leafletElement) this.context.map.removeLayer(this.leafletElement)
  }
}

Cluster.propTypes = {
  data: PropTypes.array.isRequired
}

Cluster.contextTypes = {
  map: LeafletPropTypes.map
}
