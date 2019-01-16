# react-transmorpher

*Given a html string as a source, render a react component tree. Each component in the tree may be replaced with your own custom component, using a simple HOC. Custom components can handle event and data just the way you want, while keeping rendered the same way as it where in the source. In a nutshell, react-transmorpher allows you to handle events and data in the nice react way, while keeping the style and markup logic outside of react.*

Example :

`index.html`

```html
<body>

</body>
```

`index.js`

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import { Transmorpher } from 'react-transmorpher'

import MyComponent from './components/MyComponent'
import AnotherComponent from './components/AnotherComponent'

const components = {
    MyComponent
}

const root = document.querySelector('#root')

ReactDOM.render(
  <Transmorpher source={root.outerHTML} components={components} />,
  root
)
```

`MyComponent.js`

```javascript
import React from 'react'
import { withTransmorpher } from 'react-transmorpher'

@withTransmorpher({
  query: '#foo',
  key: 'foo'
})
export default class MyComponent extends React.Component {

  handleClick = e => console.log('I\'m clicked !')

  render = () => {
    const {Tag, attributes, renderChildren} = this.props

    return <Tag {...attributes} onClick={this.handleClick}>{renderChildren()}</Tag>
  }
}
```