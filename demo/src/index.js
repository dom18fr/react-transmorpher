import React from 'react'
import ReactDOM from 'react-dom'
import TransmorpherProvider from './TransmorpherProvider'

const root = document.querySelector('[data-react=root]')

ReactDOM.render(
  <TransmorpherProvider source={root.outerHTML} />,
  root
)