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
      color: this.context.rebass.colors.midgray
    }
    const toolbarStyle = {
      height: 80,
      backgroundColor: this.context.rebass.white,
      fontFamily: this.context.rebass.monospace,
      color: this.context.rebass.colors.ocean,
      borderBottomWidth: 5,
      borderBottomStyle: 'solid',
      borderBottomColor: this.context.rebass.colors.goldrush
    }
    return (
      <Toolbar style={toolbarStyle}>
        <Block style={{marginRight: 10, paddingTop: 5}} is={Link} to="/">
          <img alt="monarch logo" src={logo} width={64} />
        </Block>
        <Block is={Link} to="/" style={noUnderlineLinkStyle}>
          <Text style={{color:this.context.rebass.colors.goldrush}}>{process.env.SITE_TITLE}</Text>
          <Heading style={{color:this.context.rebass.colors.ocean}}>process.env.SITE_SUBTITLE</Heading>
        </Block>
        <Space
          auto
          x={1}
        />
        <NavItem is={Link} to="data">
          Data
        </NavItem>
        <NavItem is="a">
          Links
        </NavItem>
        <NavItem is="a">
          About
        </NavItem>
        <NavItem is={Link} to="blog">
          Adventure Log
        </NavItem>
      </Toolbar>
    )
  }
}

Header.contextTypes = {
  rebass: React.PropTypes.object
}
