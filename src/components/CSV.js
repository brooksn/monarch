import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Dropzone from 'react-dropzone'
import { Box, Flex } from 'reflexbox'
import { Card, Close, Input, Text } from 'rebass'
import DraggableGeocoderField from './DraggableGeocoderField.js'
import DragBin from './DragBin.js'
import GeocoderFieldBoxes from './GeocoderFieldBoxes.js'


const containerStyle = {
  marginLeft: '2em',
  marginRight: '2em'
}

class CSV extends Component {
  constructor(props) {
    super(props)
    this.state = {
      csv: [],
      fields: {},
      constants: {}
    }
    /*
    this.geocoderFields = geocoderFieldNames
    .map(field => (<DraggableGeocoderField 
      key={`dgf-${field}`} 
      text={field} 
      isDropped={this.isDropped.bind(this)}
    />))
    */
  }
  onGeocoderFieldDrop(item, headerName) {
    console.log('onGeocoderFieldDrop!')
    console.log(item)
    console.log(headerName)
    const fields = this.state.fields
    fields[headerName] = item.text
    this.setState({fields})
  }
  clickRemoveField(field) {
    console.log('clicked ' + field)
    const fields = this.state.fields
    delete this.state.fields[field]
    this.setState({fields})
  }
  isDropped(field) {
    if (typeof this.state.fields !== 'object' || Object.keys(this.state.fields).length < 1) {
      return null
    }
    for (const headerName in this.state.fields) {
      if (this.state.fields[headerName]) return headerName
    }
  }
  canSubmit() {
    const fields = this.state.fields
    let id = false
    console.log(this.headersToSend())
  }
  onDrop(files) {
    window.theFile = files[0]
    console.log(files[0])
    const reader = new FileReader()
    reader.addEventListener("loadend", () => {
      console.log(reader.result)
      const csv = reader.result.split('\n')
      csv.forEach((val, ind) => csv[ind] = val.split(','))
      const header = csv[0]
      console.log(header)
      this.setState({csv})
    })
    reader.readAsText(files[0])
  }
  constInputChanged(x) {
    const constants = this.state.constants || {}
    constants[x.target.name] = x.target.value
    this.setState({constants})
    this.canSubmit()
  }
  headersToSend() {
    const originalHeaders = this.state.csv[0]
    const fields = this.state.fields
    const constants = this.state.constants
    const headersToSend = originalHeaders.map(header => fields[header] || constants[header] || header)
    return headersToSend
  }
  render() {
    const fieldStyle={
      fontSize: '0.5em'
    }
    const csv = this.state.csv
    const header = csv[0]
    //<CardImage src="http://placehold.it/256/fdb81e/fff" />
    /*
    const csvFieldBoxes = !Array.isArray(header) ? null : header.map(field => {
      const fieldCard = (
        <Card>
          <Text style={fieldStyle}>{this.state.fields[field]}</Text>
          <Close onClick={() => this.clickRemoveField(field)} />
        </Card>
      )
      const fieldInput = (<Input name={field} onChange={this.constInputChanged.bind(this)} value={this.state.constants[field] || ''} placeholder="Drag a field or type a constant" label="" style={fieldStyle} />)
      return (
        <DragBin style={{display:'inline-block'}} key={`DragBin-${field}`} 
          field={field} 
          onDrop={(item) => this.onGeocoderFieldDrop(item, field)} 
        >
          {this.state.fields[field] ? fieldCard : fieldInput}
        </DragBin>
      )
    })
    */
    const geocoderFieldBoxes = (
      <GeocoderFieldBoxes
        constants={this.state.constants}
        fields={this.state.fields}
        constInputChanged={this.constInputChanged.bind(this)}
        onDrop={this.onGeocoderFieldDrop.bind(this)} 
        onClickRemoveField={this.clickRemoveField.bind(this)}
      />
    )
    const csvFieldBoxes = !Array.isArray(header) ? null : header.map(field => (<DraggableGeocoderField 
      key={`cfb-${field}`} 
      text={field} 
      isDropped={this.isDropped.bind(this)}
    />))
    return (
      <Flex style={containerStyle} align="flex-start" gutter={3} justify="space-between">
        <Box mt={1} col={3} p={3}>
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <div>To start, drag and drop a csv-formatted text file here.</div>
          </Dropzone>
        </Box>
        <Box col={6} p={3} >
          {csvFieldBoxes}
        </Box>
        <Box mt={1} col={3} p={3}>
          {!csvFieldBoxes ? null : geocoderFieldBoxes}
        </Box>
      </Flex>
    )
  }
}

export default DragDropContext(HTML5Backend)(CSV)
