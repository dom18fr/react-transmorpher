import React from 'react'
import ReactDOM from 'react-dom'

import Demo from './Demo'
import { TransmorpherProvider, getTransmorphables } from './transmorpher'

ReactDOM.render(
  <TransmorpherProvider transmorphables={getTransmorphables('[data-react=root]')}>
    <Demo />
  </TransmorpherProvider>,
  document.querySelector('[data-react=root]')
)