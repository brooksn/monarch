import React from 'react'
import Dropzone from 'react-dropzone'
import { Section, SectionHeader } from 'rebass'

const containerStyle = {
  marginLeft: '2em',
  marginRight: '2em'
}
const articleStyle = {
  textAlign: 'left'
}
const titleStyle = {}
const bodyStyle = {}
export default class Blog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      file: null
    }
  }
  onDrop(files) {
    window.theFile = files[0]
    console.log(files[0])
    const reader = new FileReader()
    reader.addEventListener("loadend", () => {
      console.log(reader.result)
      const header = reader.result.split('\n')[0].split(',')
      console.log(header)
    })
    reader.readAsText(files[0])
  }
  render() {
    return (
      <div style={containerStyle}>
        <Dropzone onDrop={this.onDrop.bind(this)}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
      </div>
    )
  }
}
