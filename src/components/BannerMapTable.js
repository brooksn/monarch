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
    const bbox = getBoundingBoxOfMap(this.props.mapName)
    const schools = bbox ? getSchoolsInLeafletBBox(bbox) || [] : []
    this.state = {
      schools
    }
    this.debouncedUpdateStateFromSchoolStore = debounce(this.updateStateFromSchoolStore.bind(this), 200).bind(this)
    this.debouncedMapStoreChange = debounce(this.mapStoreChange.bind(this), 100).bind(this)
  }
  updateStateFromSchoolStore() {
    const bbox = getBoundingBoxOfMap(this.props.mapName)
    const schools = bbox ? getSchoolsInLeafletBBox(bbox) || [] : []
    this.setState({schools})
  }
  schoolStoreChange(e) {
    this.debouncedUpdateStateFromSchoolStore()
  }
  mapStoreChange(e) {
    this.debouncedUpdateStateFromSchoolStore()
  }
  componentDidMount() {
    this.debouncedMapStoreChange()
    mapStore.on(MAP_STORE_CHANGE_EVENT, this.debouncedMapStoreChange)
    schoolStore.on(SCHOOL_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
  }
  componentWillUnmount() {
    mapStore.removeListener(MAP_STORE_CHANGE_EVENT, this.debouncedMapStoreChange)
    schoolStore.removeListener(SCHOOL_STORE_CHANGE_EVENT, this.debouncedUpdateStateFromSchoolStore)
  }
  render() {
    const tableData = this.state.schools.slice(0,40).map(pin => {
      return [pin.school, pin.street, pin.city]
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
