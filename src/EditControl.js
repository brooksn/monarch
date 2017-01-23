/* global L:false */
import { PropTypes } from 'react';
import Draw from 'leaflet-draw'; // eslint-disable-line
import { LayersControl } from 'react-leaflet';
export default class EditControl extends LayersControl {
  static propTypes = {
    onCreated: PropTypes.func,
    onEdited: PropTypes.func,
    onDeleted: PropTypes.func,
    onMounted: PropTypes.func,
    draw: PropTypes.object,
    position: PropTypes.string
  }
  componentWillMount() {
    const {
      onCreated,
      onDeleted,
      onMounted,
      onEdited,
      draw,
      position
    } = this.props;

    const { map, layerContainer } = this.context;

    let options = {
      edit: {
        featureGroup: layerContainer
      }
    };

    if(draw) options.draw = draw;
    if(position) options.position = position;

    this.leafletElement = new L.Control.Draw(options);
    window.EditControl = this.leafletElement
    if(typeof onMounted === "function") {
      onMounted(this.leafletElement);
    }

    map.on('draw:created', (e) => {
      layerContainer.addLayer(e.layer)
      //eslint-disable-next-line
      onCreated && onCreated.call(null, e)
    });

    map.on('draw:edited', onEdited);
    map.on('draw:deleted', onDeleted);
    if (this.props.onDeleteStart) map.on('draw:deletestart', this.props.onDeleteStart)
    if (this.props.onDeleteStop) map.on('draw:deletestop', this.props.onDeleteStop)
  }
}
