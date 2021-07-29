/*global translate*/
import React from 'react'
const { rxgetLocal } = global.rootRequire('classes/request')
const { rxaget } = global.rootRequire('classes/ulti')
const { checkNameUser } = global.rootRequire('classes/chat')
global.isclient && require('./rxCall.css')

export const renderComponent = (vm) => {
  return (<div>
  	{ vm.state.flagCalling && vm.renderZCall() }
  </div>)
}

export const renderZCall = (vm) => {
  let typeCall = rxaget(vm.callObj, 'media_type', 1)
  let remote_uin = rxaget(global.rxu.array(rxaget(vm.callObj, 'callee_uins', [])).filter(ele => (ele !== vm.userid.toString())), '0', '')
  let objUsers = vm.users
  if (!objUsers[remote_uin]) {
    let rxusers = rxgetLocal('rxusers')
    try { if (typeof(rxusers) !== 'undefined') { objUsers = JSON.parse(rxusers) } } catch(e) {}
  }
  let uname = (objUsers[remote_uin]) ? checkNameUser(objUsers[remote_uin]) : ''
  
  return <div className='zchat_callscreen'>
	  
  	<div className='zchat_callscreen_bg'></div>

    {vm.state.ringtone && <audio controls autoPlay hidden loop>
      <source src='./sounds/soundcallmess.mp3' type='audio/mpeg' />
    </audio>}

  	<div className='zchat_callscreen_main'>
  		<div className='zchat_callcenter'>
  			<img className='zchat_callbox_close' alt='' src={'./images/default/icons/icon-close.png'} onClick={e => vm.onClickStopCall()}/>
  			<div className='zchat_callbox'>
	        <div className='zchat_callInfo'>

		        <div className='zcall_container'>
		        	<div className='zcall_info'>{uname}</div>
              {!vm.state.flagStartCall && <div className='zcall_content'>
                {translate('Contacting...')}
              </div>}
              {vm.state.flagStartCall && <div className='zcall_content'>
                {rxaget(vm.state.time, 'm', '00')}:{rxaget(vm.state.time, 's', '00')}
              </div>}

	            <div className='zcall_avatar'>
                <img className='zcall_avatarimg' src={`${global.rxu.config.cdn_endpoint}` + rxaget(objUsers, remote_uin+'.profile_url', '')} alt='profile_url' onError={(e)=>{e.target.onerror = null; vm.getAvatar(e, rxaget(objUsers, remote_uin, {}))}} /> 
              </div>
              
	            <div className='zcall_buttons' id='zcall_buttons'>
	            	<div className='zcall_group_button'>
                  {vm.state.flagStartCall && <div className='zcall_button' onClick={e => vm.changeFlagMic()}>
                    <img className='zcall_btn zcall_btn_bg' alt='' src={'./images/default/icons/mic_enable.svg'} style={(vm.state.flagMic) ? {display: 'block'} : {display: 'none'}} />
                    <img className='zcall_btn zcall_btn_border' alt='' src={'./images/default/icons/mic_disable.svg'} style={(vm.state.flagMic) ? {display: 'none'} : {display: 'block'}}/>
                  </div>}
                  {(vm.state.flagStartCall && typeCall === 1) && <div className='zcall_button' onClick={e => vm.changeFlagCamera()}>
                    <img className='zcall_btn zcall_btn_border' alt='' src={'./images/default/icons/call_video_enable.svg'} style={(!vm.state.flagCamera) ? {display: 'block'} : {display: 'none'}}/>
                    <img className='zcall_btn zcall_btn_bg' alt='' src={'./images/default/icons/call_video_disable.svg'} style={(vm.state.flagCamera) ? {display: 'block'} : {display: 'none'}} />
                  </div>}
	                <div className='zcall_button' >
	                  <img className='zcall_cancel' alt='' src={'./images/default/icons/cancelcall.png'} onClick={e => vm.onClickStopCall()} />
	                </div>
                  {(!vm.state.flagStartCall && !vm.isRoomCreator) && <div className='zcall_button' >
	                  <img className='zcall_answer' alt='' src={'./images/default/icons/acceptcall.png'} onClick={e => vm.acceptCall()} />
	                </div>}

	              </div>
	            </div>
	          </div>
	        </div>
	      </div>
	    </div>

	    <div className='zchat_videocallcenter' style={((typeCall === 2 || vm.state.flagCamera) && vm.state.flagStartCall) ? {display: 'block'} : {display: 'none'}}>
        <div className='zchat_videocallinfo'>
          <div className='zcall_info'>{uname}</div>
          <div className='zcall_content'>
            {rxaget(vm.state.time, 'm', '00')}:{rxaget(vm.state.time, 's', '00')}
          </div>
        </div>  

        <div className='zchat_videocallmain'>
          <div className='zchat_videocall_remote'>
            <video id="remote-video" autoPlay="autoplay"></video>
          </div>

          <div className='zchat_videocall_local'>
            <video id="local-video" autoPlay="autoplay" muted="muted"></video>
          </div>
        </div>

        <div className='zcall_buttons' id='zcall_buttons'>
          <div className='zcall_group_button'>
            {vm.state.flagStartCall && <div className='zcall_button' onClick={e => vm.changeFlagMic()}>
              <img className='zcall_btn zcall_btn_bg' alt='' src={'./images/default/icons/mic_enable.svg'} style={(vm.state.flagMic) ? {display: 'block'} : {display: 'none'}} />
              <img className='zcall_btn zcall_btn_border' alt='' src={'./images/default/icons/mic_disable.svg'} style={(vm.state.flagMic) ? {display: 'none'} : {display: 'block'}}/>
            </div>}
            {(vm.state.flagStartCall && typeCall === 1) && <div className='zcall_button' onClick={e => vm.changeFlagCamera()}>
              <img className='zcall_btn zcall_btn_border' alt='' src={'./images/default/icons/call_video_enable.svg'} style={(!vm.state.flagCamera) ? {display: 'block'} : {display: 'none'}}/>
              <img className='zcall_btn zcall_btn_bg' alt='' src={'./images/default/icons/call_video_disable.svg'} style={(vm.state.flagCamera) ? {display: 'block'} : {display: 'none'}} />
            </div>}
            <div className='zcall_button' >
              <img className='zcall_cancel' alt='' src={'./images/default/icons/cancelcall.png'} onClick={e => vm.onClickStopCall()}  />
            </div>

          </div>
        </div>
      </div>
  	</div>
    
  </div>
}