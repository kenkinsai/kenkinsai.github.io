/* global translate */ 
import React from 'react' 

// const RxModalEdit = global.rootRequire('components/shares/rxModalEdit').default
const RxSearchBox = global.rootRequire('components/shares/rxSearchBox').default
const { rxaget, autoConvertTime, rxChangeSlug, stringToColour } = global.rootRequire('classes/ulti')
const { parseMessageDesc } = global.rootRequire('classes/chat')
const RxModalMouseRightChat = global.rootRequire('components/shares/rxModalMouseRightChat').default
const RxManageGroup = global.rootRequire('components/shares/RxManageGroup').default

global.isclient && require('./index.css')

export const renderBody = (vm) => {
  // vm.state.groupsNChatCreate.sort(vm.compareContact)
  // vm.state.groupsNChat.sort(vm.compareContact)
  const linkava = global.rxu.config.get_avatar
  return (
    <div className='zleft_contain'>
      {vm.state.groupsSearchBoxClickStatus === false && vm.state.searchValue.length === 0 ?
      <div className='zleft_searchwrap'>
        <div className='icon_basic_search_area'>
          <img className='icon_basic_search filter_img_class'  src={'./images/default/icons/search-active.svg'} alt=''/>
        </div>

        <input type='search' maxLength='30' placeholder={translate('Search')} className={rxaget(vm.props, 'themeBackgroudValue') === 'darkTheme' ? 'zleft_search_place darkThemeInput':'zleft_search_place lightThemeInput'}  /*onChange={e => { vm.onChangeSearch(e) }}*/ onClick={e => {vm.groupsSearchBoxClick()}} onDrop={vm.disableDrop}></input>

        <div className='dropdown'>
          <div className='zleft_edit'>
            <img className='icon32 filter_img_class' src={'./images/default/icons/edit.svg'} alt=''/>
            <img className='icon32_white' src={'./images/default/icons/edit40x40.svg'} alt=''/>
          </div>
          { <div className='dropdown-content'>
              <div className='rectangle_1827'>
                <div >
                  <img  className='filter_img_class' src={'./images/default/icons/icon-basic-new-friend_group.svg'} alt=''/>
                  <span className='new_chat' onClick={e => { vm.createNewChatGroup() }} >
                    {translate('New Group Chat')}
                  </span>
                </div>
              </div>
            </div>
          }
        </div>

      </div>:
      <RxSearchBox 
        searchBoxvalue = {(clickStatus,searchValue)=>{vm.getSearchBoxvalue(clickStatus,searchValue)}}
        pageActive = {'chatPage'}        
        searchBox_chooseGroup = {(group)=>{vm.searchBox_chooseGroup(group)}}
        createNewChatGroup = {() => vm.createNewChatGroup()}        
        chooseContact = {()=>vm.chooseContact()}
        groupsSearchBoxClickStatus ={vm.state.groupsSearchBoxClickStatus}
        groups = {vm.state.groups}
        groupsNChatOrigin = {vm.state.groupsNChatOrigin}
      />

      }
      
      {vm.state.groupsSearchBoxClickStatus === false && vm.state.searchValue.length === 0 && 
      <div className='zleft_contactlist' id='zgroup_list' onScroll={vm.scrollGroupsChat}>
        <div>
          { vm.state.groupsDisplay.length > 0 ? (
              vm.state.groupsDisplay.map((ele, index) =>{
                return(<div className={(ele.group_id === vm.state.group_id) ? 'zgroupitem active clearfix' : 'zgroupitem clearfix'} key={index} onClick={e => { vm.chooseGroup(ele) }} onContextMenu={e => {vm.onRightClickGroup(e, ele)}}>             
                  <div className='zgroup_avatar'>                      
                    {ele.avatar_url 
                      ? 
                      <img src={global.rxu.config.get_static + ele.avatar_url} alt='avatar_url' className='ava-group images-static'
                      onError={(e) => { e.target.style.display = 'none' }} /> 
                      :
                      (vm.users[ele.partner_id] && vm.users[ele.partner_id]['profile_url'] 
                        ? <img src={`${global.rxu.config.cdn_endpoint}` + vm.users[ele.partner_id]['profile_url']} alt='profile_url' data-id={'userava' + ele.partner_id} className='ava-usergroup images-static' 
                        onError={(e) => {e.target.onerror = null; e.target.src = `${global.rxu.config.get_static}` + vm.users[ele.partner_id]['profile_url'] }} /> 
                         : vm.checkImage[linkava + ele.partner_id] && <img src={vm.checkImage[linkava + ele.partner_id]['link']} alt='linkava' className='ava-usergroup images-static' onError={(e) => { e.target.style.display = 'none' }} />
                      )
                    }
                    {
                      !(ele.avatar_url || (vm.users[ele.partner_id] && vm.users[ele.partner_id]['profile_url']) )
                      &&<span className='ava-span' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + rxaget(ele, 'group_id', '').slice(7,8) + rxaget(ele, 'group_fullname', '').slice(0, 1))}, #FFFFFF)` }}>
                        {rxChangeSlug(rxaget(ele, 'group_fullname', ''), true).slice(0, 2).toUpperCase()}
                      </span>  
                    }
                    

                  </div>                
                  
                  <div className='zgroup_maininfo'>                                  
                    <div className={vm.state.statusInput===''?'zgroup_name':'zgroup_name_hiden'}>
                      <div className='zgroup_name_info'>{rxaget(ele, 'group_fullname', '')}</div>
                      {vm.checkDisableNoti(ele.group_id )&&<img className ='zgroup_noti filter_img_class' src='./images/default/icons/Mask-Group-10.svg' alt='' />}
                    </div>
                    
                    <div className={vm.state.statusInput===''?'zgroup_desc':'zgroup_desc_hiden'}>
                    
                      <div className='zgroup_messageDesc'>{parseMessageDesc(rxaget(ele, 'last_message', {}), vm.users, vm.userid)} </div>
                      <div className = 'zgroup_icon-place'>
                        {vm.checkGroupSeen(ele) ? <span className='zgroup_count_unread'>{ (rxaget(ele, 'count_unread', 0) > 0) ? rxaget(ele, 'count_unread', 0) : rxaget(ele, 'unread_cnt', 0)}</span> : <span></span>}  
                        {vm.checkGroupsPinned_uins(ele.pinned_uins) && <img className ='pin-group-icon' src='./images/default/icons/pin-group.svg' alt='' />}
                      </div>                    
                    </div>
                    
                    <div className={vm.state.statusInput===''?'zgroup_status':'zgroup_status_hiden'}>{ele.status}</div>
                    <div className={vm.state.statusInput===''?'zgroup_time':'zgroup_time_hiden'}>
                      <span className='zgroup_time_checked'>
                        {vm.checkGroupSeen(ele) ? <img className ='filter_img_class' src={'./images/default/static/icon-checked.svg'} alt='' /> : ''} 
                      </span>
                      <span className='zgroup_time_last'>
                        {autoConvertTime(rxaget(ele, 'last_message.created_at', '')) || autoConvertTime(rxaget(ele, 'created_at', ''))}
                      </span>
                    </div>
                    <div className='divider_area'></div>
                  </div>
                </div>)
              })
            ) : (
              <div className={vm.state.statusInput===''?'zgroup-emty':'zgroup-emty_hiden'}>
                <img className='icon176x80 filter_img_class' src={'./images/default/icons/backgroundchat.svg'}alt=''/>
                <div className='zgroup-emty_text' >
                  {translate('You have not had any chat yet')} 
                </div>
              </div>
            )
          }
        </div>
        <div id='context_menu-group'>
          {vm.state.group_id !== '' && (
            <div className={'Rectangle-1773'/*vm.checkTypeChooseGroup() === 3 ? 'context_menu-group-box' : 'context_menu-group-box_hiden'*/}>
             
              <div className='group-menu_item border-bottom'>
                <div className ='group-item-head'>
                  <img className='group_img_item filter_img_class' src={'./images/default/icons/Group 10@3x.svg'}alt=''/>
                </div>
                <div className='group-item-info' onClick={e => vm.onClickShowPopup_ManageGroup()}>
                  {vm.state.groupChooseItem_selected.type !== 3 ? translate('Manage group') : translate('View profile')}
                </div>
              </div>
              
              <div className='group-menu_item border-bottom' onClick={e => vm.groupChooseItem(e, 'Mark as read')}>
                <div className ='group-item-head'>
                  <img className='group_img_item filter_img_class' src={'./images/default/icons/icon-chat-readed.svg'}alt=''/>
                </div>
                <div className='group-item-info'>{translate('Mark as read')}</div>
              </div>


              <div className={vm.state.notificationStatus === true ?'group-menu_item border-bottom':'group-menu_item_hiden'} onClick={e => vm.groupChooseItem(e, 'Turn off notifications')}>
                <div className ='group-item-head'>
                  <img className='group_img_item group_img_item_head filter_img_class' src={(!vm.state.notificationStatus) ? './images/default/icons/icon-unnotifi.svg' : './images/default/icons/icon-notifi.svg'} alt=''/>
                </div>
                <div className='group-item-info'>{vm.checkDisableNoti(vm.state.groupChooseItem_selected.group_id) === true ? translate('Turn on notifications') : translate('Turn off notifications')}</div>
              </div>

              <div className='group-menu_item border-bottom' onClick={e => vm.groupChooseItem(e, 'Pin a conversation')}>
                <div className ='group-item-head'>
                  <img className='group_img_item group_img_item_head filter_img_class' src={(!vm.checkGroupsPinned_uins(vm.state.groupChooseItem_selected.pinned_uins)) ? './images/default/icons/icon-pin.svg' : './images/default/icons/icon-unpin.svg'} alt=''/>
                </div>
                <div className='group-item-info'>{vm.checkGroupsPinned_uins(vm.state.groupChooseItem_selected.pinned_uins)=== false ? translate('Pin a conversation') : translate('Unpin a conversation')}</div>
              </div>

              {/* <div className='group-menu_item border-bottom' onClick={e => vm.groupChooseItem(e, 'Hide a conversation')}>
                <div className ='group-item-head'>
                  <img className='group_img_item filter_img_class' src={'./images/default/icons/icon-hide-chat.svg'}alt=''/>
                </div>
                <div className='group-item-info'>{translate('Hide a conversation')}</div>
                <div className='group-item-footer'>
                  <img className='group_img_item filter_img_class' src={'./images/default/icons/icon-unhide-chat.svg'}alt=''/>
                </div>
              </div> */}

              <div className='group-menu_item border-bottom'>
                <div className ='group-item-head'>
                  <img className='group_img_item filter_img_class' src={(vm.state.groupChooseItem_selected.type !== 3) ? './images/default/icons/ic_reply.svg' : './images/default/icons/icon-delete-chat.svg'}alt=''/>
                </div>
                <div className='group-item-info' onClick={e => vm.leaveGroupBtnClick()}>
                  {(vm.state.groupChooseItem_selected.type !== 3) ? translate('Leave group') : translate('Delete Conversation') }
                </div>
              </div>

              {/* <div className='group-menu_item ' onClick={e => vm.groupChooseItem(e, 'Delete')}>
                <div className ='group-item-head'>
                  <img className='group_img_item filter_img_class' src={'./images/default/icons/icon-delete-chat.svg'}alt=''/>
                </div>
                <div className='group-item-info'>{translate('Delete')}</div>
              </div> */}

            </div>
          )}
        </div>

        {vm.state.isShowPopup_ManageGroup && <RxManageGroup closePopup={e => vm.closePopup()} groupManager={vm.state.groupRightMouse} />}

        {vm.state.flagRightMouse && <div id='menu-mouseright-chat'><RxModalMouseRightChat group={vm.state.groupRightMouse}/></div>}

      </div>}
      

      
      
      <div className={vm.state.displayLeaveGroupScreen ? 'leaveGroup_rectangle' : 'leaveGroup_rectangle_hiden'}>        
        <div className='leaveGroup_rectangle_1'></div>      
        <div className='leaveGroup_rectangle_2'>      
          
        </div>      
      </div>
      {/* END leave group of context menu */}
    </div>
  )
}

export const renderComponent = (vm) => <div>
  {vm.renderBody()}
</div>


