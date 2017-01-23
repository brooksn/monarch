import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import fetch from 'node-fetch'
import catchHTTPStatus from '../actions/catchHTTPStatus.js'
import ol from 'openlayers'
import { basemaps, basemapKeys, basemapKeysArray } from '../esriUtils.js'
import url from 'url'
const ports = {'http:': 80, 'https:': 443}
const EPSG4326 = 'EPSG:4326'
const EPSG3857 = 'EPSG:3857'

class OLMap extends Component {
  constructor(props){
    super(props)
    this.map = {}
    this.state = {
      hasMap: false,
      mapExtentAttributes: []
    }
    
    window.ol = ol
    //window.drawFeatures = this.drawFeatures
    this.esriBasemap = basemaps.TILES[props.esriBasemapName]
    
    
    
    
    
    
    
    const urls = this.esriBasemap.options.subdomains.map(subdomain => this.esriBasemap.urlTemplate.replace(/{s}/, subdomain))
    this.defaultBasemapAttribution = new ol.Attribution({
      html: `<a href="${this.esriBasemap.options.attributionUrl || 'http://www.esri.com/'}">${this.esriBasemap.options.attribution}</a>`
    })
    this.basemapLayerSource = new ol.source.XYZ({
      urls,
      //wrapX: false,
      attributions: [this.defaultBasemapAttribution]
    })
    this.basemapLayer = new ol.layer.Tile({
      source: this.basemapLayerSource
    })


    this.map = new ol.Map({
      //target: ReactDOM.findDOMNode(this),
      layers: [this.basemapLayer],
      interactions: ol.interaction.defaults({
        mouseWheelZoom: false,
        dragPan: true
      }),
      view: new ol.View({
        center: ol.proj.fromLonLat(this.props.center),
        zoom: this.props.zoom
      })
    })
    /*
    this.map.getInteractions().forEach(i => {
      if (i instanceof ol.interaction.DragPan)
    })
    */
    //window.drawInteraction = this.drawInteraction
    //this.map.addOverlay(drawFeatureOverlay)
    
    this.mapMoveEndEventKey = this.map.on('moveend', this.onMapMoveEnd.bind(this))
    window.map = this.map
    window.basemapLayer = this.basemapLayer
    window.basemapLayerSource = this.basemapLayerSource
    this.view = this.map.getView()
    if (this.esriBasemap.options.cachedAttributionData) {
      this.spatialAttribution = this.esriBasemap.options.cachedAttributionData
      //this.calculateAttribution()
    } else if (process.env.NODE_ENV !== 'development' && this.esriBasemap.options.attributionUrl !== 'hi') {
      const attrUrlObj = url.parse(this.esriBasemap.options.attributionUrl)
      attrUrlObj.port = ports[attrUrlObj.protocol]
      attrUrlObj.host = `${attrUrlObj.host}:${attrUrlObj.port}`
      const attrUrl = attrUrlObj.format()
      fetch(attrUrl)
      .then(catchHTTPStatus)
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json.contributors)) {
          this.spatialAttribution = json
          this.spatialAttribution.projection = EPSG4326
        }
        this.calculateAttribution()
      })
    }
    //this.setState({hasMap: true})
    
    
    
    
    
    
    
    
  }
  getChildContext() {
    return {map: this.map};
  }
  componentDidMount() {
    this.map.setTarget(ReactDOM.findDOMNode(this))
    this.calculateAttribution()
  }
  onMapMoveEnd() {
    this.calculateAttribution()
    
  }
  calculateAttribution() {
    const mapProjection = this.view.getProjection() || EPSG3857
    const e = this.view.calculateExtent(this.map.getSize())
    if (mapProjection === EPSG3857 || (mapProjection.getCode && mapProjection.getCode() === EPSG3857)) {
      const numberOfRevolutions = Math.floor((e[0] / 40075016.68) + 0.5)
      const offset = numberOfRevolutions * 20037508.34 * 2 * -1
      e[0] += offset
      e[2] += offset
    }
    const extent = ol.proj.transformExtent(e, mapProjection, this.spatialAttribution.projection || EPSG4326)
    const polygon = ol.geom.Polygon.fromExtent(extent)
    const zoom = this.view.getZoom()
    if (typeof this.props.onAttributionMayChange === 'function') {
      window.thePolygon = polygon
      window.somebbox = [polygon.getLinearRing().getCoordinates()[0], polygon.getLinearRing().getCoordinates()[2]]
      this.props.onAttributionMayChange(polygon.getLinearRing().getCoordinates())
    }
    if (this.spatialAttribution) {
      const intersectingAttributions = []
      this.spatialAttribution.contributors.forEach(contributor => {
        let contributed = false
        for (let i in contributor.coverageAreas) { //eslint-disable-line
          const bbox = [contributor.coverageAreas[i].bbox[1], contributor.coverageAreas[i].bbox[0], contributor.coverageAreas[i].bbox[3], contributor.coverageAreas[i].bbox[2]]
          if (polygon.intersectsExtent(bbox) && zoom >= (contributor.coverageAreas[i].zoomMin || -1) && zoom <= (contributor.coverageAreas[i].zoomMax || 99 )) {
            contributed = true
            break;
          }
        }
        if (contributed === true) {
          intersectingAttributions.push(contributor.attribution)
        }
      })
      this.setState({mapExtentAttributes: intersectingAttributions})
    }
  }
  componentWillUnmount() {
    this.map.unByKey(this.mapMoveEndEventKey)
    this.map.target = null
    delete this.map
  }
  shouldComponentUpdate(nextProps, nextState) {
    const newAttributions = nextState.mapExtentAttributes.length > 0 ? nextState.mapExtentAttributes.map(html => new ol.Attribution({html}))
     : [this.defaultBasemapAttribution]
    this.basemapLayerSource.setAttributions(newAttributions)
    if (this.state.hasMap !== nextState.hasMap) return true
    return false
  }
  render() {
    /*
    const children = React.Children
      .map(this.props.children, child => {
        return React.cloneElement(child, {
          map: this.map,
          mapName: this.props.mapName
        })
      })
    */
    return (
      <div 
        style={{
        height: this.props.height
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

OLMap.propTypes = {
  mapName: PropTypes.string.isRequired,
  esriBasemapName: PropTypes.oneOf(basemapKeysArray),
  center: PropTypes.array,
  zoom: PropTypes.number,
  onAttributionMayChange: PropTypes.func,
  height: PropTypes.number
}

OLMap.defaultProps = {
  esriBasemapName: basemapKeys.Topographic,
  center: [37.41, 8.82],
  zoom: 4
}

OLMap.childContextTypes = {
  map: React.PropTypes.object
}

export default OLMap;
