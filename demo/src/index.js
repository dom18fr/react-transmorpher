import React from 'react'
import ReactDOM from 'react-dom'

import TransmorpherProvider from './TransmorpherProvider'
import * as components from './components'

const root = document.querySelector('[data-react=root]')

ReactDOM.render(
  <TransmorpherProvider source={root.outerHTML} components={components} />,
  root
)