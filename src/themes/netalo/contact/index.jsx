/* global translate */ 
import React from 'react'
import Parser from 'html-react-parser'
global.isclient && require('./index.css')

const MessagesComponent = global.rootRequire('themes/netalo/chat/messages').default
const HeaderChatComponent = global.rootRequire('themes/netalo/chat/header').default
const RxModalEdit = global.rootRequire('components/shares/rxModalEdit').default
const RxSearchBox = global.rootRequire('components/shares/rxSearchBox').default
const RxPopup = global.rootRequire('components/shares/rxPopup').default
const RxCall = global.rootRequire('components/shares/rxCall').default

const { checkNameUser } = global.rootRequire('classes/chat')
const { rxChangeSlug } = global.rootRequire('classes/ulti')
const { rxgetLocal } = global.rootRequire('classes/request')

let zget = global.rxu.get
let adminCSS = '<style>.main-container{ width: 100% !important; padding: 0px !important; } .homenav, .footer{ display: none !important; }</style>'

export const renderContactList = (vm) => {
  let value = vm.state.inputSearchContact
  if(value.startsWith('0')){
      value = value.replace(value.charAt(0), '+84')
  }
  let contactTitle = ''
  return <div className={vm.state.groupsSearchBoxClickStatus === false && vm.state.searchValue.length === 0 ? 'zleft_contactlist': 'zleft_contactlist_hiden'}>
    <div id='context-menu-contact'>
      <div className='context-menu-box-contact'>
        <div className='group-menu_item'>
          <div className ='group-item-head'>
            <img className='group_img_item filter_img_class' src={'./images/default/icons/icon-delete-chat.svg'}alt=''/>
          </div>
          <div className='group-item-info' onClick={e => vm.removeContact()}>
            {translate('Delete Contact')}
          </div>
        </div>

        <div className='group-menu_item'>
          <div className ='group-item-head'>
            <img className='group_img_item filter_img_class' src={'./images/default/icons/icon_edit.svg'}alt=''/>
          </div>
          <div className='group-item-info' onClick={e => vm.editContact()}>
            {translate('Edit Name Contact')}
          </div>
        </div>

      </div>
    </div>
    {vm.state.registeredUsers && vm.state.registeredUsers.filter(ele =>((ele.phone || '').toLowerCase().includes((value || '').toLowerCase())|| (checkNameUser(ele) || '').toLowerCase().includes((value || '').toLowerCase()))).map((ele, index) => {
      let usersinfo = zget(global.rxu.json(rxgetLocal('rxusers'), {}), 'users') || {}
      let user = zget(usersinfo, [ele.Id], {})
      let sname = rxChangeSlug(checkNameUser(user)).slice(0, 2).toUpperCase()
      let background = `linear-gradient(120deg, ${stringToColour('FFF' + sname)}, #FFFFFF)`
      let eleContactTitle = rxChangeSlug(checkNameUser(ele,vm.userid,vm.props.netaauth)).slice(0,1)
      if(contactTitle !== eleContactTitle){
        ele.contactTitle = true
        contactTitle = eleContactTitle
      }else{
        ele.contactTitle = false
      }
      return <div className='zcontactitem clearfix' onClick={e => { vm.chooseContact(ele,false) }} key={index} onContextMenu={e => {vm.onRightClickGroup(e, ele)}}>
        
        {ele.contactTitle && <div className='zcontact_title'>{eleContactTitle}</div>}
        <div className='zcontact_maininfo_place'>
          <div className='zcontact_avatar' >
            {ele.profile_url && <img src={`${global.rxu.config.cdn_endpoint}${ele.profile_url}`} className='zcontact_avatarimg images-static' alt=''
              onError={(e) => { e.target.onerror = null; e.target.src = global.rxu.config.get_static + ele.profile_url }} />
            }
            {!ele.profile_url &&<div className='ava-span' style={{ background: background }}>{sname}</div>}
          </div>
          <div className='zcontact_maininfo'>
            <div className='zcontact_name'>{checkNameUser(ele,vm.userid,vm.props.netaauth)}</div>
            <div className='zcontact_status'>
                {
                  (vm.state.usersStatus[Number(ele.id)] &&
                  vm.state.usersStatus[Number(ele.id)].online_status === 1)
                    ? <span className='zcontact_online'>Online</span> :
                      <span className='zcontact_offline'>Offline</span>}
            </div>
          </div>
        </div>        
      </div>
    })}
  </div>
}

