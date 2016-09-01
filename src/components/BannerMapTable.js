import React from 'react'
import { Table } from 'rebass'
import { debounce } from 'lodash'
import mapStore, { getBoundingBoxOfMap, MAP_STORE_CHANGE_EVENT } from '../stores/mapStore.js'
import schoolStore, { getSchoolsInLeafletBBox, SCHOOL_STORE_CHANGE_EVENT } from '../stores/schoolStore.js'
const containerStyle = {
  marginLeft: '1em',
  marginRight: '1em'
}

export default class BannerMapTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      schools: []
    }
    this.debouncedUpdateStateFromSchoolStore = debounce(this.updateStateFromSchoolStore.bind(this), 200)
  }
  updateStateFromSchoolStore() {
    const bbox = getBoundingBoxOfMap(this.props.mapName)
    if (bbox) {
      getSchoolsInLeafletBBox(bbox)
      .then(res => {
        this.setState({schools: res})
      })
    }
  }
  schoolStoreChange(e) {
    this.debouncedUpdateStateFromSchoolStore()
  }
  mapStoreChange(e) {
    this.debouncedUpdateStateFromSchoolStore()
  }
  componentDidMount() {
    mapStore.on(MAP_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
    schoolStore.on(SCHOOL_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
  }
  componentWillUnmount() {
    mapStore.removeListener(MAP_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
    schoolStore.removeListener(SCHOOL_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
  }
  render() {
    const tableData = this.state.schools.slice(0,40).map(feature => {
      return [feature.properties.school, feature.properties.street, feature.properties.city]
    })
    if (this.state.schools.length > tableData.length) {
      tableData.push([`…and ${this.state.schools.length - tableData.length} more schools are not displayed.`, '', ''])
    }
    return (
      <Table
        style={containerStyle}
        data={tableData}
        headings={['School', 'Street', 'City']}
      />
    )
  }
}

BannerMapTable.defaultProps = {
  mapName: 'bannermap'
}
