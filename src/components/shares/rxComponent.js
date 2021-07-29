import { Component } from 'react'

class RxComponent extends Component {
  constructor (props, context, Jsx) {
    super(props, context)
    this.state = {
      flagUpdate: false,
      flags: {}
    }
    for (let i in Jsx) {
      this[i] = (...paramPass) => Jsx[i](...paramPass, this)
    }
  }

  componentWillUnmount () {
    this._isUnmounted = true
  }

  setState (obj, callback = () => {}) { if (!this._isUnmounted) { super.setState(obj, callback) } }

  run (name, params) {
    if (params) { params.inthis = this } else { params = this }
    if (typeof this.props[name] !== 'undefined' && typeof this.props[name] === 'function') {
      return this.props[name](params)
    } else if (typeof this[name] !== 'undefined' && typeof this[name] === 'function') {
      return this[name]()
    }
  }

  toggle (flagname) {
    let flags = this.state.flags
    flags[flagname] = flags[flagname] ? 0 : 1
    this.setState({ flags: flags })
  }

  flag (flagname, value) {
    let flags = this.state.flags
    flags[flagname] = value
    this.setState({ flags: flags })
  }
  
  onBlurData (e, name, options) {
    options = options || {}
    let editingData = this.state.editingData
    if (options.strim) {
      editingData[name] = e.target.value.toString().replace(/(,)/g, '')
    } else {
      editingData[name] = e.target.value
    }
    this.setState({ editingData: editingData })
  }

  onBlurDataValue (value, name) {
    let editingData = this.state.editingData
    editingData[name] = value
    this.setState({ editingData: editingData })
  }
}

export default RxComponent
