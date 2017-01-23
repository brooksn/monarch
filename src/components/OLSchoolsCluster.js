import React, { Component, PropTypes } from 'react'
import OLCluster from './OLCluster.js'
import ol from 'openlayers'
import { debounce } from 'lodash'
import schoolStore, { getAllSchools, SCHOOL_STORE_CHANGE_EVENT } from '../stores/schoolStore.js'
const EPSG4326 = 'EPSG:4326'
const EPSG3857 = 'EPSG:3857'

const olFeatureFromSchool = school => {
  const p = new ol.geom.Point([school.minX, school.minY])
  return new ol.Feature(p.transform(EPSG4326, EPSG3857))
}

class OLSchoolsCluster extends Component {
  constructor(props){
    super(props)
    const schools = getAllSchools() || []
    const schoolFeatures = schools.map(olFeatureFromSchool)
    this.state = {
      schoolFeatures
    }
    this.debouncedUpdateStateFromSchoolStore = debounce(this.updateStateFromSchoolStore.bind(this), 200).bind(this)
  }
  schoolStoreChange(e) {
    this.debouncedUpdateStateFromSchoolStore()
  }
  componentDidMount() {
    schoolStore.on(SCHOOL_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
  }
  componentWillUnmount() {
    schoolStore.removeListener(SCHOOL_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
  }

  render() {
    console.log('re-rendering OLSchoolsCluster! :)')
    console.log(this.state.schoolFeatures)
    return (
      <OLCluster
        points={this.state.schoolFeatures}
      />
    )
  }
  updateStateFromSchoolStore() {
    const schools = getAllSchools() || []
    const schoolFeatures = schools.map(olFeatureFromSchool)
    this.setState({schoolFeatures})
  }
}

OLSchoolsCluster.propTypes = {
  mapName: PropTypes.string.isRequired
}

export default OLSchoolsCluster;
