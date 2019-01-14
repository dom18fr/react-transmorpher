import React from 'react'
import PropTypes from 'prop-types'
import { transmorphChildren, rebuildChildren, componentMapFactory } from './transmorpher'
import * as components from './components'

export default class TransmorpherProvider extends React.Component {

  constructor(props) {
    super(props)
    const rootNode = this.buildRooteNode(this.props.source)
    this.componentMap = componentMapFactory(rootNode, components)
    this.transmorphedAllChildren = transmorphChildren(rootNode, this.componentMap)
  }

  static childContextTypes = {
    transmorphedAllChildren: PropTypes.array.isRequired,
    componentMap: PropTypes.array.isRequired
  }

  buildRooteNode = source => {
    const body = document.createElement('body')
    body.innerHTML = source.trim()

    return body.lastChild
  }

  getChildContext = () => {

    return {
      transmorphedAllChildren: this.transmorphedAllChildren,
      componentMap: this.componentMap
    }
  }

  render = () => rebuildChildren(this.transmorphedAllChildren, this.componentMap)
}