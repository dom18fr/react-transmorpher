import React from 'react'
import { withTransmorpher } from './transmorpher'
import MyChildComponent from './MyChildComponent'

@withTransmorpher({
  selector: '[data-react=component][data-component=Demo]'
})
export default class Demo extends React.Component {
  
  render = () => {

    return <MyChildComponent>OK</MyChildComponent>
  }
  // render = () => this.props.tRender({
  //   DemoInput: {
  //     className: 'yolo'
  //   }
  // })
}