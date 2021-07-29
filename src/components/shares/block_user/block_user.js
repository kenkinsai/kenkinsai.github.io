import React, { useState } from 'react';

import './block_user.css'
const rxio = global.rootRequire('classes/socket').default

const BlockUser = (props) => {
    let { 
        isBlocked, group, blockText, unBlockText, blockConfirmText, 
        unBlockConfirmText, acceptBtnText, cancelBtnText, onAfterBlockUser 
    } = props
    const [isDisplayPopup, setIsDisplayPopup] = useState(false);
    // console.log(props, 'BlockUser props')

    return <div className='block-user-wrapper'>
        {isDisplayPopup
            ? <div className='block-user-popup'>
                <div className='block_user-bg'></div>
                <div className='block_user_main'>
                    <div className='popup_blocke_user'>
                        <div className='block_user_title'> {!isBlocked ? blockText : unBlockText}</div>
                        <div className='block_user_body'>{!isBlocked ? blockConfirmText : unBlockConfirmText}</div>
                        <div className='block_user_btn_area'>
                            <div className='block_user_cancel'>
                                <div className='block_user_cancel_btn' onClick={e => setIsDisplayPopup(false)} >{cancelBtnText}</div>
                            </div>
                            <div className='block_user_accept'>
                                <div className='block_user_accept_btn'
                                    onClick={e => onClickBlockContact(group, !isBlocked, onAfterBlockUser, () => {
                                        setIsDisplayPopup(false)
                                        // setIsBlocked(!isBlocked)
                                    })}>
                                    {acceptBtnText}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            : <span className='block-user-text' onClick={() => setIsDisplayPopup(true)}>
                {!isBlocked ? blockText : unBlockText}
            </span>}
    </div>
}

export default BlockUser

const onClickBlockContact = (group, isBlocked, onAfterBlockUser, callback) => {
    // console.log(isBlocked, 'isBlocked')
    // console.log(onAfterBlockUser, 'onAfterBlockUser')
    // console.log(callback, 'callback')
    let type = isBlocked ? "unblock_user" : "block_user"
    rxio.blockUser({ group_id: group.group_id, uni: group.partner_id, type: type }, () => {
        // console.log(isBlocked, 'isBlocked')
        // console.log(group.partner_id, 'group.partner_id')
        group.blocked_uins = isBlocked ? [group.partner_id] : []
        onAfterBlockUser && onAfterBlockUser(group) //   that.props.chooseGroupAction(group)
    })
    callback && callback()
}