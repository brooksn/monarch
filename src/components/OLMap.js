import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers'

class App extends Component {
  componentDidMount() {
    this.map = new ol.Map({
      target: ReactDOM.findDOMNode(this).parentNode,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.TileArcGISRest()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
      })
    })
  }
  componentWillUnmount() {
    this.map.target = null
    delete this.map
  }
  render() {
    return <div style={{display: 'none'}}>{this.props.children}</div>;
  }
}

export default App;
