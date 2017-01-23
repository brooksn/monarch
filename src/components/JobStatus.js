import React, { Component } from 'react'
import { TrafficLight } from 'react-trafficlight'
import { ButtonCircle } from 'rebass'
import { Box, Flex } from 'reflexbox'
import Icon from 'react-geomicons'
import shallowCompare from 'react-addons-shallow-compare'
import geocoderStore, { GEOCODER_STORE_CHANGE_EVENT, downloadLink, getStatus, Status } from '../stores/geocoderStore.js'

const containerStyle = {
  marginLeft: '2em',
  marginRight: '2em'
}

export default class JobStatus extends Component {
  constructor(props) {
    super(props)
    this.jobID = this.props.params.id
    const statusObject = getStatus(this.jobID)
    this.state = {
      status: statusObject.status,
      statusObject
    }
  }
  geocoderStoreChanged() {
    console.log('geocoderStoreChanged!')
    const statusObject = getStatus(this.jobID)
    this.setState({status: statusObject.status, statusObject})
  }
  componentDidMount() {
    geocoderStore.on(GEOCODER_STORE_CHANGE_EVENT, this.geocoderStoreChanged.bind(this))
  }
  componentWillUnmount() {
    geocoderStore.removeListener(GEOCODER_STORE_CHANGE_EVENT, this.geocoderStoreChanged.bind(this))
  }
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render() {
    const green = this.state.status === Status.Completed
    console.log('green: ' + green)
    const yellow = (this.state.status === Status.Pending) || (this.state.status === Status.Unconfirmed)
    console.log('yellow: ' + yellow)
    const red = !green && !yellow
    console.log('red: ' + red)
    console.log(downloadLink(this.jobID))
    let icon = 'file'
    let bColor = 'green'
    if (yellow) {
      icon = 'clock'
      bColor = 'yellow'
    }
    if (red) {
      icon = 'warning'
      bColor = 'red'
    }
    return (
      <Flex style={containerStyle} align="center" gutter={3} justify="space-around">
        <Box mt={1} col={6} p={3}>
          <TrafficLight
            RedOn={red}
            YellowOn={yellow}
            GreenOn={green}
          />
        </Box>
        <Box col={6} p={3}>
          <ButtonCircle size={64} backgroundColor={bColor} title="Download" href={downloadLink(this.jobID)}>
            <Icon width={32} height={32} name={icon} />
          </ButtonCircle>
        </Box>
      </Flex>
    )
    
   //return <TrafficLight RedOn YellowOn />
  }
}
