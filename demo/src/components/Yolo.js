import { withTransmorpher } from '../transmorpher'

export default withTransmorpher({
  query: '[data-react=root] input[type=text]',
  key: 'TheInput',
})(props => props.renderTag())