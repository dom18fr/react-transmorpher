import React from 'react';
import { withTransmorpher } from '../transmorpher'

@withTransmorpher({
  query: rootNode => rootNode.querySelector('#the-label'),
  key: 'LabelChild'
})
export default class LabelChild extends React.Component {
  
  render = () => {
    const {Tag, attributes} = this.props
    const children = this.props.renderChildren({
      MySpan: {
        awake: true,
        attributes: {
          className: "hhhssh",
        }
      },
      TheInput: {
        awake: true,
        attributes: {
          type: 'text',
          placeholder: 'teub'
        }
      }
    })

    return <Tag {...attributes} onClick={e => alert('yolo !')}>{children}</Tag>
  }
}