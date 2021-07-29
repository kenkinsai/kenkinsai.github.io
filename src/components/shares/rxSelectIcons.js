import React, { Component } from 'react'
const stickerDataObj = global.rootRequire('classes/stickerData.json');
const { rxsetLocal, rxgetLocal } = global.rootRequire('classes/request')

global.isclient && require('./rxSelectIcons.css')

class RxSelectIcons extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tabIndex: 0,
      boxEmoji: false,
      emojiClickNum: 0,
      stickerFolderName: [],
      arrTabsDisplay: [],      
      arrTabs: [],
      xPercent: 0,
      slickTrackLength: 0,
      arrHistory: global.rxu.json(rxgetLocal('rxemoji'), {data: []}),
      pathImg: './images/sticker'      
    }

    let dataSticker = global.rxu.json(rxgetLocal('rxsticker'), {})
    if (dataSticker.pathimg) {
      this.state.pathImg = dataSticker.pathimg
    }

    if (this.state.arrHistory && !this.state.arrHistory['data']) {
      this.state.arrHistory['data'] = []
      this.state.tabIndex = 1
    } 
  }

  componentDidMount() {
    let dataSticker = global.rxu.json(rxgetLocal('rxsticker'), stickerDataObj)
    this.updateSticker(dataSticker)
    if (window && window.ipcRenderer) {
      window.ipcRenderer.on('new_sticker', (event, args) => {
        if (args) {
          try {
            let objSticker = JSON.parse(args)
            if (objSticker.version) {
              this.updateSticker(objSticker)
            }         
          } catch(e) {
          }
        }
      })
    }
  }

  updateSticker(dataSticker) {
    let arrTabs = []
    let arrTabsDisplay = []
    let stickerFolderName = []
    let pathImg = this.state.pathImg
    
    const data = (dataSticker.version) ? dataSticker : stickerDataObj
    if (data.stickerData) {
      let stickerData = data.stickerData
      arrTabsDisplay = stickerData
      arrTabs = stickerData
      stickerData.forEach(o => {
        if (o.type && o.type !== 'history' && o.type !== 'EmojiIcon') {
          stickerFolderName.push(o.type)
        }
      })   

      if (data.pathimg) {
        pathImg = data.pathimg
      }
      this.setState({arrTabsDisplay: arrTabsDisplay, pathImg: pathImg, arrTabs: arrTabs, stickerFolderName: stickerFolderName, slickTrackLength: arrTabsDisplay.length * 50 })
    }
  }

  addHistory(icons, type) {
    this.props.onClick(icons, type)
  }

  addEmoji(e, index) {
    e.stopPropagation()
    let arrTabs = this.state.arrTabs
    let tabIndex = this.state.tabIndex
    let value = arrTabs[tabIndex]['data'][index] || ''
    this.addHistoryEmoji({type: 'EmojiIcon', value: value})
    this.props.onClick(value, 'EmojiIcon')
  }

  addSticker(e, pSticker, index) {
    e.stopPropagation()
    let arrTabs = this.state.arrTabs
    let tabIndex = this.state.tabIndex
    if (arrTabs && arrTabs[tabIndex]['type'] === pSticker && arrTabs[tabIndex]['data'][index]) {
      let value = pSticker + '_' + arrTabs[tabIndex]['data'][index] || ''
      this.addHistoryEmoji({type: 'Sticker', value: value})
      this.props.onClick(value, 'Sticker')
    }
  }

  addHistoryEmoji(value) {
    let arrHistory = this.state.arrHistory || {data: []}
    if (arrHistory && arrHistory['data'] && arrHistory['data'].constructor === Array) {
      if (arrHistory['data'].length > 30) {
        arrHistory['data'].pop()
      } else {
        if (arrHistory['data'].length === 0) {
          arrHistory['data'].push(value)  
        } else {
          arrHistory['data'] = arrHistory['data'].filter(o => o.value !== value.value)   
          arrHistory['data'].unshift(value)  
        }
      }
      this.setState({arrHistory: arrHistory}, () => {
        rxsetLocal('rxemoji', JSON.stringify(arrHistory))
      })  
    } 
  }

  changeTabIcon(index) {
    this.setState({ tabIndex: index })
  }

  parseSticker(namesticker) {
    const arrsticker = this.state.stickerFolderName
    for (const sticker of arrsticker) {
      if (namesticker && typeof (namesticker) === 'string' && namesticker.indexOf(sticker) !== -1) {
        let indexPath = namesticker.indexOf('_')
        let stickerStr = indexPath < 0 ? '' : namesticker.slice(0, indexPath)
        let imgsticker = indexPath < 0 ? '' : namesticker.slice(indexPath+1)
        if (indexPath !== -1) {
          return `${this.state.pathImg}/${stickerStr}/${imgsticker}` 
        }
      }
    }
  }

  clickMoveTab(type) {
    let xPercent = this.state.xPercent || 0
    if (type === 'prev') {
      xPercent += 200
    } else {
      xPercent -= 200
    }
    this.setState({xPercent: xPercent})
  }

  parseImagePath(nameimg) {
    let indexPath = nameimg.indexOf('_')
    let namefolder = indexPath < 0 ? nameimg : nameimg.slice(0, indexPath)
    let namefile = indexPath < 0 ? nameimg : nameimg.slice(indexPath+1)

    if (indexPath !== -1) {
      return this.state.pathImg + '/' + namefolder + '/' + namefile  
    } else {
      return './images/tabs/' + nameimg
    }
  }

  render() {
    let arrTabs = this.state.arrTabs || {data: []}
    let arrTabsDisplay = this.state.arrTabsDisplay || {data: []}
    let tabIndex = this.state.tabIndex

    return (
      <div className='box-emoji-wrap'>
        <img src={'./images/default/static/icon-sticker.svg'} alt='icon-like' className='icons-sticker filter_img_class' />
        <div className='box-emoji'>
          <div className='box-emoji-header'>
            <div className="slider-emoji responsive slick-initialized slick-slider-emoji">
              <div className="slick-track" style={{transform: `translateX(${this.state.xPercent || 0}px)`, width: this.state.slickTrackLength+'px'}}>
                {arrTabsDisplay.map((objImg, index) => (                
                  <div className={(index === tabIndex) ? 'slick-slide slick-active' : 'slick-slide'} key={'imgtab-'+index} >
                    {([0,1].indexOf(index) !== -1) && <img className='icon_sticker_header' alt='' src={'./images/tabs/'+objImg.img} onClick={e => this.changeTabIcon(index)} onError={(e)=>{e.target.onerror = null; e.target.src='./images/tabs/default.jpg'}}/>}
                    {([0,1].indexOf(index) === -1) && <img className='icon_sticker_header' alt='' src={this.parseImagePath(objImg.img)} onClick={e => this.changeTabIcon(index)} onError={(e)=>{e.target.onerror = null; e.target.src='./images/tabs/default.jpg'}}/>}
                  </div>
                ))}
              </div>
            </div>
            {(this.state.xPercent < 0) && <div className="prev-emoji slick-disabled" style={{display: 'block'}} onClick={(e) => this.clickMoveTab('prev')}>
              <i className='emoji_arrow_back'></i>
            </div>}            
            {(this.state.xPercent > ((this.state.slickTrackLength*-1) + 300)) && <div className="next-emoji" style={{display: 'block'}} onClick={(e) => this.clickMoveTab('next')}>
              <i className='emoji_arrow_next' ></i>
            </div>}
          </div>

          <div className='box-emoji-body'>
            {(tabIndex === 0) && <div className='box-emoji-content'>
              {this.state.arrHistory['data'].map((vIcons, index) => (
                <div key={'iconhistory-' + index} className='icon-sticker'>
                  {(vIcons['type'] === 'EmojiIcon') && <div className='icon-emoji_history' onClick={e => this.addHistory(vIcons['value'], vIcons['type'])}>{vIcons['value']}</div>}
                  {(vIcons['type'] === 'Sticker') && <div className='icon-ticker_history' onClick={e => this.addHistory(vIcons['value'], vIcons['type'])}>
                    <img className='icon-ticker_place'src={this.parseSticker(vIcons['value'])} alt='' onError={(e)=>{e.target.onerror = null; e.target.src='./images/tabs/default.jpg'}} />
                  </div>}
                </div>
            ))}
            </div>}
            {(tabIndex === 1 && arrTabs && arrTabs.constructor === Array && arrTabs.length > 0) && <div className='box-emoji-content'>
              {arrTabs[tabIndex]['data'].map((vEmoji, index) => (
                <div key={'emoji-' + index} className='icon-emoji' onClick={e => this.addEmoji(e, index)}>{vEmoji}</div>
              ))}
            </div>}
            {([0,1].indexOf(this.state.tabIndex) === -1 && arrTabs.constructor === Array && arrTabs.length > 0) && <div className='box-emoji-content'>
              {arrTabs[tabIndex]['data'].map((sticker, index) => (
                <div key={'sticker' + tabIndex + index} className='icon-sticker' onClick={e => this.addSticker(e, arrTabs[tabIndex]['type'], index)}>
                  <img src={this.state.pathImg + '/' + arrTabs[tabIndex]['type'] + '/' + sticker} alt='' onError={(e)=>{e.target.onerror = null; e.target.src='./images/tabs/default.jpg'}} />
                </div>
              ))}
            </div>}
          
          </div>
          
          <div className='emoji-box-tail'><i className='icon-emoji_box-tail'></i></div>
        </div>
      </div>
    )
  }
}
RxSelectIcons.defaultProps = { onChange: () => { }, onClick: () => { } }
export default RxSelectIcons
