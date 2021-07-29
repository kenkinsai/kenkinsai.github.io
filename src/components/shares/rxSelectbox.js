/*global translate*/
import React, { Component } from 'react'
global.isclient && require('./rxSelectbox.css')

class RxSelectbox extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      toggle: false,
      options: this.props.options,
      results: this.props.results ? (this.props.results.constructor === Array ? this.props.results : this.props.results.split(',')) : []
    }
  }
  toggle () {
  }
  onClickItem (e, item) {
    e.stopPropagation()
    if (this.state.results.indexOf(item._id) === -1) {
      let tempResults = this.state.results
      tempResults.push(item._id)
      this.setState({ results: tempResults }, () => {
        let tempResults = this.state.results ? (this.state.results.constructor === Array ? this.state.results.join(',') : this.state.results) : ''
        this.props.onChange(tempResults)
      })
    }
  }
  onClickResult (e, item) {
    e.stopPropagation()
    let tempIndex = this.state.results.indexOf(item._id)
    if (tempIndex !== -1) {
      let tempResults = this.state.results
      tempResults.splice(tempIndex, 1)

      this.setState({ results: tempResults }, () => {
        let tempResults = this.state.results ? (this.state.results.constructor === Array ? this.state.results.join(',') : this.state.results) : ''
        this.props.onChange(tempResults)
      })
    }
  }
  onChangeFilter (e) {
    // let tempValue = e.target.value
  }
  render () {
    let options = this.state.options.map((item, index) => (
      this.state.results.indexOf(item._id) === -1 ? <div key={index} onClick={(e) => this.onClickItem(e, item)}>{item.name}</div> : <span key={index} />
    ))
    let results = this.state.options.map((item, index) => (
      this.state.results.indexOf(item._id) !== -1 ? <div key={index} onClick={(e) => this.onClickResult(e, item)}>{item.name} <b>x</b></div> : <span key={index} />
    ))
    return (
      <div className='rxselectbox-wrap'>
        <div className='rxselectbox-result clearfix' onClick={() => this.toggle()}>
          {!this.state.results.length && <span className='rxselectbox-resultempty'>{translate('Click to select')}</span>} {results}</div>
        {!this.state.toggle && <div className='rxselectbox-toggle'>
          <div className='rxselectbox-filter'></div>
          {options}
        </div> }
      </div>
    )
  }
}
RxSelectbox.defaultProps = { onChange: () => {}, options: [], results: [] }
export default RxSelectbox
