import React from 'react';
import { withTransmorpher } from '../withTransmorpher'

@withTransmorpher({
  query: '#the-label',
  key: 'LabelChild',
  asleep: true
})
export default class LabelChild extends React.Component {
  
  render = () => {
    
    return this.props.renderTag({
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
          placeholder: 'yololo'
        }
      }
    })
  }
}