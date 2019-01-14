import React from 'react'
import PropTypes from 'prop-types'
import { transmorphChildren, rebuildChildren, componentMapFactory } from './transmorpher'

export default class Transmorpher extends React.Component {

  constructor(props) {
    super(props)
    const rootNode = this.buildRooteNode(this.props.source)
    this.componentMap = componentMapFactory(rootNode, props.components)
    this.transmorphedAllChildren = transmorphChildren(rootNode, this.componentMap)
  }

  buildRooteNode = source => {
    const body = document.createElement('body')
    body.innerHTML = source.trim()

    return body.lastChild
  }

  render = () => rebuildChildren(this.transmorphedAllChildren, this.componentMap)
}