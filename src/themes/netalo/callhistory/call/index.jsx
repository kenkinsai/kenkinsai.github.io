import React from 'react'

/* global translate*/
let zget = global.rxu.get
const { rxgetLocal } = global.rootRequire('classes/request')

export const renderZCall = (vm) => {
    let usersinfo = zget(global.rxu.json(rxgetLocal('rxusers'), {}), 'users') || {}
    let callId = zget(zget(vm.state, 'objsCalling.callee_uins', []).filter((id) => (id !== zget(vm.props, 'netaauth.user.id'))), [0])
    let user = zget(usersinfo, [callId], {})
    let uname = zget(usersinfo, [callId, 'full_name'])
    return (!!vm.props.obj.flagCalling && <div className='zchat_callscreen'>
        <div className='zcall_container'>
            <video id='localVideo' autoPlay muted width='200' height='200' />
            <video id='remoteVideo' autoPlay width='200' height='200' />
            <div className='zcall_avatar'>
                {!!user.profile_url ? <img src={`${global.rxu.config.base_api_neta}/avatar/${callId}`} onError={(e) => global.imgError(e)} className='zcall_avatarimg 2' alt=' ' />
                    : (
                        <img className='zcall_avatarimg 2' alt='avadefault' src={'./images/default/static/avadefault.svg'} />
                    )}
            </div>
            <div className='zcall_info'>{uname}</div>
            <div className='zcall_content'>
                {translate('Contacting...')}
            </div>
            <div className=' zcall_buttons'>
                {
                    (vm.props.callType === 1 || vm.props.callType === 2) ?
                        (<div className='zcall_group_button'>
                            <div className='zcall_button icon-microphone ' />
                            <div className='zcall_button icon-volume-2' />
                            <div onClick={vm.onClickStopCall.bind(vm)} className='zcall_button' >
                                <img className='icon40 zcall_cancel' alt='' src={'./images/default/icons/cancelcall.png'} />
                            </div>
                        </div>)
                        :
                        (
                            <div className='zcall_group_2button'>
                                <div onClick={vm.onClickStopCall.bind(vm)} className='zcall_button' >
                                    <img className='icon40 zcall_cancel' alt='' src={'./images/default/icons/cancelcall.png'} />
                                </div>
                                <div onClick={vm.onClickAnswerCall.bind(vm)} className='zcall_button' >
                                    <img className='icon40 zcall_answer' alt='' src={'./images/default/icons/answercall.png'} />
                                </div>
                                {
                                    !vm.props.flagTurnOffSoundCall ?
                                        (<audio controls autoPlay hidden loop>
                                            <source src='./sounds/soundcallmess.mp3' type='audio/mpeg' />
                                        </audio>) :
                                        (null)
                                }
                            </div>
                        )
                }
            </div>
        </div>
    </div>
    )
}

export const renderComponent = (vm) => <div>
    {vm.renderZCall()}
</div>