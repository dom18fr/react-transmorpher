import React from 'react'

export const transmorphChildren = (node, componentMap) => {

  const {ELEMENT_NODE, TEXT_NODE} = Node
  
  const jsxAttributesMap = {
    class: 'className',
    for: 'htmlFor',
    'xlink:href' : 'xlinkHref',
    readonly: 'readOnly'
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
            props.attributes, props.children
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

export const rebuildChildren = (transmorphedChildren) => {
  
  const rebuildChild = (transmorphedChild, key) => {
    if ('object' !== typeof transmorphedChild) {

      return transmorphedChild
    }
    const children = transmorphedChild.children.length > 0 ? rebuildChildren(transmorphedChild.children) : null

    return React.createElement(
      transmorphedChild.component,
      {
        Tag: transmorphedChild.Tag,
        attributes: transmorphedChild.attributes,
        key,
        transmorphedChildren: transmorphedChild.children
      },
      children
    )
  }
  // @todo: should return only direct children, since each component rebuild its own
  return Object.keys(transmorphedChildren).reduce(
    (builtChildren, key) => {
      if (
        false === transmorphedChildren[key].hasOwnProperty('awake') 
        || transmorphedChildren[key].awake
      ) {

        return [
          ...builtChildren,
          rebuildChild(transmorphedChildren[key], key)
        ]
      }

      return [...builtChildren]
    },
    []
  )
}

export const operatedChildren = (children, operations) => children.map((child) => {
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
  }
)

export const componentMapFactory = (rootNode, components) => Object.keys(components).reduce(
  (acc, key) => {

    const getNodeFromQuery = (rootNode, query) => {
      if (typeof query == 'string') {
    
        return rootNode.querySelector(query)
      }
    
      if (typeof query == 'function') {
    
        return query(rootNode)
      }
    
      return null
    }

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
