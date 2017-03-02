import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router, IndexRoute, hashHistory } from 'react-router'
import App from './components/App.js'
import Blog from './components/Blog.js'
import CSV from './components/CSV.js'
import JobStatus from './components/JobStatus.js'
import Home from './components/Home.js'
import './resources/leaflet.draw.v0.2.2.css'
import './resources/normalize.min.css'

const router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="blog" component={Blog} />
      <Route path="data" component={CSV} />
      <Route path="geocode/:id" component={JobStatus} />
    </Route>
  </Router>
)

ReactDOM.render(router, document.getElementById('root'))