export const renderBody = (vm) => <div>
  <RxPopup />
  <RxCall />
  <div className='zchat_left'>  
    <div className='zleft_menu'>
      <div className='zmenu_message' onClick={()=>vm.props.setComp('chat')}>
        <img src={'./images/default/icons/chat.svg'} className='zmenu_icon icon' alt='' />
      </div>
      <div className='zmenu_call' onClick={()=>vm.props.setComp('call')}>
        <img src={'./images/default/icons/call.svg'} className='zmenu_icon icon' alt='' />
      </div>
      <div className='zmenu_contact'>
        <img src={'./images/default/icons/contact-active.svg'} className='zmenu_icon icon filter_img_class' alt='' />
      </div>
      <div className='zmenu_config' onClick={()=>vm.props.setComp('config')}>
        <img src={'./images/default/icons/config.svg'} className='zmenu_icon icon' alt='' />
      </div>
    </div>
    <div className='zleft_contain'>      
    {vm.state.groupsSearchBoxClickStatus === false && vm.state.searchValue.length === 0 ?
      <div className='zleft_searchwrap'>        
        <div className='icon_basic_search_area'>
          <img className='icon_basic_search filter_img_class'  src={'./images/default/icons/search-active.svg'} alt=''/>
        </div>
        <input type='search' maxLength='30' placeholder={translate('Search')} className={zget(vm.props, 'themeBackgroudValue') === 'darkTheme' ? 'zleft_search_place darkThemeInput':'zleft_search_place lightThemeInput'} placeholder={translate('Search')} autoComplete='off'  onDrop={vm.disableDrop} onClick={e => {vm.groupsSearchBoxClick()}}></input>

        <div className='dropdown'>
          <div className='zleft_edit' onClick={e=>{vm.setState({displayAddContact:true})}} >
            <img className='icon32 filter_img_class' src={'./images/default/icons/edit.svg'} alt=''/>
            <img className='icon32_white' src={'./images/default/icons/edit40x40.svg'} alt=''/>
          </div>
          </div>
      </div>:
      <RxSearchBox 
        searchBoxvalue = {(clickStatus,searchValue)=>{vm.getSearchBoxvalue(clickStatus,searchValue)}}
        pageActive = {'contactPage'}
        onClickAddContact ={()=>vm.setState({displayAddContact:true})}
        searchBox_chooseGroup = {(group)=>{vm.chooseGroup(group)}}
        chooseContact ={(contact) => {vm.chooseContact(contact,true)}}
        groupsSearchBoxClickStatus ={vm.state.groupsSearchBoxClickStatus}
        groups = {vm.state.groups}
        groupsNChatOrigin = {vm.state.groupsNChatOrigin}
      />}
      {
        (global.rxu.get(vm.props, 'netaRegisteredUsers.data', []).length > 0) ?
          (vm.renderContactList())
          :
          (<div className='zgroup-emty'>
            <img className='icon176x80 filter_img_class' src={'./images/default/icons/background-contact.svg'} alt='' />
            <div className='zgroup-emty_text' >
              {translate('You have not had any chat yet')} 
            </div>
          </div>)
      }
    </div>
  </div>
  <div className='zchat_right'>
    {vm.props.rxgroup.groupid ? <div className='zright_contain'>
      <HeaderChatComponent />
      <MessagesComponent 
        tabmore={vm.state.tabmore || false}
        groups={vm.state.groups || [] }
        callBackRedirectChat={() => vm.callBackRedirectParent()}
      />
    </div>:
    <div className ='zright_contain_empty'>Chọn một cuộc trò chuyện để bắt đầu</div>
    }
    {(vm.state.displayAddContact === true) && 
      <RxModalEdit 
        onClickModalEdit={() => {vm.setState({displayAddContact:false, flagEdit: false, contactInfo: {}})}}
        onSubmitContact={vm.onSubmitContact}
        flagEdit={vm.state.flagEdit}
        contactInfo={vm.state.contactInfo}
    />}
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
