const React = require('react')
const ol = require('openlayers')
const once = require('lodash/once')

const OLCluster = React.createClass({
  propTypes: {
    distance: React.PropTypes.number
  },
  getDefaultProps: function getDefaultProps() {
    return {distance: 50}
  },
  contextTypes: {
    map: React.PropTypes.object.isRequired
  },
  getInitialState: function getInitialState(){  
    console.log('props:')
    console.log(this.props)
    this.vectorSource = new ol.source.Vector({
      features: this.props.points
    })
    this.clusterSource = new ol.source.Cluster({
      distance: parseInt(this.props.distance, 10),
      source: this.vectorSource
    })
    let styleCache = {}
    this.clusters = new ol.layer.Vector({
      source: this.clusterSource,
      style: function(feature) {
        let size = feature.get('features').length
        let style = styleCache[size]
        if (!style) {
          style = new ol.style.Style({
            image: new ol.style.Circle({
              radius: 10,
              stroke: new ol.style.Stroke({
                color: '#fff'
              }),
              fill: new ol.style.Fill({
                color: '#3399CC'
              })
            }),
            text: new ol.style.Text({
              text: size.toString(),
              fill: new ol.style.Fill({
                color: '#fff'
              })
            })
          });
          styleCache[size] = style
        }
        return style
      }
    })
    this.onceMapIsReady = once(this.mapIsReady)
    return {}
  },
  componentDidMount: function componentDidMount() {
    console.log('OLCluster componentDidMount')
    this.onceMapIsReady()
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    console.log('nextProps')
    console.log(nextProps)
    console.log(this.vectorSource)
    //this.vectorSource.clear()
    this.vectorSource.addFeatures(nextProps.points)
    return true
  },
  render: function render() {
    return <div style={{display: 'none'}}>{this.props.children}</div>;
  },
  mapIsReady: function mapIsReady() {
    console.log('mapIsReady OLCluster')
    console.log(this.clusters)
    this.context.map.addLayer(this.clusters)
  }
})

module.exports = OLCluster
/*
class OLCluster extends React.Component {
  constructor(props){
    super(props)
    
    this.vectorSource = new ol.source.Vector({
      features: this.props.points
    })
    const clusterSource = new ol.source.Cluster({
      distance: parseInt(this.props.distance, 10),
      source: this.vectorSource
    })
    let styleCache = {}
    this.clusters = new ol.layer.Vector({
      source: clusterSource,
      style: function(feature) {
        let size = feature.get('features').length
        let style = styleCache[size]
        if (!style) {
          style = new ol.style.Style({
            image: new ol.style.Circle({
              radius: 10,
              stroke: new ol.style.Stroke({
                color: '#fff'
              }),
              fill: new ol.style.Fill({
                color: '#3399CC'
              })
            }),
            text: new ol.style.Text({
              text: size.toString(),
              fill: new ol.style.Fill({
                color: '#fff'
              })
            })
          });
          styleCache[size] = style
        }
        return style
      }
    })
    this.onceMapIsReady = once(this.mapIsReady.bind(this))
  }
  componentDidMount() {
    console.log('OLCluster componentDidMount')
    this.onceMapIsReady()
  }
  shouldComponentUpdate(nextProps, nextState) {
    this.vectorSource.clear()
    this.vectorSource.addFeatures(nextProps.points)
    return false
  }
  render() {
    return <div style={{display: 'none'}}>{this.props.children}</div>;
  }
  mapIsReady() {
    this.context.map.addLayer(this.clusters)
  }
}

OLCluster.propTypes = {
  distance: React.PropTypes.number
}
OLCluster.defaultProps = {
  distance: 50
}
OLCluster.contextTypes = {
  map: React.PropTypes.object
}

export default OLCluster;
*/
