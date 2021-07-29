import React, { Component } from 'react'
global.isclient && require('./rxToggle.css')

class RxToggle extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      value: this.props.value
    }
  }

  toggle () {
    let newValue = (this.state.value === 1) ? 0 : 1
    this.setState(({ value }) => ({ value: newValue }), () => {
      this.props.onToggle(this.state.value)
    })
  }

  render () {
    return (
      <div onClick={(e) => this.toggle()} className={'rxtoggle-container rxtoggle-style1 ' + (this.state.value === 1 ? 'rx-active' : '')}><div className='rxtoggle-inner' /></div>
    )
  }
}

RxToggle.defaultProps = { onToggle: () => {}, value: 0 }

export default RxToggle
