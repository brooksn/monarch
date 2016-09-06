import React, { Component, PropTypes } from 'react'
import { DragSource } from 'react-dnd'
import { Card, Heading, Text } from 'rebass'
export const dragType = 'draggableGeocoderField'
const dragSource = {
  beginDrag(props) {
    return {
      text: props.text
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class DraggableGeocoderField extends Component {
  render() {
    const { isDragging, connectDragSource, text } = this.props
    const opacity = isDragging ? 0.5 : 1
    return connectDragSource(
      <div>
        <Card style={{opacity, padding:'0.2em', marginBottom:'0.3em'}} rounded>
          <Text style={{fontSize:'smaller'}}>
            {text.replace(/([\/,])/g, '\n$1')}
          </Text>
        </Card>
      </div>
    )
  }
}

DraggableGeocoderField.propTypes = {
  text: PropTypes.string.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
}

export default DragSource(dragType, dragSource, collect)(DraggableGeocoderField)
