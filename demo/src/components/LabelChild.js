import React from 'react';
import { withTransmorpher } from '../withTransmorpher'

@withTransmorpher({
  query: '#the-label',
  key: 'LabelChild',
  asleep: false
})
export default class LabelChild extends React.Component {
  
  render = () => {
    const {Tag, attributes} = this.props
    
    return (
      <Tag {...attributes}>
      {
        this.props.renderChildren({
          MySpan: {
            awake: true,
            attributes: {
              className: "hhhssh",
            }
          }
        })
      }
      </Tag>
    )
  }
}