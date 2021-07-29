import React, { Component } from 'react'
import { connect } from 'react-redux'

class Component_ extends Component {
  render () {
    return (<div className='pcate'></div>)
  }
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = {}

const ComponentWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default ComponentWrapped
