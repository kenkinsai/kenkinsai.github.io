/*eslint-disable no-undef*/
/*global translate*/
import { connect } from 'react-redux'
import React, { Component, Fragment } from 'react'

const { rxaget, timeConverter, rxChangeSlug, stringToColour, idToColor, formatBytes, secondToTime, rxconfig } = global.rootRequire('classes/ulti')
const { checkAvatarSender, checkIsOwner, checkName, checkNameUser } = global.rootRequire('classes/chat')

let zget = global.rxu.get

class MessageItem extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {

    }
    this.currentMsg = {}
    this.lastSeenMessId = ''
    this.urllinkId = ''
  }

  shouldComponentUpdate(nextProps, nextState) { 
    if (
        zget(nextProps.currentMsg, 'message_id', '') === zget(this.currentMsg, 'message_id', '') ||
        zget(nextProps.currentMsg, 'status', '') === zget(this.currentMsg, 'status', '') ||
        zget(nextProps.currentMsg, 'type', '') === zget(this.currentMsg, 'type', '')

    ) {      
      let group_id = this.props.group_id
      if( group_id &&
        nextProps.lastSeenMessObj && 
        this.props.lastSeenMessObj &&
        this.props.lastSeenMessObj[group_id] &&
        nextProps.lastSeenMessObj[group_id] &&
        (Number(zget(this.currentMsg, 'message_id', ''))  > Number(this.props.lastSeenMessObj[group_id].lastSeenMessId)) && 
        (Number(zget(this.currentMsg, 'message_id', ''))  <= Number(nextProps.lastSeenMessObj[group_id].lastSeenMessId))   
      ) {
        return true
      } else if (nextProps.netaLink && nextProps.netaLink.uid && this.urllinkId !== nextProps.netaLink.uid ) {
        this.urllinkId = nextProps.netaLink.uid
        return true
      } else {
        return false   
      }
    } else {
      return true
    } 
  }

  render() {
    console.log('Render Message Item')
    
    const occupants_uins = rxaget(this.props, 'group.occupants_uins', [])    
    const currentMsg = JSON.parse(JSON.stringify(this.props.currentMsg)) || {} 
    this.currentMsg = currentMsg
    const lastSeenMessObj = this.props.lastSeenMessObj
    const group_id = this.props.group_id
    let lastSeenMessId = ''
    
    if(lastSeenMessObj && group_id && lastSeenMessObj[group_id]){
      lastSeenMessId = lastSeenMessObj[group_id].lastSeenMessId
    }  
    
    return (
      <div className={checkIsOwner(currentMsg, this.props.userid) ? 'zmessage_content_right' : 'zmessage_content'}>
        <div className='zmessage_box'>
          <div className={(currentMsg.type === 0) ? (this.props.userid.toString() === currentMsg.sender_uin.toString()) 
            ? 'zmessage_text my_message' : 'zmessage_text another_message' : 'zmessage_text static_message'}>
            <div className='another_message_box'>
              { ((this.props.index > 0 && currentMsg.sender_uin !== this.props.arr[this.props.index-1].sender_uin) || this.props.index === this.props.firstMessageIndex || this.props.isShowUserName5Minute) &&
                ((this.props.occupants_uins && this.props.occupants_uins.length > 2) 
                && (this.props.userid.toString() !== currentMsg.sender_uin.toString())) 
                ?
                  <div className={currentMsg.type === 0 ? 'zbg_mess' : ''}>
                    <div id='stsender_name' className={(currentMsg.type !== 0) ? (currentMsg.type === 9 ? ' zsender_name_type9 ' : 'zsender_name_basic mess_type0') : 'zsender_name_basic'} style={{ color: `${idToColor(currentMsg.sender_uin.toString())}` }} onClick={e => this.props.onClickNameUser(currentMsg.sender_uin)} >
                      {checkNameUser(rxaget(this.props.users, currentMsg.sender_uin, {})) || currentMsg.sender_name.toString()}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: this.props.strMessage }} />
                  </div>
                :
                  <div dangerouslySetInnerHTML={{ __html: this.props.strMessage }} />
              }

              {([8,9].indexOf(currentMsg.type) === -1 ) && <div className='zmessage_time'> {timeConverter(currentMsg.created_at, 'minute')} </div>}
            </div>
          </div>
          {
            (
              checkIsOwner(currentMsg, this.props.userid) &&
              (
                ( this.props.lastSeenMessObj && this.props.lastSeenMessObj[this.props.group_id] && Number(currentMsg.message_id) <= Number(lastSeenMessId)) 
                || occupants_uins.length < 2
              )
            )         
            && <div className='zmessage_seen'>
              <img className='zmessage_seen_icon filter_img_class' alt='readed-icon' src={'./images/default/icons/readed-icon.svg'}/> 
              </div>
          }
          {
            checkIsOwner(currentMsg, this.props.userid) && this.props.lastSeenMessObj && this.props.lastSeenMessObj[this.props.group_id]                      
            && Number(currentMsg.message_id) > Number(lastSeenMessId)    
            && occupants_uins.length >= 2        
            && <div className='zmessage_seen'>
              <img className='zmessage_seen_icon filter_img_class' alt='readed-icon' src={'./images/default/static/icon-checked.svg'}/> 
            </div>
          }

        </div>
      </div>
    )
  }
}

export default MessageItem