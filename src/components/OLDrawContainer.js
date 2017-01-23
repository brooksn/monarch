import React, { Component, PropTypes } from 'react'
import drawStore, { DRAW_STORE_CHANGE_EVENT } from '../stores/drawStore.js'
import AppDispatcher from '../dispatcher/AppDispatcher.js'
import OLDraw from './OLDraw.js'
import { updatePolygons } from '../actions/ActionCreators.js'

class OLDrawContainer extends Component {
  componentDidMount() {
    console.log('componentDidMount in OLDrawContainer')
    drawStore.on(DRAW_STORE_CHANGE_EVENT, this.onDrawStoreChange)
  }
  componentWillUnmount() {
    drawStore.removeListener(DRAW_STORE_CHANGE_EVENT, this.onDrawStoreChange)
    AppDispatcher.dispatch(updatePolygons(this.props.mapName, []))
  }
  render() {
    return(
      <OLDraw
        onDrawFeaturesChange={this.onDrawFeaturesChange.bind(this)}
      />
    )
  }
  onDrawStoreChange() {}
  onDrawFeaturesChange(features) {
    AppDispatcher.dispatch(updatePolygons(this.props.mapName, features))
  }
}

OLDrawContainer.propTypes = {
  mapName: PropTypes.string.isRequired
}

export default OLDrawContainer;
