import React, { Suspense } from 'react'
/*global translate*/
const { timeConverter, rxaget, rxChangeSlug, stringToColour, idToColor } = global.rootRequire('classes/ulti')
const FooterChatComponent = global.rootRequire('themes/netalo/chat/footer').default
const { checkAvatarSender, checkIsOwner, checkName, checkNameUser } = global.rootRequire('classes/chat')
const RxImageGallery = global.rootRequire('components/shares/rxImageGallery').default
const RxGroupsList = global.rootRequire('components/shares/rxGroupList').default
const RxInfoUser = global.rootRequire('components/shares/rxInfoUser').default
const RxDragAndDrop = global.rootRequire('components/shares/rxDragAndDrop').default

let zget = global.rxu.get
const PinComponent = global.rootRequire('themes/netalo/chat/pin_modal').default
const MessageItem = global.rootRequire('themes/netalo/chat/message_item').default
// const PinComponent = React.lazy(() => import("../pin_modal"));
global.isclient && require('./index.css')

export const renderBody = (vm) => <div id='idzchat' className=' zchat'>
  <div className='zchattab_body'>
    {vm.state.displayDragAndDrop && 
      <RxDragAndDrop 
        token={vm.token}
        group_id={vm.state.group_id} 
        handleMessage={vm.handleMessage}
        userid={vm.userid}
        handleDragOut={ e => vm.handleDragOut(e)}
      >    
      </RxDragAndDrop >
    }

    <div id='zchat_body' ref={vm.dropRef_Mess}  className={(vm.state.tabmoreNextprop === true) ? 'zchat_body-active' : 'zchat_body'} >
        <div className='zchat_list' id='zchat_list' 
          onScroll={vm.scrollChatBox}>
          {Object.keys(vm.state.messages).map((odate) => {
            let firstMessageIndex = 0
            return <div key={odate}>
              <div className='zchat_row_child'> 
                {timeConverter(odate, 'dateweek')} 
              </div>
              {(vm.state.messages 
                && vm.state.messages[odate] 
                && vm.state.messages[odate]['data']) 
                && vm.state.messages[odate]['data'].map((currentMsg, i, arr) => {
                
                let isShowAvatar5Minute = false
                let isShowUserName5Minute = false
                let previousMsg = i > 0 ? arr[i-1] : null
                if(previousMsg && [5, 6, 7].indexOf(previousMsg.type) === -1 && currentMsg.sender_uin === previousMsg.sender_uin) 
                { 
                  let dateDiff = Math.floor(Math.abs(Number(previousMsg.created_at / 1000000) - Number(currentMsg.created_at / 1000000)))
                  isShowUserName5Minute = (dateDiff >= 300) ? true : false
                }
                
                let nextMsg = i+1 < arr.length ? arr[i+1] : null
                if(nextMsg && [5, 6, 7].indexOf(nextMsg.type) === -1 && currentMsg.sender_uin === nextMsg.sender_uin) 
                {
                  let dateDiff = Math.floor(Math.abs(Number(nextMsg.created_at / 1000000) - Number(currentMsg.created_at / 1000000)))
                  isShowAvatar5Minute = (dateDiff >= 300) ? true : false
                }

                if([5, 6, 7].indexOf(currentMsg.type) !== -1) firstMessageIndex++

                const strMessage = vm.parseMessage(currentMsg) || ''
                
                return <div key={currentMsg.message_id}
                  className={(strMessage.length === 0 ? 'parseMessage_hiden' : ((rxaget(vm.state, 'mess_id', '') !== currentMsg.message_id.toString()) ? 'zmessage_row': 'zmessage_row zchat_row-selected')) } 
                  /*className = {(rxaget(vm.state, 'mess_id', '') !== currentMsg.message_id.toString()) ? 'zmessage_row': 'zmessage_row zchat_row-selected'}*/
                  onMouseDown={(e) => vm.onClickMouseRight(e, currentMsg)}>                
                  {([5, 6, 7].indexOf(currentMsg.type) === -1) 
                    ? <div> 
                      { ((i+1 < arr.length && (currentMsg.sender_uin !== arr[i+1].sender_uin || [5, 6, 7].indexOf(arr[i+1].type) !== -1)) 
                        || i+1 === arr.length || isShowAvatar5Minute )
                        && !checkIsOwner(currentMsg, vm.userid) 
                        && <div className='zmessage_colava'>
                            <div className='zmessage_avasender' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + checkName(currentMsg.sender_uin, vm.users, 'avatar'))}, #FFFFFF)`}} onClick={e => vm.onClickInfoUser(rxaget(vm.users, currentMsg.sender_uin, {}))}>
                              { checkAvatarSender(currentMsg, vm.users) && <img src={global.rxu.config.cdn_endpoint + vm.users[currentMsg.sender_uin.toString()].profile_url} alt=''
                                data-id={'sender' + currentMsg.sender_uin}
                                className={'ava-sender images-static'}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = global.rxu.config.get_static + vm.users[currentMsg.sender_uin.toString()].profile_url
                                }} />
                              }
                              <span className='avatar-sender'>
                                {rxChangeSlug(checkNameUser(vm.convertOmessUser(currentMsg))).slice(0, 2).toUpperCase()}
                              </span>
                          </div>
                        </div>
                      }
                      <MessageItem 
                        currentMsg={currentMsg} 
                        users={vm.users}
                        userid={vm.userid}
                        group_id={vm.state.group_id}
                        strMessage={strMessage}   
                        occupants_uins={vm.state.group.occupants_uins} 
                        lastSeenMessObj={vm.state.lastSeenMessObj}  
                        index={i}
                        arr={arr}
                        firstMessageIndex={firstMessageIndex}
                        isShowUserName5Minute={isShowUserName5Minute}  
                        onClickNameUser={vm.onClickNameUser}    
                        group={vm.state.group} 
                        netaLink={rxaget(vm.props, 'netaLink.data.' + currentMsg.group_id + '-' + currentMsg.message_id, {})} 
                      />

                      {/*<div className={checkIsOwner(currentMsg, vm.userid) ? 'zmessage_content_right' : 'zmessage_content'}>
                        <div className='zmessage_box'>
                          <div className={(currentMsg.type === 0) ? (vm.userid.toString() === currentMsg.sender_uin.toString()) 
                            ? 'zmessage_text my_message' : 'zmessage_text another_message' : 'zmessage_text'}>
                            <div className='another_message_box'>
                              {
                              ((i > 0 && currentMsg.sender_uin !== arr[i-1].sender_uin) || i === firstMessageIndex || isShowUserName5Minute) &&
                                ((vm.state.group.occupants_uins && vm.state.group.occupants_uins.length > 2) 
                                && (vm.userid.toString() !== currentMsg.sender_uin.toString())) 
                                ?
                                  <div className={currentMsg.type === 0 ? 'zbg_mess' : ''}>
                                    <div id='stsender_name' className={(currentMsg.type !== 0) ? (currentMsg.type === 9 ? ' zsender_name_type9 ' : 'zsender_name_basic mess_type0') : 'zsender_name_basic'} style={{ color: `${idToColor(currentMsg.sender_uin.toString())}` }} onClick={e => vm.onClickInfoUser(rxaget(vm.users, currentMsg.sender_uin, {}))} >
                                      {checkNameUser(rxaget(vm.users, currentMsg.sender_uin, {})) || currentMsg.sender_name.toString()}
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: strMessage }} />
                                  </div>
                                :
                                  <div dangerouslySetInnerHTML={{ __html: strMessage }} />
                              }
                            </div>
                          </div>

                          {
                            // rxaget(vm.props, 'rxgroup.group', {}).type === 3 && 
                            checkIsOwner(currentMsg, vm.userid) && vm.state.lastSeenMessObj && vm.state.lastSeenMessObj[vm.state.group_id]
                            && currentMsg.message_id <= vm.state.lastSeenMessObj[vm.state.group_id].lastSeenMessId                           
                            && <div className='zmessage_seen'>
                              <img className='zmessage_seen_icon filter_img_class' alt='readed-icon' src={'./images/default/icons/readed-icon.svg'}/> 
                              </div>
                          }
                          {
                            // console.log(currentMsg.message_id,'message_id')
                          }
                          
                          {
                            // rxaget(vm.props, 'rxgroup.group', {}).type === 3 && 
                            checkIsOwner(currentMsg, vm.userid) && vm.state.lastSeenMessObj && vm.state.lastSeenMessObj[vm.state.group_id]                      
                            && currentMsg.message_id > vm.state.lastSeenMessObj[vm.state.group_id].lastSeenMessId                           
                            && <div className='zmessage_seen'>
                              <img className='zmessage_seen_icon filter_img_class' alt='readed-icon' src={'./images/default/static/icon-checked.svg'}/> 
                            </div>
                          }
                          <div className='zmessage_time'> {timeConverter(currentMsg.created_at, 'minute')} </div>
                        </div>
                      </div>*/}
                    </div>
                    : <div className='zchat_row_child'> {strMessage} </div>}
                </div>
              })}
            </div>
          })}
        </div>
    </div>
    <div id='menu-message'> 
      {(vm.state.mess_id !== '') && <div className={(vm.checkTypeDelMess() === 4) ||([1,10].indexOf(rxaget(vm.state, 'mess_selected.type', '')) !== -1 && rxaget(vm.state, 'mess_selected.sender_uin', '') !== vm.userid.toString()) ? 'menu-message-box_hiden' : 'menu-message-box'}>
        {vm.checkTypeDelMess() === 3 &&
          <div>
            <div className='menu-option' onClick={e => vm.chooseOption(e, 'reply')}>{translate('Reply')}</div>
            {!([2, 3, 4, 12 ].indexOf(rxaget(vm.state, 'mess_selected.type', '')) !== -1) && <div className='menu-option' onClick={e => vm.chooseOption(e, 'copy')}>{translate('Copy')}</div>}
            <div className='menu-option' onClick={e => vm.chooseOption(e, 'forward')}>{translate('Forward')}</div>
            {(vm.checkPinMess() === 1) &&
              <div className='menu-option' onClick={e => vm.chooseOption(e, 'pin')}>{translate('Pin')}</div>}
            {(vm.checkPinMess() === 2) &&
              <div className='menu-option' onClick={e => vm.chooseOption(e, 'unpin')}>{translate('Unpin')}</div>}
          </div>}
        {(rxaget(vm.state, 'mess_selected.sender_uin', '') === vm.userid.toString()) && <div className='menu-option' onClick={e => vm.chooseOption(e, 'delete_all')}>{translate('Delete with everyone')}</div>}
        {(rxaget(vm.state, 'mess_selected.sender_uin', '') === vm.userid.toString()) && <div className='menu-option' onClick={e => vm.chooseOption(e, 'delete_one')}>{translate('Delete only me')}</div>}
      </div>}

    </div>
    { vm.state.displayScrollDownBtn === true && <div className={(vm.state.tabmoreNextprop === true) ?'scrollDownBtn_place scrollDownBtn_place_margin_right':'scrollDownBtn_place'} onClick={e => vm.scrollDownChatList(e)}>    
        <i className="scrollDownBtn"></i>
    </div>}
    
    <Suspense fallback={<div className="loading"><div className="dot-flashing"></div></div>}>
      <PinComponent
        pinedMess={vm.state.pinedMess}
        users={vm.users}
        parseMessage={vm.parseMessage}
        pin_mess_id={vm.state.pin_mess_id}
        userid={vm.userid}
        unPin={vm.unPin}
        themeValue={zget(vm.props, 'themeValue')}
        convertOmessUser={vm.convertOmessUser}
        group={vm.state.group}
        group_id={vm.state.group_id}
        modalPin={vm.state.modalPin}
        checkgallery ={vm.state.checkgallery}
        tabmoreNextprop={vm.state.tabmoreNextprop}
      />
    </Suspense>

    <FooterChatComponent
      group_id={vm.state.group_id}
      mess_selected={vm.state.mess_selected}
      type_option={vm.state.type_option}
      isForwardAudio = {vm.state.isForwardAudio}
      reloadStateWhenRepMess={vm.reloadStateWhenRepMess}
      handleMessage={vm.handleMessage}
      resetSelectedMess={vm.resetSelectedMess}
      convertTagName={vm.convertTagName}
      handleDragOut={ e => vm.handleDragOut(e)}
    />
    {vm.state.checkgallery && <RxImageGallery images={vm.state.galleryImages} closeShowGallery={() => vm.closeGallery()} position={vm.state.galleryPosition} />}
    {vm.state.popupGroup && <RxGroupsList closePopupGroup={() => vm.closePopupGroup()} chooseGroupForward={(groupfw) => vm.chooseGroupForward(groupfw)} />}
  </div>
</div >

export const renderComponent = (vm) => {
  return <div>
    {vm.renderBody()}
    {vm.state.infoUserScreen && <RxInfoUser userClick_group={vm.state.userClick_group} closePopupInfoUser={() => vm.closePopupInfoUser()} userInfo={vm.state.userInfo} ownerInfo={rxaget(vm.props, 'netaauth.user', {})} />}
  </div>
}