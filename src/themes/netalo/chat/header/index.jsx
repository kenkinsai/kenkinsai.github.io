/*global translate*/
import React from 'react'
const RxAccountInfo = global.rootRequire('components/shares/rxAccountInfo').default

const { rxChangeSlug, stringToColour, autoConvertTime, subString } = global.rootRequire('classes/ulti')
const { checkNameGroup, checkAvatarGroup} = global.rootRequire('classes/chat')

let zget = global.rxu.get
global.isclient && require('./index.css')

export const renderBody = (vm) => {
  return (
    <div>
      <div className='ztbar'>
        <div className='ztbar_avatar_header'>
          {(checkAvatarGroup(vm.state.group, vm.users, vm.userid))
            && <img src={vm.loadImgStatic(vm.state.group, 'group')} alt='' data-id={'group' + vm.state.group.group_id} className='ava-group_header images-static'
              onError={(e) => { e.target.onerror = null; e.target.src = vm.loadImgStatic(vm.state.group, 'group', global.rxu.config.get_static) }} />
          }
          {!(checkAvatarGroup(vm.state.group, vm.users, vm.userid)) &&<span className='ava-span_header' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + checkNameGroup(vm.state.group, vm.users, vm.userid).slice(0, 2).toUpperCase())}, #FFFFFF)` }}>{rxChangeSlug(checkNameGroup(vm.state.group, vm.users, vm.userid),true).slice(0, 2).toUpperCase()}</span>} 
        </div>        
        <div className='ztbar_left'>
          <div className='ztbar_name'>{subString(checkNameGroup(vm.state.group, vm.users, vm.userid), 200)}</div>
          <div className='ztbar_status'>
            {(zget(vm.state.group, 'type', 0) === 3) &&  vm.state.group && 
              (vm.state.group.partner_id || vm.state.group.occupants_uins[0]) && 
              vm.state.usersStatus[Number(vm.state.group.partner_id  || vm.state.group.occupants_uins[0])] &&
              (vm.state.usersStatus[Number(vm.state.group.partner_id  || vm.state.group.occupants_uins[0])].online_status === 1
                ? <span className='ztab-more-user_status'>Online</span> :
                vm.state.usersStatus[Number(vm.state.group.partner_id  || vm.state.group.occupants_uins[0])].last_seen_at > 0 ?
                  <span className='ztab-more-user_status'>
                    {translate('Last seen ')}
                    {autoConvertTime(vm.state.usersStatus[Number(vm.state.group.partner_id  || vm.state.group.occupants_uins[0])].last_seen_at)}
                  </span> : <span className='ztab-more-user_status'>Offline</span>)}
            {(zget(vm.state.group, 'type', 0) !== 3) && <span className='ztab-more-user_status'>
              {vm.uniqArray(zget(vm.state.group, 'occupants_uins', [])).length} {
              translate(' member')}{vm.state.countMemberOnl > 0 ? (', '+ vm.state.countMemberOnl+' Online'):''}</span>}

          </div>
        </div>
        <div className='ztbar_right'>

          {(zget(vm.state.group, 'type', 0) === 3 && !vm.state.isBlocked) && <div className='ztbar_btn ztbar_btncall filter_img_class' onClick={(e) => vm.onClickStartCall('voicecall')}><img src={'./images/default/icons/callright.svg'} alt='' className='icon-phone icon32' /></div>}
          {(zget(vm.state.group, 'type', 0) === 3 && !vm.state.isBlocked) && <div className='ztbar_btn ztbar_btnsearch filter_img_class' onClick={(e) => vm.onClickStartCall('videocall')}><img src={'./images/default/icons/videocall.svg'} alt='' className='icon-magnifier_icon32' /></div>}

          <div className={!(vm.state.tabmore === true || vm.state.tabmore.data === true) ? 'ztbar_btn ztbar_btnmore' : 'ztbar_btn  ztbar_btnmore ztbar_btn-active'} onClick={e => vm.onClickTabMore()}><img src={'./images/default/icons/menumore.svg'} alt='' className='icon-options icon32' /></div>
        </div>
      </div>
      { (vm.state.tabmore === true || vm.state.tabmore.data === true) ? <RxAccountInfo /> : null}
    </div>
  )
}

export const renderComponent = (vm) => {
  return (<div>
    {vm.renderBody()}
  </div>)
}