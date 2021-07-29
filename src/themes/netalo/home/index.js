import { connect } from 'react-redux'

import * as Jsx from './home.jsx'
const themeColorData = global.rootRequire('classes/themeColorData.json')
const { changeThemeColor } = global.rootRequire('classes/ulti')
const { rxgetLocal } = global.rootRequire('classes/request')
const RxComponent = global.rootRequire('components/shares/rxComponent').default
const { rxnavToggle, rxnavClose,setComp } = global.rootRequire('redux')

class Component_ extends RxComponent {
  constructor (props, context) { 
    super(props, context, Jsx)
    this._mounted = false
    this.state = { isAuthenticated: false, activeNavs: {} }
  }

  componentDidMount () {
    const color = global.rxu.json(rxgetLocal('netaThemeColor'), '')
    if(color==='blueColor'){
       changeThemeColor (themeColorData.blueColor)
    } else {
      changeThemeColor (themeColorData.orangeColor) 
    } 
    this._mounted = true
    this.checkAuth()
  }

  componentWillUnmount () {
    this._mounted = false
  }

  setStateRx (object, callback) {
    if (this._mounted) { this.setState(object, callback) }
  }

  checkAuth () {
    if (!global.rxu.get(this.props, 'netaauth.user.id')) {
      // this.props.history.push('/login')
      this.props.setComp('login')
    }
  }

  render () {
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  favorite: state.favorite,
  netaauth: state.netaauth
})

const mapDispatchToProps = {
  rxnavClose,
  rxnavToggle,
  setComp
}

const ComponentWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default ComponentWrapped
