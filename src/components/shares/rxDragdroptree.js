import React, { Component } from 'react'
import './rxDragdroptree.css'

class RxDragdroptree extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      data: this.props.data,
      server: this.props.server === true
    }

    if (typeof window !== 'undefined') {
      this.placeholderParent = {}
      this.placeholder = document.createElement('div')
      this.placeholder.className = 'rxdragdroptree-placeholder'
    }
  }

  UNSAFE_componentWillReceiveProps (newProps) {
    this.setState({ data: newProps.data })
  }

  preventDefault (event) {
    event.preventDefault()
  }

  dragStart (e) {
    e.stopPropagation()
    this.dragged = e.currentTarget
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget)
  }

  dragEnd (e) {
    e.stopPropagation()
    e.preventDefault()
    this.dragged.style.opacity = '1'
    if (this.placeholder.parentNode === this.placeholderParent) {
      this.placeholderParent.removeChild(this.placeholder)
    }

    this.helpAddDrop(this.dragged, this.over)
  }

  dragOver (e) {
    this.dragged.style.opacity = '0.3'
    if (this.dragged.contains(e.target)) return
    if (e.target.className === 'rxdragdroptree-placeholder') return
    if (e.target.className === 'rxdragdroptree-item' || e.target.className === 'rxdragdroptree-item-inner') {
      this.over = e.target

      let relY = e.clientY - this.over.offsetTop
      let height = this.over.offsetHeight / 2
      let parent = e.target.parentNode

      if (relY > height) {
        this.nodePlacement = 'after'
        parent.insertBefore(this.placeholder, e.target.nextElementSibling)
      } else if (relY < height) {
        this.nodePlacement = 'before'
        parent.insertBefore(this.placeholder, e.target)
      }

      this.placeholderParent = parent
    
    }
  }

  helpAddDrop (drag, drop) {
    if (!drop || !drop.dataset) {
      return
    }

    if (!drop.dataset.id || !drop.dataset.parentid) {
      this.nodePlacement = 'inner'
      drop = drop.parentNode
    }

    let dragdata = drag.dataset
    let dropdata = drop.dataset

    if (!this.state.server) {
      let tempdata = this.state.data
      let tempcurrentData = {}
      let tempparentDrag = this.state.data[drag.dataset.parentid]

      let tempparentDragNew = []
      for (let index in tempparentDrag) {
        if (tempparentDrag[index]._id === dragdata.id) {
          tempcurrentData = tempparentDrag[index]
          continue
        }
        tempparentDragNew.push(tempparentDrag[index])
      }

      tempdata[drag.dataset.parentid] = tempparentDragNew

      switch (this.nodePlacement) {
        case 'before':
          tempdata[dropdata.parentid] = tempdata[dropdata.parentid] || []
          tempdata[dropdata.parentid].splice(dropdata.index, 0, tempcurrentData)
          break

        case 'after':
          tempdata[dropdata.parentid] = tempdata[dropdata.parentid] || []
          tempdata[dropdata.parentid].splice(1 + parseInt(dropdata.index, 10), 0, tempcurrentData)
          break

        case 'inner':
          tempdata[dropdata.id] = tempdata[dropdata.id] || []
          tempdata[dropdata.id].splice(0, 0, tempcurrentData)
          break

        default:
          tempdata[dropdata.id] = tempdata[dropdata.id] || []
          tempdata[dropdata.id].splice(0, 0, tempcurrentData)
          break
      }

      this.setState({ data: tempdata })
    }
  }

  helpShowTree (items, parentId) {
    if (items && Object.keys(items).length) {
      return Object.keys(items).map((index) =>
        <div key={items[index]._id} className='rxdragdroptree-item' data-index={index} data-id={items[index]._id} data-parentid={parentId} draggable='true' onDragEnd={(e) => this.dragEnd(e)} onDragStart={(e) => this.dragStart(e)}>
          <div className='rxdragdroptree-item-' />{this.props.render(items[index])}
          <div className='rxdragdroptree-item-inner' />
          {this.helpShowTree(this.state.data[items[index]._id], items[index]._id)}
        </div>)
    } else {

    }
  }

  render () {
    return (
      <div className='rxdragdroptree-wrap' onDragOver={(e) => this.dragOver(e)}>
        {this.helpShowTree(this.state.data[0], 0)}
      </div>
    )
  }
}

RxDragdroptree.defaultProps = {
  render: (ele) => (<div className='rxdragdroptree-item-content'>{ele.text}</div>),
  data: {}
}
export default RxDragdroptree


