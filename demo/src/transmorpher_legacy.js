import React from 'react'
import {ComponentMap} from '../map'

const {ELEMENT_NODE, TEXT_NODE} = Node

const jsxAttributesMap = {
  class: 'className',
  for: 'htmlFor',
  'xlink:href' : 'xlinkHref',
  readonly: 'readOnly'
}

const excludedAttributes = [
  'data-react',
  'data-component',
]

const transmorphAwakeChildren = node => {

  return [].slice.call(node.childNodes).reduce(
    (transmorphedAwakeNodes, node) => {
      const transmorphedAwakeNode = transmorphAwakeNode(node)

      return transmorphedAwakeNode ? 
        [
          ...transmorphedAwakeNodes,
          transmorphedAwakeNode
        ] 
        : transmorphedAwakeNodes
    },
    []
  )
}

const transmorphAwakeNode = node => {
  if (ELEMENT_NODE === node.nodeType) {
      
    return {
        component: getComponent(node),
        Tag: node.tagName.toLowerCase(),
        attributes: transmorphAttributes(node),
        children: transmorphAwakeChildren(node),
        awake: !('asleep-component' === node.getAttribute('data-react'))
    }
  } else if (TEXT_NODE === node.nodeType) {
    if (node.textContent.length === 0) {

      return undefined
    }

    return node.textContent
  }

  return undefined
}

const transmorphAsleepNodes = parentNode => {

  return [].slice.call(parentNode.querySelectorAll('[data-react=asleep-component]')).reduce(
    (transmorphed, node) => ({
      ...transmorphed,
      [node.getAttribute('data-component')]: {
        component: getComponent(node),
        Tag: node.tagName.toLowerCase(),
        attributes: transmorphAttributes(node),
        children: transmorphAwakeChildren(node)
      }
    }),
    {}
  )
}

const transmorphAttributes = node => {

  if (undefined === node.attributes) {

    return []
  }
  
  return Object.values(node.attributes)
    .filter(attributeNode => !excludedAttributes.includes(attributeNode.nodeName))
    .reduce((attributes, attributeNode) => 
      ({
        ...attributes,
        [getAttributeName(attributeNode)]: attributeNode.nodeValue
      }), 
      {}
    )
}

const getAttributeName = attributeNode => jsxAttributesMap[attributeNode.nodeName] || attributeNode.nodeName

const getComponent = node => {
  const component = node.getAttribute('data-component')

  return ComponentMap.hasOwnProperty(component) ? ComponentMap[component] : Markup
}

const Markup = (props) => (
  React.createElement(
    props.Tag || React.Fragment,
    props.attributes, props.children
  )
)

export const transmorphChildren = (input) => {
  const {selector, node, string} = input
  let parentNode
  if (node) {
    parentNode = node
  }
  if (selector) {
    parentNode = document.querySelector(selector)
  }
  if (string) {
    parentNode = document.createElement('div');
    parentNode.innerHTML = string
  }

  return {
    awake: transmorphAwakeChildren(parentNode),
    asleep: transmorphAsleepNodes(parentNode)
  }
}

export const rebuildChildren = (transmorphedChildren, context, props) => {
  const rebuildChild = (transmorphedChild, key) => ('object' === typeof transmorphedChild) ?
    React.createElement(
      transmorphedChild.component,
      {
        Tag: transmorphedChild.Tag,
        attributes: Object.assign({}, transmorphedChild.attributes, props),
        context: context,
        key,
        transmorphedChildren: transmorphedChild.children
      },
      transmorphedChild.children.length > 0 ?
        rebuildChildren(transmorphedChild.children, context)
        : null
    )
    : transmorphedChild
  
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

export const enrichedChildren = (children, enrichments) => {
    
  return children.map((child) => {
    if (typeof child === 'string') {
        
      return child
    }
    let enrichedChild = Object.assign({}, child);
    if (enrichments.hasOwnProperty(child.type.name)) {
      enrichedChild = Object.assign(
        {}, 
        child, 
        {
          props: Object.assign(
            {}, 
            child.props, 
            enrichments[child.type.name]
          )
        }
      )
    }      
    if (
        null !== enrichedChild.props.children
        && enrichedChild.props.children.length > 0
    ) {
      enrichedChild = Object.assign(
        {}, 
        enrichedChild, 
        {
          props: Object.assign(
            {}, 
            enrichedChild.props, 
            {
              children: enrichedChildren(enrichedChild.props.children, enrichments)
            }
          )
        }
      );
    }
    
    return enrichedChild;
  })
}

const awakeTransmorphed = (transmorphedChildren, awakeMap) => {
  if (transmorphedChildren.length === 0) {

    return []
  }
  
  return transmorphedChildren.reduce(
    (input, transmorphedChild) => {
      if (typeof transmorphedChild === 'string') {

        return [...input, transmorphedChild]
      }
      if (
        transmorphedChild.hasOwnProperty('component')
        && awakeMap.hasOwnProperty(transmorphedChild.component.name)
      ) {
        return [
          ...input,
          {
            ...transmorphedChild,
            awake: awakeMap[transmorphedChild.component.name],
            children: awakeTransmorphed(transmorphedChild.children, awakeMap)
          }
        ]
      }

      return [
        ...input, 
        {
          ...transmorphedChild,
          children: awakeTransmorphed(transmorphedChild.children, awakeMap)
        }
      ]
    }, 
    []
  )
}

export const awakeChildren = (transmorphedChildren, awakeMap, context) => {
  
  return rebuildChildren(awakeTransmorphed(transmorphedChildren, awakeMap), context)
}

// @todo: finalize this. We should remove separate asleep transmophed registry, and get asleep 
// directly from transmorphed tree

// export const getAsleep = (transmorphedChildren, componentName) => {
//     const { asleep } = transmorphedChildren;

//     return asleep.hasOwnProperty(componentName)
//         ? props => rebuildChildren([asleep[componentName]], this.getContext(), props)
//         : null
// }
