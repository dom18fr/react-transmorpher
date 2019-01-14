import React from 'react'
import PropTypes from 'prop-types'
import {operatedChildren, rebuildChildren} from './transmorpher'

export const withTransmorpher = ({query, key, asleep}) => WithTransmorpherComponent => {

	return class extends React.Component {

		static contextTypes = {
			componentMap: PropTypes.array.isRequired
		}

		static query = query
    static awake = (asleep === undefined) ? true : !asleep
    static key = key

		renderTag = operations => {
			const {Tag, attributes} = this.props 

			return <Tag {...attributes}>{this.renderChildren(operations)}</Tag>
		}

		renderChildren = operations => {
			const transmorphedChildren = this.props.transmorphedChildren
			const { componentMap } = this.context
			if (operations !== undefined) {
				const operated = operatedChildren(transmorphedChildren, operations)
				
				return rebuildChildren(operated, componentMap)
			}

			return rebuildChildren(transmorphedChildren, componentMap)
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