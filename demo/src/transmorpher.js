import React from 'react'
import PropTypes from 'prop-types'

export const getTransmorphables = rootSelector => document.querySelector(rootSelector).cloneNode(true)

export class TransmorpherProvider extends React.Component {

  constructor(props) {
    super(props)
    const { transmorphables } = props
    this.doc = document.implementation.createDocument ('http://www.w3.org/1999/xhtml', 'html', null);
    this.doc.documentElement.appendChild(transmorphables);
  }

  static childContextTypes = {
    getTransmorphedChildren: PropTypes.func.isRequired
  }

  getChildContext = () => {

    return {
      getTransmorphedChildren: this.getTransmorphedChildren
    }
  }

  getTransmorphedChildren = () => {
    return []
  }

  render = () => React.Children.only(this.props.children)
}

export const withTransmorpher = ({selector}) => TransmorphedComponent => {
  // Find the right way to go to ful transmophing
  return class extends React.Component {

    static contextTypes = {
      getTransmorphedChildren: PropTypes.func.isRequired,
    }

    render = () => (
      <TransmorphedComponent 
        {...this.props} 
        transmorphedChildren={this.context.getTransmorphedChildren(selector)} 
      />
    )
  }
}