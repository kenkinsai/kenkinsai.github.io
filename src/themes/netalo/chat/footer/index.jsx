/*global translate*/  
import React from 'react'
import Parser from 'html-react-parser'
import ContentEditable from 'react-contenteditable'

const RxSelectIcons = global.rootRequire('components/shares/rxSelectIcons').default
const RxUploadFile = global.rootRequire('components/shares/rxUploadFile').default
const RxAudioRecord = global.rootRequire('components/shares/rxAudioRecord').default
const RxTagName = global.rootRequire('components/shares/rxTagName').default

const { rxaget } = global.rootRequire('classes/ulti')
const { checkNameUser } = global.rootRequire('classes/chat')

global.isclient && require('./index.css')
export const renderBody = (vm) => <div id="zchat_footer"
  style={{display:vm.state.isBlocked?"none":"block"}}
  className={(vm.state.tabmore.status === true) ? 'zchat_footer zchat_footer_padding' : 'zchat_footer'}>
  {(vm.state.typing) && <div className='zmessage_typing'>{vm.state.sender_typing + ' ' + translate('is typing') + ' ...'}</div>}
  <div id='menu-footer'> 
    <div className={'menu-message-box'}>
      {/*<div className='menu-option-footer' onClick={e => vm.chooseOptionFooter(e, 'copy')}>{translate('Copy')}</div>
      <div className='menu-option-footer' onClick={e => vm.chooseOptionFooter(e, 'cut')}>{translate('Cut')}</div>*/}
      <div className='menu-option-footer' onClick={e => vm.chooseOptionFooter(e, 'paste')}>{translate('Paste')}</div>
    </div>
  </div>

  {(rxaget(vm.state, 'mess_selected.message_id', '') && [1, 2].indexOf(vm.state.type_option) !== -1) && <div className='zchat_footer-box'>
    <div className='zmessage_option'>
    </div>
    <div className='zchat_box'>
      <div className='zchat_box'>
        <div className='zmessage_inputbox'>
          <div className='zchat_footer-reply'>
            <div className='zchat_reply_namesender'> {checkNameUser(rxaget(vm.users, rxaget(vm.state, 'mess_selected.sender_uin', ''), {})) || ''} </div>
            <div className='zchat_footer_reply_message_text '> {Parser(vm.parseMessage(rxaget(vm.state, 'mess_selected', {})))} </div>            
          </div>
        </div>
        <div className='zchat_footer-close' onClick={e => vm.closeReplyMessage()}>
          <img alt='icon-close' src={'./images/default/icons/icon-close.png'} />
        </div>
      </div>
    </div>
  </div>}

  <div className='zchat_footer-box'>
    <div className='zmessage_option'>
      <div className='zfooter_btn'>
        <RxUploadFile 
          group_id = {vm.state.group_id}
          userid={vm.userid}
          handleMessage={vm.props.handleMessage} 
          token={vm.token} 
          callback={(result, type) => vm.uploadFile(result, type)} 
          handleDragOut={vm.props.handleDragOut}
        />
      </div>
      <div className='zfooter_btn'><RxAudioRecord onClick={(result) => { vm.clickRecord(result) }}  group_id={vm.state.group_id} token={vm.token} callback={(result, type) => { vm.uploadFile(result, type) }} /></div>
      <div className='zfooter_btn'><RxSelectIcons onClick={(result, type) => { vm.addEmoji(result, type) }} /></div>
    </div>    
    <div className='zchat_box' onMouseDown={(e) => vm.onClickMouseRight(e)}>
      <div className='zmessage_inputbox'>
        <div className='chat-wrapper'>
          <div className='message-wrapper'>  
            <div className ={(vm.state.displayTagNameBox === true) && (vm.state.groupsTemp.length > 0) ? 'zmess-box_tagName' : 'zmess-box_tagName_hiden'}  >
              <RxTagName  groupsTemp={vm.state.groupsTemp } tagNameSelect={vm.state.tagNameSelect} onClick={(result) => { vm.tagName_SelectUser(result) }}/>
            </div>  
            {(vm.state.imageTmp && vm.state.imageTmp.base64) && <div className='load-image-footer'>
              <div className='image-copy-footer'>
                <img src={vm.state.imageTmp['base64']} alt='default' className='load-image-footer' />
                <div className='image_footer-close' onClick={e => vm.closeImageFooterLoader()}>
                  <img alt='icon-close' src={'./images/default/icons/icon-close.png'} />
                </div>
              </div>
            </div>}
            {/*(vm.state.imageTmp && vm.state.imageTmp.base64) && <div className='image_footer-close' onClick={e => vm.closeImageFooterLoader()}>
              <img alt='icon-close' src={'./images/default/icons/icon-close.svg'} />
            </div>*/}

            <ContentEditable
              html={vm.state.mess}
              className='message-text'
              id='zmess-box'
              data-placeholder={translate('Write a message')}
              onKeyPress={vm.disableNewlines}
              onPaste={vm.pasteAsPlainText}
              onChange={vm.handleContentEditable}
              onDrop={vm.disableDrop}
              
            />

          </div>
        </div>
      </div>
    </div>
    <div className='zmessage_like'>
      <div className='zfooter_btn'><img src={'./images/default/icons/likeicon.svg'} alt='likeicon' className='icons-btn icon32 filter_img_class' onClick={e => vm.sendLike()} /></div>
    </div>
  </div>
  <div></div>
</div>

export const renderComponent = (vm) => <div>
  {([1,2,3].indexOf(vm.state.isBlocked) !== -1) &&
    <div id="zchat_footer"      
      className={(vm.state.tabmore.status === true) ? 'zchat_footer zchat_footer_padding' : 'zchat_footer'}>
      <div className='blocked_chat'>
        <span>{(vm.state.isBlocked === 1 || vm.state.isBlocked === 3)? translate('This person has been blocked, cannot make calls or send messages'):
        translate('Currently, you cannot make contact to this person')} </span>
      </div>
      {(vm.state.isBlocked === 1 || vm.state.isBlocked === 3)&&<div className='blocked_chat'>
        <span className="newgroup-create-btn"
        onClick={ ()=> { vm.setState({ displayAskBlock: true })}}
        >{translate('Unblock contact')}</span>
      </div>}
    </div>}
  <div className={vm.state.displayAskBlock ? 'leaveGroup_rectangle' : 'leaveGroup_rectangle_hiden'}>
    <div className='leaveGroup_rectangle_2'>
      <div className='leaveGroup_rectangle_2_1'>
        <div className='leaveGroup_title'> {translate('Unblock contact')}</div>
        <div className='leaveGroup_body'>
          {translate('Are you sure you want to unblock this contact')}</div>
        <div className='leaveGroup_btnPlace'>
          <div className='leaveGroup_cancelBtn' onClick={e => { vm.setState({ displayAskBlock: false }) }} >{translate('Cancel')}</div>
          <div className='leaveGroup_okBtn' onClick={e => vm.onClickBlockContact()}>{translate('Accept')}</div>
        </div>
      </div>
    </div>
  </div>  
  {vm.renderBody()}
</div>