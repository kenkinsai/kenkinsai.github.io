import { connect } from 'react-redux'

import * as Jsx from './index.jsx'
const RxComponent = global.rootRequire('components/shares/rxComponent').default

const { apiget } = global.rootRequire('classes/request')

class Component_ extends RxComponent {
  constructor (props, context) {
    super(props, context, Jsx)
    this.state = global.rootContext(this.props.staticContext) || {}
  }

  render () {
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = {}

const ComponentWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default ComponentWrapped
