import React from 'react'
import { withTransmorpher } from '../transmorpher'

export default withTransmorpher({
    query: '#the-label>span', 
    key: 'MySpan',
    asleep: true
})(
  props => <span {...props.attributes}>{props.renderChildren()}</span>
)