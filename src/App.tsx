import React from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import './stylesheets/App.css'

import APHP from './components/APHP'

export default function App() {
  
  return (
    <Router>
      <Route exact path="/">
        <APHP />
      </Route>
    </Router>
  )
}