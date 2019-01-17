# react-transmorpher

*Given a html string as a source, the `Transmorpher` component re-render it as a react components tree.  
Each component in the tree may be replaced with your own custom component, using `withTransmorpher` HOC. Custom components can handle event and data just the way you want, while keeping rendered the same way as it was in the source.  
In a nutshell, react-transmorpher allows you to handle events and data in the nice react way, while keeping the style and markup logic outside of react.*

Example :

`index.html`

```html
<body>
  <div id="root">
    <main>
      <p>Maecenas sed diam eget risus varius blandit.<p>
      <button id="my-button" class="foo">Fermentum Nullam</button>
      <div class="bar">Maecenas faucibus mollis interdum.</div>
    </main>
  </div>
</body>
```

`index.js`

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import { Transmorpher } from 'react-transmorpher'

import * as components from './components' // this syntax require babel-plugin-wildcard

const root = document.querySelector('#root')

ReactDOM.render(
  <Transmorpher source={root.outerHTML} components={components} />,
  root
)
```

`components/MyButton.js`

```javascript
import React from 'react'
import { withTransmorpher } from 'react-transmorpher'

@withTransmorpher({
  query: '#my-button',
  key: 'MyButton'
})
export default class MyButton extends React.Component {

  handleClick = e => console.log('I\'m clicked !')

  render = () => {
    const {Tag, attributes, renderChildren} = this.props

    return <Tag {...attributes} onClick={this.handleClick}>{renderChildren()}</Tag>
  }
}
```
