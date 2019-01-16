import React from 'react'
import ReactDOM from 'react-dom'

import {Transmorpher} from './transmorpher'
import * as components from './components'

const root = document.querySelector('[data-react=root]')

ReactDOM.render(
  <Transmorpher source={root.outerHTML} components={components} />,
  root
)