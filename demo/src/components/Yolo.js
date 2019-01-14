import { withTransmorpher } from '../withTransmorpher'

export default withTransmorpher({
  query: '[data-react=root] input[type=text]',
  key: 'TheInput',
  asleep: true
})(props => props.renderTag())