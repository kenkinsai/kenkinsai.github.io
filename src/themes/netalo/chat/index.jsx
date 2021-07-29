import React from 'react'
import Parser from 'html-react-parser'

const RxCall = global.rootRequire('components/shares/rxCall').default
const RxPopup = global.rootRequire('components/shares/rxPopup').default

const GroupsComponent = global.rootRequire('themes/netalo/chat/groups').default
const MessagesComponent = global.rootRequire('themes/netalo/chat/messages').default
const HeaderChatComponent = global.rootRequire('themes/netalo/chat/header').default

global.isclient && require('./index.css')

let adminCSS = '<style>.main-container{ width: 100% !important; padding: 0px !important; } .homenav, .footer{ display: none !important; }</style>'
export const renderBody = (vm) => {
  return (<div onClick={e => vm.checkClickOutside(e)}>
    <div>
      <RxCall />
      <RxPopup />
      <div className='zchat_left'>
        <div className='zleft_menu'>
          <div className='zmenu_message'>
            <img src={'./images/default/icons/chat-active.svg'} alt='' className='zmenu_icon icon filter_img_class' />
          </div>
          <div className='zmenu_call' onClick={()=>vm.props.setComp('call')}>
            <img src={'./images/default/icons/call.svg'} alt='' className='zmenu_icon icon' />
          </div>
          <div className='zmenu_contact' onClick={()=>vm.props.setComp('contact')}>
            <img src={'./images/default/icons/contact.svg'} alt='' className='zmenu_icon icon' />
          </div>
          <div className='zmenu_config' onClick={()=>vm.props.setComp('config')}>
            <img src={'./images/default/icons/config.svg'} alt='' className='zmenu_icon icon' />
          </div>
        </div>
        <GroupsComponent groups={vm.state.groups || [] }/>
      </div>
      
      <div className='zchat_right'>
        {vm.props.rxgroup.groupid ? 
        <div className='zright_contain'>
          <HeaderChatComponent />
          <MessagesComponent 
            tabmore={vm.state.tabmore || false}
            groups={vm.state.groups || [] }
            callBackRedirectChat={() => vm.callBackRedirectParent()}
          />
        </div>:
        <div className ='zright_contain_empty'>Chọn một cuộc trò chuyện để bắt đầu</div>
        }

      </div>      
    </div>
  </div>)
}

export const renderComponent = (vm) => {
  return (<div>
    {Parser(adminCSS)}
    {vm.renderBody()}
  </div>)
}