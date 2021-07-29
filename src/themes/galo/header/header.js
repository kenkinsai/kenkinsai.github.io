import React, { Component } from 'react'
import { connect } from 'react-redux'
global.isclient && require('./header.css')

const {} = global.rootRequire('redux')

class Header_ extends Component {
  render () {
    return (<div></div>)
  }
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = {}

const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header_)

export default Header