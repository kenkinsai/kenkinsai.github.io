import React, { Component } from 'react'

global.isclient && require('./rxSelectEmoji.css')
const { subString } = global.rootRequire('classes/ulti')
const { checkNameUser } = global.rootRequire('classes/chat')


class RxSelectEmoji extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {    
      arrTabs:{img: 'emoji.png', type: 'EmojiIcon', data: ['😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑','😈', '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦵', '🦶', '👂','💩']},
      
    }
  }

  tagName_SelectUser(ele) {  
    ele.name_contact = subString(checkNameUser(ele), 20)
    this.props.onClick(ele)              
  }
  addEmoji(e, index) {
    e.stopPropagation()
    let arrTabs = this.state.arrTabs
    //let tabIndex = this.state.tabIndex
    let value = arrTabs['data'][index] || ''
    this.props.onClick(value, 'EmojiIcon')
  }

  render() {

    let arrTabs = this.state.arrTabs || {data: []}    
    return (
      <div className='box-emojiTag--wrap'>       
        <div className='box-emojiTag'>
          <div className='emojiTag_List'>           
            <div className='box-emoji-content'>
              {arrTabs['data'].map((vEmoji, index) => (
                <div key={'emoji-' + index} className='icon-emoji' onClick={e => this.addEmoji(e, index)}>{vEmoji}</div>
              ))}
            </div>
          </div> 
          <div className='emojiTag-box-tail'><i className='icon-emojiTag-tail'></i></div>
        </div>
      </div>
    )
  }
}

RxSelectEmoji.defaultProps = {onChange: () => { }, onClick: () => { } 
}

// Options : {key: , text: }
export default RxSelectEmoji
