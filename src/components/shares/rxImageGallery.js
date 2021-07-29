import React, { Component } from 'react'
//import {FacebookShareButton, FacebookIcon, TwitterShareButton,TwitterIcon } from "react-share";
global.isclient && require('./rxImageGallery.css')

class RxImageGallery extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      images: [],
      total: 0,
      index: 0
    }
    this.keyClickFunction = this.keyClickFunction.bind(this);
    if (this.props.images) {
      const images = this.props.images.split(',')
      if (images && images.constructor === Array && images.length > 0) {
        images.forEach(url => {
          if (url) {
            this.state.images.push(global.rxu.config.get_static + url)
          }
        })
      }
    }
    if (this.props.position && !isNaN(this.props.position)) {
      this.slideIndex = Number(this.props.position) + 1
    } else {
      this.slideIndex = 1
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyClickFunction, false);
    this.setState({
      total: this.state.images.length
    })

    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        this.plusSlides(1)
      }
      if (event.key === 'ArrowLeft') {
        this.plusSlides(-1)
      }
    })

    this.showSlides(this.slideIndex)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyClickFunction, false);
  }
  
  keyClickFunction(event) {
    event.preventDefault();
   
  }
  plusSlides(n) {
    this.slideIndex += n
    if(this.slideIndex === 0){
      this.slideIndex += n
    }
    this.showSlides(this.slideIndex)
  }

  currentSlide(n) {
    this.slideIndex = n
    this.showSlides(this.slideIndex)
  }

  downShowGallery() {
    let indexTab = this.state.index
    let images = this.state.images

    let imageCurrent = images[Number(indexTab) - 1]
    
    try {
      let xhr = new XMLHttpRequest()
      xhr.open("GET", imageCurrent, true)
      xhr.responseType = 'blob'
      xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL
        var imageUrl = urlCreator.createObjectURL(this.response)
        var tag = document.createElement('a')
        tag.href = imageUrl
        tag.download = 'image_'+Math.floor(Date.now() / 1000)
        document.body.appendChild(tag)
        tag.click()
        document.body.removeChild(tag)
      }
      xhr.send()
    } catch(e) {} 
  }

  showSlides(n) {
    let total = this.state.images.length || []
    this.slideIndex = n
    if (n > total) {
      this.slideIndex = 1
    } else if (n < 0) {
      this.slideIndex = total
    }
    
    this.setState({
      index: this.slideIndex
    })
  }

  render() {
    return (
      <div className='gallery-container'>
        <div className='number_item'>
          <span className='number'>{this.state.index}/{this.state.total}</span>
        </div>
        <div className='gl-download'>
          <span onClick={e => this.downShowGallery()} className='icon-cloud-download'></span>
        </div>
        <div className='gl-close'>
          <span onClick={e => this.props.closeShowGallery()}>
            <img className='filter_img_class' src={'./images/default/static/icon-close.svg'} alt='' /> 
          </span>
        </div>
        <div>
          <div className='gl-slides gl-fade'>
            { (this.props.type === 'video')
                ? <div className='div_video'>
                  <video controls className='video' key={this.state.images[this.slideIndex-1]}>
                    <source src={this.state.images[this.slideIndex-1]} type='video/mp4' />
                  </video>
                </div>
                : <img src={this.state.images[this.slideIndex-1]} className='gl-big' alt='' />
            }
          </div>

          {(this.state.images.length > 1) && <span className='gl-prev' onClick={e => this.plusSlides(-1)}>&#10094;</span>}
          {(this.state.images.length > 1) && <span className='gl-next' onClick={e => this.plusSlides(1)}>&#10095;</span>}
        </div>
        { (this.state.images.length < 5) && (<div className='gl-dot-btns'>
            {(this.state.images.length > 0) && this.state.images.map((url_img, index) => (
              <span key={index} className='gl-dot' onClick={e => { this.currentSlide(index + 1) }} />
            ))}
          </div>)
        }

      </div>
    )
  }
}

RxImageGallery.defaultProps = { closeShowGallery: () => { }, images: '' }

export default RxImageGallery
