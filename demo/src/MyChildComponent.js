import React from 'react';
import { withTransmorpher } from './transmorpher';

const MyChildComponent = props => {
    return <div>Yolo component</div>
}

export default withTransmorpher({selector: 'ddd'})(MyChildComponent)