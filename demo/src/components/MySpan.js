import React from 'react'
import { withTransmorpher } from "../withTransmorpher"

const MySpan = props => <span {...props.attributes}>{props.renderChildren()}</span>

export default withTransmorpher({query: '#the-label>span', key: 'MySpan'})(MySpan)