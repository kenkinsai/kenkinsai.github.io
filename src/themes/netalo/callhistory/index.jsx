/*global translate*/
import React from 'react'
import Parser from 'html-react-parser'

global.isclient && require('./index.css')
const { rxgetLocal } = global.rootRequire('classes/request')

let adminCSS = '<style>.main-container{ width: 100% !important; padding: 0px !important; } .homenav, .footer{ display: none !important; }</style>'
let zget = global.rxu.get
const { checkNameUser } = global.rootRequire('classes/chat')
const RxCall = global.rootRequire('components/shares/rxCall').default
const RxPopup = global.rootRequire('components/shares/rxPopup').default
const {rxChangeSlug} = global.rootRequire('classes/ulti')

const MessagesComponent = global.rootRequire('themes/netalo/chat/messages').default
const HeaderChatComponent = global.rootRequire('themes/netalo/chat/header').default
export const renderCallHistory = (vm) => {
  let usersinfo = zget(global.rxu.json(rxgetLocal('rxusers'), {}), 'users') || {}
  let netaCallHistory = []
  let eleCount = 1
  zget(vm.props, 'netaCallHistory.data', []).forEach((ele, index) => {
    ele.count = eleCount
    netaCallHistory.push(ele)
  })
  let lastEle = {}
  return <div className='zleft_contactlist'>
    <div id='context-menu-call-history'>
      <div className='context-menu-box-callhistory'>
        <div className='callhistory-menu_item'>
          <div className ='group-item-head'>
            <img className='group_img_item filter_img_class' src={'https://betaweb.netalo.vn/images/default/icons/icon-delete-chat.svg'}alt=''/>
          </div>
          <div className='group-item-info' onClick={e => vm.removeCallHistory()}>
            {translate('Delete Call History')}
          </div>
        </div>
      </div>
    </div>
    
    {vm.state.callHistory.map((ele, index) => {
      if (ele.call_id === lastEle.call_id) {
        return <div key={index} />
      } else {
        lastEle = ele
        let callId = zget(ele.callee_uins.filter((id) => (id !== zget(vm.props, 'netaauth.user.id'))), [0])
        let user = zget(usersinfo, [callId], {})        
        let sname = rxChangeSlug(checkNameUser(user)).slice(0, 2).toUpperCase()
        let background = `linear-gradient(120deg, ${stringToColour('FFF' + sname)}, #FFFFFF)`
        return <div className=' zcontact_maininfo_place zcontactitem zcontactitem-call clearfix' key={index} onClick={(e) => vm.onClickStartCallRender(e, ele, index)} onContextMenu={e => {vm.onRightClickGroup(e, ele)}}>
          <i className={vm.helpCallType(ele, true) + ' zcall_icon'} />
          <div className='zcontact_avatar'>
            {user.profile_url && <img src={`${global.rxu.config.cdn_endpoint}${user.profile_url}`} className='zcontact_avatarimg images-static' alt=''
              onError={(e) => { e.target.onerror = null; e.target.src = global.rxu.config.get_static + user.profile_url }} />
            }
            {!user.profile_url && <div className='ava-span' style={{ background: background }}>{sname}</div>}
          </div>
          <div className='zcontact_maininfo'>
            <div className={vm.helpCallName(ele) + ' zcontact_name'}>{checkNameUser(user)}</div>
            <div className='zcontact_status'>{vm.helpCallType(ele)}</div>
          </div>
          <div className='zcontact_date'>{vm.helpTimeText(ele.started_at)}</div>
        </div>
      }
      })
    }
  </div>
}

export const renderBody = (vm) => <div>
  <RxCall />
  <RxPopup />
  <div className='zchat_left'>
    <div className='zleft_menu'>
      <div className='zmenu_message' onClick={()=>vm.props.setComp('chat')}>
        <img src={'./images/default/icons/chat.svg'} alt='' className='zmenu_icon icon' />
      </div>
      <div className='zmenu_call'>
        <img src={'./images/default/icons/call-active.svg'} alt='' className='zmenu_icon icon filter_img_class' />
      </div>
      <div className='zmenu_contact' onClick={()=>vm.props.setComp('contact')}>
        <img src={'./images/default/icons/contact.svg'} alt='' className='zmenu_icon icon' />
      </div>
      <div className='zmenu_config' onClick={()=>vm.props.setComp('config')}>
        <img src={'./images/default/icons/config.svg'} alt='' className='zmenu_icon icon' />
      </div>
    </div>
    <div className='zleft_contain'>
      <div className='zleft_searchwrap'>
        <div>
          <input type='search' maxLength='30' className={zget(vm.props, 'themeBackgroudValue') === 'darkTheme' ?'zleft_search darkThemeInput':'zleft_search lightThemeInput'} placeholder={translate('Search Calls')} onChange={e => { vm.onChangeSearch(e, ) }} onDrop={vm.disableDrop}/>
        </div>
      </div>
      <div className='zleft_botline zleft_botline-marbot' />
      {vm.renderCallHistory()}
    </div>
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

export const renderFoot = (vm) => <div />

export const renderComponent = (vm) => <div>
  {Parser(adminCSS)}
  {vm.renderBody()}
  {vm.renderFoot()}
</div>

let stringToColour = function (str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}
