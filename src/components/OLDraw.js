const React = require('react')
const ol = require('openlayers')
const once = require('lodash/once')

const OLDraw = React.createClass({
  contextTypes:  {
    map: React.PropTypes.object.isRequired
  },
  propTypes: {
    onDrawFeaturesChange: React.PropTypes.func
  },
  getInitialState: function getInitialState(props){
    this.drawFeatures = new ol.Collection()
    this.drawSource = new ol.source.Vector({wrapX: false, features: this.drawFeatures})
    this.drawFeatureOverlay = new ol.layer.Vector({
      source: this.drawSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(255, 255, 255, 0.2)'}),
        stroke: new ol.style.Stroke({color: '#ffcc33', width: 2}),
        image: new ol.style.Circle({radius: 7, fill: new ol.style.Fill({color: '#ffcc33'})})
      })
    })
    this.drawInteraction = new ol.interaction.Draw({source: this.drawSource, type: 'Polygon', maxPoints: 10})
    this.drawInteraction.set('interactionName', 'drawPolygon')
    this.drawFeaturesChangeEventKey = this.drawFeatures.on('change', this.onDrawFeaturesChange)
    this.drawFeaturesAddEventKey = this.drawFeatures.on('add', this.onDrawFeaturesChange)
    this.drawFeaturesRemoveEventKey = this.drawFeatures.on('remove', this.onDrawFeaturesChange)
    this.mapIsReadyOnce = once(this.mapIsReady)
    return {}
  },
  componentDidMount: function componentDidMount() {
    this.mapIsReadyOnce()
  },
  componentWillUnmount: function componentWillUnmount() {
    this.drawFeatures.unByKey(this.drawFeaturesChangeEventKey)
    this.drawFeatures.unByKey(this.drawFeaturesAddEventKey)
    this.drawFeatures.unByKey(this.drawFeaturesRemoveEventKey)
  },
  render: function render() {
    return React.createElement('div', {style:{display:'none'}}, this.props.children)
  },
  onDrawFeaturesChange() {
    if (this.props.onDrawFeaturesChange && typeof this.props.onDrawFeaturesChange === 'function') {
      this.props.onDrawFeaturesChange(this.drawFeatures.getArray())
    }
  },
  mapIsReady: function mapIsReady() {
    const buttons = [
      this.buttonMaker({label: '✎', onClick: this.polygonButtonClickTouch}),
      this.buttonMaker({label: '♻', onClick: this.recycleButtonClickTouch})
    ]
    buttons.map((element, i) => new ol.control.Control({element}))
    const controls = ol.control.defaults().extend(buttons.map((element, i) => {
      element.style.top = `${65 + (i*30)}px`
      return new ol.control.Control({element})
    }))
    controls.forEach(control => this.context.map.addControl(control))
    this.context.map.addLayer(this.drawFeatureOverlay)
  },
  polygonButtonClickTouch: function polygonButtonClickTouch() {
    let drawPolygonActive = false
    this.context.map.getInteractions().forEach(interaction => {
      if (interaction.get('interactionName') === 'drawPolygon') drawPolygonActive = true
    })
    if (drawPolygonActive === true) this.context.map.removeInteraction(this.drawInteraction)
    else this.context.map.addInteraction(this.drawInteraction)
  },
  recycleButtonClickTouch: function recycleButtonClickTouch() {
    this.drawFeatures.clear()
  },
  buttonMaker: function buttonMaker(opts) {
    const button = document.createElement('button')
    button.innerHTML = opts.label
    const buttonElement = document.createElement('div')
    buttonElement.className = 'rotate-north ol-unselectable ol-control'
    buttonElement.appendChild(button)
    buttonElement.addEventListener('click', opts.onClick, false);
    buttonElement.addEventListener('touchstart', opts.onClick, false)
    return buttonElement
  }
})
/*
class OLDraw extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
    this.drawFeatures = new ol.Collection()
    this.drawSource = new ol.source.Vector({wrapX: false, features: this.drawFeatures})
    this.drawFeatureOverlay = new ol.layer.Vector({
      source: this.drawSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(255, 255, 255, 0.2)'}),
        stroke: new ol.style.Stroke({color: '#ffcc33', width: 2}),
        image: new ol.style.Circle({radius: 7, fill: new ol.style.Fill({color: '#ffcc33'})})
      })
    })
    this.drawInteraction = new ol.interaction.Draw({source: this.drawSource, type: 'Polygon', maxPoints: 10})
    this.drawInteraction.set('interactionName', 'drawPolygon')
    //this.onDrawFeaturesChange = this.onDrawFeaturesChange.bind(this)
    this.drawFeaturesChangeEventKey = this.drawFeatures.on('change', this.onDrawFeaturesChange.bind(this))
    this.drawFeaturesAddEventKey = this.drawFeatures.on('add', this.onDrawFeaturesChange.bind(this))
    this.drawFeaturesRemoveEventKey = this.drawFeatures.on('remove', this.onDrawFeaturesChange.bind(this))
    this.mapIsReadyOnce = once(this.mapIsReady)
  }
  componentDidMount() {
    this.mapIsReadyOnce()
  }
  componentWillUnmount() {
    this.drawFeatures.unByKey(this.drawFeaturesChangeEventKey)
    this.drawFeatures.unByKey(this.drawFeaturesAddEventKey)
    this.drawFeatures.unByKey(this.drawFeaturesRemoveEventKey)
  }
  render() {
    return React.createElement('div', {style:{display:'none'}}, this.props.children)
    //return (<div style={{display: 'none'}}>{this.props.children}</div>;
  }
  onDrawFeaturesChange() {
    if (this.props.onDrawFeaturesChange && typeof this.props.onDrawFeaturesChange === 'function') {
      this.props.onDrawFeaturesChange(this.drawFeatures.getArray())
    }
  }
  mapIsReady() {
    const buttons = [
      this.buttonMaker({label: '✎', onClick: this.polygonButtonClickTouch}),
      this.buttonMaker({label: '♻', onClick: this.recycleButtonClickTouch})
    ]
    buttons.map((element, i) => new ol.control.Control({element}))
    const controls = ol.control.defaults().extend(buttons.map((element, i) => {
      element.style.top = `${65 + (i*30)}px`
      return new ol.control.Control({element})
    }))
    controls.forEach(control => this.context.map.addControl(control))
    this.context.map.addLayer(this.drawFeatureOverlay)
  }
  polygonButtonClickTouch() {
    let drawPolygonActive = false
    this.context.map.getInteractions().forEach(interaction => {
      if (interaction.get('interactionName') === 'drawPolygon') drawPolygonActive = true
    })
    if (drawPolygonActive === true) this.context.map.removeInteraction(this.drawInteraction)
    else this.context.map.addInteraction(this.drawInteraction)
  }
  recycleButtonClickTouch() {
    this.drawFeatures.clear()
  }
  buttonMaker(opts) {
    const button = document.createElement('button')
    button.innerHTML = opts.label
    const buttonElement = document.createElement('div')
    buttonElement.className = 'rotate-north ol-unselectable ol-control'
    buttonElement.appendChild(button)
    buttonElement.addEventListener('click', opts.onClick.bind(this), false);
    buttonElement.addEventListener('touchstart', opts.onClick.bind(this), false)
    return buttonElement
  }
}

OLDraw.propTypes = {
  onDrawFeaturesChange: React.PropTypes.func
}

OLDraw.contextTypes = {
  map: React.PropTypes.object
}

export default OLDraw;
*/
module.exports = OLDraw
