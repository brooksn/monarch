import React, { Component } from 'react'
import { Link } from 'react-router'
import { Block, Heading, NavItem, Space, Text, Toolbar } from 'rebass'
import logo from '../resources/gold2.png';
//import esri from 'esri-leaflet'
export default class Header extends Component {
  componentDidMount() {
    //esri.basemap
  }
  render() {
    const noUnderlineLinkStyle = {
      textDecoration: 'none',
      color: this.context.rebass.colors.white
    }
    const toolbarStyle = {
      fontFamily: this.context.rebass.monospace,
      color: this.context.rebass.colors.white
    }
    return (
      <Toolbar style={toolbarStyle}>
        <Block is={Link} to="/">
          <img alt="monarch logo" src={logo} width={64} />
        </Block>
        <Block is={Link} to="/" style={noUnderlineLinkStyle}>
          <Text>State of California</Text>
          <Heading>GIS Resource Center</Heading>
        </Block>
        <Space
          auto
          x={1}
        />
        <NavItem is="a">
          Data
        </NavItem>
        <NavItem is="a">
          Links
        </NavItem>
        <NavItem is="a">
          About
        </NavItem>
        <NavItem is={Link} to="blog">
            Blog
        </NavItem>
      </Toolbar>
    )
  }
}

Header.contextTypes = {
  rebass: React.PropTypes.object
}
