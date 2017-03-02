import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import update from 'react-addons-update'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Dropzone from 'react-dropzone'
import { Button } from 'rebass'
import { Box, Flex } from 'reflexbox'
import DraggableGeocoderField from './DraggableGeocoderField.js'
import GeocoderFieldBoxes from './GeocoderFieldBoxes.js'
import csv from 'csv'
import geocoderFieldNames from '../utils/geocoderFieldNames.js'
const geocoderRequestFields = geocoderFieldNames.slice(0,14)
import geocoderStore, { geocodeID, GEOCODER_STORE_CHANGE_EVENT } from '../stores/geocoderStore.js'
import AppDispatcher from '../dispatcher/AppDispatcher.js'
import { createGeocodeJob } from '../actions/ActionCreators.js'

const containerStyle = {
  marginLeft: '2em',
  marginRight: '2em'
}

class CSV extends Component {
  constructor(props) {
    super(props)
    let state = {
      fileID: null,
      csv: null,
      csvErr: false,
      constants: {},
      filename: null,
      jobIDs: []
    }
    geocoderRequestFields.forEach(fieldName => state[fieldName] = null)
    this.state = state
  }
  onGeocoderFieldDrop(item, headerName) {
    const s = {}
    s[headerName] = item.text
    this.setState(s)
  }
  clickRemoveField(field) {
    const s = {}
    s[field] = null
    this.setState(s)
  }
  isDropped(field) {
    if (typeof this.state.fields !== 'object' || Object.keys(this.state.fields).length < 1) {
      return null
    }
    for (const headerName in this.state.fields) {
      if (this.state.fields[headerName]) return headerName
    }
  }
  stringy(str) {
    return typeof str === 'string' && str.length > 3
  }
  canSubmit(st) {
    const state = st || this.state
    let hasSomeAddress = false
    const cultured = this.stringy(state.constants['GeocodeRequest/Culture']) || !!state['GeocodeRequest/Culture']
    if (this.stringy(state.constants['GeocodeRequest/Query']) || state['GeocodeRequest/Query']) hasSomeAddress = true
    if (this.stringy(state.constants['GeocodeRequest/Address/AddressLine']) || state['GeocodeRequest/Address/AddressLine']) hasSomeAddress = true
    return hasSomeAddress && cultured
  }
  onDrop(files) {
    const fileID = (files[0].preview.substr(5, files[0].preview.length) + files[0].size + files[0].lastModified).replace(/[^a-zA-z0-9_-]/g, '')
    const s = {filename: files[0].name, csv: null, fileID}
    geocoderRequestFields.forEach(fieldName => s[fieldName] = null)
    this.setState(s)
    window.theFile = files[0]
    const reader = new FileReader()
    reader.addEventListener("loadend", () => {
      csv.parse(reader.result, (err, data) => {
        if (!err) this.setState({csv: data})
        else this.setState({csvErr: err})
      })
    })
    reader.readAsText(files[0])
  }
  constInputChanged(x) {
    const next = {}
    next[x.target.name] = {$set: x.target.value}
    const constants = update(this.state.constants, next)
    this.setState({constants})
  }
  dataflowText() {
    const indicies = {}
    this.state.csv[0].forEach((fName, index) => indicies[fName] = index)
    let text = 'Bing Spatial Data Services, 2.0\n'
    text += geocoderFieldNames.join(', ')
    for (let index = 1; index < this.state.csv.length; index ++) {
      const row = this.state.csv[index]
      const cellsInRow = []
      geocoderRequestFields.forEach(gField => {
        let val = this.state.constants[gField] || ''
        if (this.state[gField] && typeof indicies[this.state[gField]] === 'number') {
          val = row[indicies[this.state[gField]]]
        } 
        cellsInRow.push(val)
      })
      text += '\n'
      text += cellsInRow.join(',')
    }
    return text
  }
  submitClick() {
    const fields = {}
    geocoderRequestFields.forEach(name => {if (this.state[name]) fields[name] = this.state[name]})
    const action = createGeocodeJob(this.state.fileID, this.state.filename, this.state.csv, this.state.constants, fields)
    AppDispatcher.dispatch(action)
    this.setState(update(this.state, {jobIDs: {$push: [action.data.id]}}))
    //this.context.router.push(`/geocode/${action.data.id}`)
  }
  shouldComponentUpdate(nextProps, nextState) {
    //state.fileID equality
    //state.csv comparative truthiness
    //state[...geocoderFieldNames] equality
    //const cs = this.canSubmit() === this.canSubmit(nextState)
    //console.log('cs: ' + cs)
    //return shallowCompare(this, nextProps, nextState) || !cs
    const fileID = nextState.fileID !== this.state.fileID
    const csvTruthiness = !!nextState.csv !== !!this.state.csv
    const cs = this.canSubmit() !== this.canSubmit(nextState)
    return fileID || csvTruthiness || cs || shallowCompare(this, nextProps, nextState)
  }
  geocoderStoreChanged() {
    const jobIDs = this.state.jobIDs
    const id = Array.isArray(jobIDs) ? geocodeID(jobIDs[(jobIDs.length-1)]) : null
    if (typeof id === 'string' && id.length > 1) this.context.router.push(`/geocode/${id}`)
  }
  componentDidMount() {
    geocoderStore.on(GEOCODER_STORE_CHANGE_EVENT, this.geocoderStoreChanged.bind(this))
  }
  componentWillUnmount() {
    geocoderStore.removeListener(GEOCODER_STORE_CHANGE_EVENT, this.geocoderStoreChanged.bind(this))
  }
  render() {
    const canSubmit = this.canSubmit()
    const fieldStyle={fontSize: '0.5em'}
    const fields = {}
    geocoderRequestFields.forEach(fieldName => fields[fieldName] = this.state[fieldName])
    const csv = this.state.csv
    const header = Array.isArray(csv) && csv.length > 0 ? csv[0] : null
    //<CardImage src="http://placehold.it/256/fdb81e/fff" />
    const geocoderFieldBoxes = (
      <GeocoderFieldBoxes
        constants={this.state.constants}
        fields={fields}
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
    const submitButton = !canSubmit ? null : 
      <Button backgroundColor="primary" color="white" rounded onClick={this.submitClick.bind(this)}>
        Submit
      </Button>
    let dropAreaText = 'To start, drag and drop a csv-formatted text file here.'
    if (this.state.filename) dropAreaText = this.state.csv ? this.state.filename : `Loading ${this.state.filename}`
    return (
      <Flex style={containerStyle} align="flex-start" gutter={3} justify="space-between">
        <Box mt={1} col={3} p={3}>
          <Dropzone style={{minWidth: '100px', minHeight:'100px', maxWidth:'100%', maxHeight:'100%', borderStyle:'dashed', borderWidth:'1px'}} onDrop={this.onDrop.bind(this)}>
            <div>{dropAreaText}</div>
          </Dropzone>
          {submitButton}
          <br />
          <a style={{display:'inline-block'}} href="https://msdn.microsoft.com/en-us/library/jj735477.aspx#Anchor_2">Data definitions</a>
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

CSV.contextTypes = {
  router: React.PropTypes.object
}

export default DragDropContext(HTML5Backend)(CSV)
