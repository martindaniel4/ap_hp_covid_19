import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  useLocation,
} from 'react-router-dom'

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