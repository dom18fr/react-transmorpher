import React from 'react'

const transmorphChildren = (node, componentMap) => {

  const {ELEMENT_NODE, TEXT_NODE} = Node
  
  const jsxAttributesMap = {
    class: 'className',
    for: 'htmlFor',
    'xlink:href' : 'xlinkHref',
    readonly: 'readOnly',
    maxlength: 'maxLength',
    'accept-charset': 'acceptCharset',
    datetime: 'dateTime',
    value: 'defaultValue'
  }

  const transmorph = (node, componentMap) => {
  
    if (ELEMENT_NODE === node.nodeType) {

      const transmorphAttributes = node => {

        if (undefined === node.attributes) {
      
          return []
        }
      
        const getAttributeName = attributeNode => jsxAttributesMap[attributeNode.nodeName] || attributeNode.nodeName
        
        return Object.values(node.attributes).reduce(
          (attributes, attributeNode) => ({
            ...attributes,
            [getAttributeName(attributeNode)]: attributeNode.nodeValue
          }), 
          {}
        )
      }

      const getComponent = (node, componentMap) => {

        const Markup = props => (
          React.createElement(
            props.Tag || React.Fragment,
            props.attributes, rebuildChildren(props.transmorphedChildren)
          )
        )
        const matching = componentMap.filter(item => {
      
          return item.node == node
        })
        if (matching.length) {
          
          return matching[0].component
        }
      
        return Markup
      }

      const component = getComponent(node, componentMap)
      
      return {
          component,
          Tag: node.tagName.toLowerCase(),
          attributes: transmorphAttributes(node),
          children: transmorphChildren(node, componentMap),
          awake: component.hasOwnProperty('awake') ? component.awake : true,
          componentKey: component.key
      }
    } else if (TEXT_NODE === node.nodeType) {
      if (node.textContent.length === 0) {
  
        return undefined
      }
  
      return node.textContent
    }
  
    return undefined
  }

  return [].slice.call(node.childNodes).reduce(
    (acc, node) => {
      const transmorphed = transmorph(node, componentMap)

      return transmorphed ? 
        [
          ...acc,
          transmorphed
        ] 
        : acc
    },
    []
  )
}

const rebuildChildren = transmorphedChildren => {
  
  const rebuildChild = (transmorphedChild, key) => {
    if ('object' !== typeof transmorphedChild) {

      return transmorphedChild
    }

    return React.createElement(
      transmorphedChild.component,
      {
        Tag: transmorphedChild.Tag,
        attributes: transmorphedChild.attributes,
        key,
        transmorphedChildren: transmorphedChild.children
      }      
    )
  }
  
  return Object.keys(transmorphedChildren).reduce(
    (acc, key) => {
      if (
        false === transmorphedChildren[key].hasOwnProperty('awake') 
        || true === transmorphedChildren[key].awake
      ) {

        return [
          ...acc,
          rebuildChild(transmorphedChildren[key], key)
        ]
      }

      return [...acc]
    },
    []
  )
}

export const Transmorpher = props => {

  const getNodeFromQuery = (rootNode, query) => {
    if (typeof query == 'string') {
  
      return rootNode.querySelector(query)
    }
  
    if (typeof query == 'function') {
  
      return query(rootNode)
    }
  
    return null
  }

  const componentMapFactory = (rootNode, components) => Object.keys(components).reduce(
    (acc, key) => {
  
      const component = components[key]
      const node = getNodeFromQuery(rootNode, component.query)
      const awake = component.awake
      if (node) {
        return [
          ...acc,
          {
            component,
            node,
            awake
          }
        ]
      }
  
      return acc
    }, 
    []
  )

  const body = document.createElement('body')
  body.innerHTML = props.source.trim()
  const rootNode = body.lastChild
  const componentMap = componentMapFactory(rootNode, props.components)

  return rebuildChildren(transmorphChildren(rootNode, componentMap), componentMap)
}

export const withTransmorpher = ({query, key, asleep}) => WithTransmorpherComponent => {

  const operatedChildren = (children, operations) => children.map((child) => {
    if (typeof child === 'string') {
        
      return child
    }
    let operatedChild = Object.assign({}, child)
    if (operations.hasOwnProperty(child.componentKey)) {
      operatedChild = {
        ...child,
        ...operations[child.componentKey]
      }
    }      
    if (
        null !== operatedChild.children
        && operatedChild.children.length > 0
    ) {
      operatedChild = {
        ...operatedChild,
        children: operatedChildren(operatedChild.children, operations)
      }
    }
    
    return operatedChild
  })

	return class extends React.Component {

		static query = query
    static awake = (asleep === undefined) ? true : !asleep
    static key = key

		renderTag = operations => {
			const {Tag, attributes} = this.props

			return <Tag {...attributes}>{this.renderChildren(operations)}</Tag>
		}

		renderChildren = operations => {
			const transmorphedChildren = this.props.transmorphedChildren
			if (transmorphedChildren.length === 0) {

				return null
			}
			if (operations !== undefined) {
				const operated = operatedChildren(transmorphedChildren, operations)
				
				return rebuildChildren(operated)
			}

			return rebuildChildren(transmorphedChildren)
		}

		render = () => {
      
      return (
        <WithTransmorpherComponent
          { ...this.props }
          renderChildren={ this.renderChildren }
          renderTag={ this.renderTag }
        />
      )
    }
	}
}