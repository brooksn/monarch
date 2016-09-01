import React, { Component } from 'react'
import Header from './Header'
//import BannerMap from './BannerMap'
//import Blog from './Blog'

const monospace = '"SF Mono", "Roboto Mono", Menlo, Consolas, monospace'
const baseColors = {
  black: '#111',
  white: '#fff',
  gray: '#ddd',
  midgray: '#888',
  blue: '#08e',
  red: '#f52',
  orange: '#f70',
  green: '#1c7',
  gold: '#ffd54f'
}
const colors = {
  ...baseColors,
  primary: baseColors.gold,
  secondary: baseColors.midgray,
  default: baseColors.black,
  info: baseColors.blue,
  success: baseColors.green,
  warning: baseColors.orange,
  error: baseColors.red
}

class App extends Component {
  static childContextTypes = {
    rebass: React.PropTypes.object
  }
  getChildContext () {
    return {
      rebass: {
        monospace,
        colors,
        Button: {
          backgroundColor: 'tomato'
        }
      }
    }
  }
  render() {
    //const children = React.Children.map(child => React.cloneElement(child))
    
    return (
      <div className="App">
        <Header />
        <div className="app-children">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default App;
