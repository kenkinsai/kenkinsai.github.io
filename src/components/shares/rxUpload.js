/* global FormData, fetch */
import React, { Component } from 'react'
global.isclient && require('./rxUpload.css')

class RxUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      images: props.images || [],
      callback: props.callback,
      single: props.single || 1
    }
  }

  componentDidMount () {
  }

  onClickDataUpload (e) {
    this.refs.data_image.click()
  }

  onChangeDataImageFile (e) {
    e.stopPropagation()
    e.preventDefault()

    if (typeof (e.target.files[0]) !== 'undefined') {
      let file = e.target.files[0]
      let data = new FormData()
      data.append('uploadFile', file, file.name)
      fetch(global.rxu.config.base_api + '/upload', { method: 'POST', body: data }).then(res => res.json()).then((json) => {
        if (json.success === 1) {
          this.onBlurData(json)
        }
      })
    }
  }

  onBlurData (json) {
    this.setState({ images: json.data }, () => {
      if (typeof this.state.callback === 'function') {
        this.state.callback(this.state)
      }
    })
  }

  onClickDataUploadArr (e, index) {
    this.refs['data_image_' + index].click()
  }

  onChangeDataImageFileArr (e, index) {
    e.stopPropagation()
    e.preventDefault()

    if (typeof (e.target.files[0]) !== 'undefined') {
      let file = e.target.files[0]
      let data = new FormData()
      data.append('uploadFile', file, file.name)
      fetch(global.rxu.config.base_api + '/upload', { method: 'POST', body: data }).then(res => res.json()).then((json) => {
        if (json.success === 1) {
          this.onBlurDataArr(json, index)
        }
      })
    }
  }

  onBlurDataArr (json, index) {
    let tempImages = this.state.images
    tempImages[index] = json.data
    this.setState({ images: tempImages }, () => {
      if (typeof this.state.callback === 'function') {
        this.state.callback(this.state)
      }
    })
  }

  onClickImgRemove (e, index) {
    let tempImages = this.state.images
    tempImages.splice(index, 1)
    this.setState({ images: tempImages }, () => {
      if (typeof this.state.callback === 'function') {
        this.state.callback(this.state)
      }
    })
  }

  render () {
    let tmpImgStr
    let tmpImgStrAdd
    if (this.state.single === 1) {
      let tempImages = (typeof (this.state.images) === 'string') ? this.state.images : 'ico_app_default.jpg'
      tmpImgStr =
        <div>
          <input type='file' id='file' ref='data_image' style={{ display: 'none' }} onChange={(e) => this.onChangeDataImageFile(e)} />
          <img className='admin-product-img-upload' alt='ico_default' src={global.rxu.config.base_api + '/upload/image/' + tempImages} onClick={(e) => this.onClickDataUpload(e)} />
        </div>
    } else {
      let tempLastIndex = 0
      tmpImgStr = this.state.images.map((perdata, index) => {
        let tempRef = 'data_image_' + index
        tempLastIndex = index
        return (
          <div key={index} className='admin-product-img-multi'>
            <div className='admin-product-img-remove' onClick={(e) => this.onClickImgRemove(e, index)}>x</div>
            <input type='file' id='file' ref={tempRef} style={{ display: 'none' }} onChange={(e) => this.onChangeDataImageFileArr(e, index)} />
            <img className='admin-product-img-upload' alt='ico_default' src={global.rxu.config.base_api + '/upload/image/' + (perdata || 'ico_app_default.jpg')} onClick={(e) => this.onClickDataUploadArr(e, index)} />
          </div>
        )
      })

      tempLastIndex += 1; let tempLastRef = 'data_image_' + tempLastIndex
      tmpImgStrAdd =
        <div key={tempLastIndex} className='admin-product-img-multi'>
          <input type='file' id='file' ref={tempLastRef} style={{ display: 'none' }} onChange={(e) => this.onChangeDataImageFileArr(e, tempLastIndex)} />
          <img className='admin-product-img-upload' alt='ico_default' src={global.rxu.config.base_api + '/upload/image/' + (this.state.images[tempLastIndex] || 'ico_app_default.jpg')} onClick={(e) => this.onClickDataUploadArr(e, tempLastIndex)} />
        </div>
    }

    return (
      <div className='clearfix'>{tmpImgStr}{tmpImgStrAdd}</div>
    )
  }
}

export default RxUpload
