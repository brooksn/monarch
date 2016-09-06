import React, { Component, PropTypes } from 'react'
import { DropTarget } from 'react-dnd'
import { Card, Heading, Text } from 'rebass'
import { dragType } from './DraggableGeocoderField.js'

const dragBinTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  }
}

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

class DragBin extends Component {
  render() {
    const { connectDropTarget, field, lastDroppedItem } = this.props
    return connectDropTarget(
      <div>
        <Card rounded width={256}>
          <Text>
            {field.replace(/([\/,])/g, '\n$1')}
          </Text>
          {this.props.children}
        </Card>
      </div>
    )
  }
}

DragBin.propTypes = {
  field: PropTypes.string.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  lastDroppedItem: PropTypes.object,
  onDrop: PropTypes.func.isRequired
}

export default DropTarget(dragType, dragBinTarget, collect)(DragBin)
