import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router, IndexRoute, browserHistory } from 'react-router'
import App from './components/App.js'
import Blog from './components/Blog.js'
import CSV from './components/CSV.js'
import Home from './components/Home.js'
import './resources/leaflet.draw.v0.2.2.css'
import './resources/normalize.min.css'

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="blog" component={Blog} />
      <Route path="data" component={CSV} />
    </Route>
  </Router>
)

ReactDOM.render(router, document.getElementById('root'))
