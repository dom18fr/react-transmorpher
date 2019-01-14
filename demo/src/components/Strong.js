import React from 'react'
import { withTransmorpher } from '../withTransmorpher'

@withTransmorpher({
  query: '#label>strong'
})
export default class Strong extends React.Component {
  
  render = this.props.renderTag()
}