import React from 'react'
import {operatedChildren, rebuildChildren} from './transmorpher'

export const withTransmorpher = ({query, key, asleep}) => WithTransmorpherComponent => {

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