import React from 'react'
import { withTransmorpher } from '../withTransmorpher'

@withTransmorpher({
  query: '#yolo',
  key: 'Yolo'
})
export default class Yolo extends React.Component {

  render = () => {
    return <p>iiiiii</p>
  }
}