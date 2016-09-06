import React, { Component } from 'react'
import { Card, Close, Input, Text } from 'rebass'
import DragBin from './DragBin.js'
import geocoderFieldNames from '../utils/geocoderFieldNames.js'

const fieldStyle={
  fontSize: '0.5em'
}

export default class GeocoderFieldBoxes extends Component {
  render() {
    const geocoderFieldBoxes = geocoderFieldNames.map(field => {
      const fieldCard = (
        <Card>
          <Text style={fieldStyle}>{this.props.fields[field]}</Text>
          <Close onClick={() => this.props.onClickRemoveField(field)} />
        </Card>
      )
      const fieldInput = (<Input name={field} onChange={this.props.constInputChanged} value={this.props.constants[field] || ''} placeholder="Drag a row name or type a constant" label="" style={fieldStyle} />)
      return (
        <DragBin style={{display:'inline-block'}} key={`DragBin-${field}`} 
          field={field} 
          onDrop={(item) => this.props.onDrop(item, field)} 
        >
          {this.props.fields[field] ? fieldCard : fieldInput}
        </DragBin>
      )
    })

    return (
      <div>{geocoderFieldBoxes}</div>
    )
  }
}
