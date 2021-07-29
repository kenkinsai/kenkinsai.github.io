import React, { useEffect, useState } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
/*global translate*/
const { timeConverter, rxaget, rxChangeSlug, stringToColour,idToColor } = global.rootRequire('classes/ulti')
const { checkAvatarSender, checkIsOwner, checkName, checkNameUser } = global.rootRequire('classes/chat')
const { parseMessageDesc } = global.rootRequire('classes/chat')

global.isclient && require('./index.css')
export default (props) => {
  const [modalPin, setModalPin] = useState(false)
  const [pinedMess, setPinedMess] = useState([])
  const [isSort, setIsSort] = useState(false)
  let closeModalpin = false
  useEffect(() => {
    if (!Object.keys(props.pinedMess).length)
      setModalPin(props.modalPin)
    let temp = []
    const obj = props.pinedMess
    var pinedMessPos = JSON.parse(localStorage.getItem("netaPinedMessPos") || "{}")
    Object.keys(obj).map((odate) => {
      let firstMessageIndex = 0
      obj && obj[odate] && obj[odate]['data']
        && obj[odate]['data'].map((omess, i) => {
          if ([5, 6, 7].indexOf(omess.type) !== -1) firstMessageIndex = 1
          omess.firstMessageIndex = firstMessageIndex
          omess.position = pinedMessPos[props.group_id] && pinedMessPos[props.group_id][omess.message_id] >= 0 ?
            pinedMessPos[props.group_id][omess.message_id] : i
          temp.push(omess)
        })
    })
    temp = temp.sort((a, b) => Number(a.position) < Number(b.position) ? -1 : 1)
    setPinedMess(temp)
  }, [JSON.stringify(props.pinedMess)])
  useEffect(()=>{
    setIsSort(false)
  },[props.group_id])
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const temp = arrayMove(pinedMess, oldIndex, newIndex)
    setPinedMess(temp);
  };
  useEffect(() => {
    if (!isSort && modalPin) {
      var pinedMessPos = JSON.parse(localStorage.getItem("netaPinedMessPos") || "{}")
      pinedMessPos[props.group_id] = {}
      pinedMess.map((item, i) => {
        pinedMessPos[props.group_id][item.message_id] = i
      })
      localStorage.setItem("netaPinedMessPos", JSON.stringify(pinedMessPos))
    }
  }, [isSort])
  if(props.checkgallery === true){
    closeModalpin = true
  }else{
    closeModalpin = false
  }
  const SortableItem = SortableElement(({ omess, i, arr }) => {
    return (<div key={omess.message_id} style={{ cursor: isSort ? "pointer" : "inherit" }}
      className={(props.parseMessage(omess).length === 0 ? 'parseMessage_hiden' :
        ((props.pin_mess_id !== omess.message_id.toString()) ?
          'zmessage_row' : 'zmessage_row zchat_row-selected'))}>
      {([5, 6, 7].indexOf(omess.type) === -1)
        ? <div>
          {((i > 0 && omess.sender_uin !== arr[i - 1].sender_uin) || i === omess.firstMessageIndex)
            && !checkIsOwner(omess, props.userid) &&
            <div className='zmessage_colava' >
              <div className='zmessage_avasender' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + checkName(omess.sender_uin, props.users, 'avatar'))}, #FFFFFF)` }}>
              {checkAvatarSender(omess, props.users)
                && <img src={global.rxu.config.cdn_endpoint + props.users[omess.sender_uin.toString()].profile_url} alt=''
                  data-id={'sender' + omess.sender_uin} className={'ava-sender images-static'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = global.rxu.config.get_static + props.users[omess.sender_uin.toString()].profile_url
                  }} />}
              <span className='avatar-sender'>{rxChangeSlug(checkNameUser(props.convertOmessUser(omess))).slice(0, 2).toUpperCase()}</span>
              </div>
            </div>
          }
          <div className={checkIsOwner(omess, props.userid) ? 'zmessage_content_right' : 'zmessage_content'}>
            <div className='zmessage_box'>
              <div className={(omess.type === 0) ? (props.userid.toString() === omess.sender_uin.toString())
                ? 'zmessage_text my_message' : 'zmessage_text another_message' : 'zmessage_text'}>
                <div className='another_message_box'>
                  {
                    ((i > 0 && omess.sender_uin !== arr[i - 1].sender_uin) || i === omess.firstMessageIndex) &&
                      ((props.group.occupants_uins.length > 2)
                        && (props.userid.toString() !== omess.sender_uin.toString()))
                      ?
                      <div className={omess.type === 0 ? 'zbg_mess' : ''}>
                        <div id='stsender_name' className={(omess.type !== 0)
                          ?
                          (omess.type === 9 ? ' zsender_name_type9 ' : 'zsender_name_basic mess_type0')
                          :
                          'zsender_name_basic'} style={{ color: `${idToColor(omess.sender_uin.toString())}` }} >
                          {checkNameUser(rxaget(props.users, omess.sender_uin, {})) || omess.sender_name.toString()}
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: props.parseMessage(omess, 'pin_model') }} />
                      </div>
                      :
                      <div dangerouslySetInnerHTML={{ __html: props.parseMessage(omess, 'pin_model') }} />
                  }
                </div>
              </div>
              <div className='zmessage_time' style={{
                right: checkIsOwner(omess, props.userid) ? 0 : "unset",
                bottom: -18, width: "max-content"
              }}>
                {timeConverter(omess.created_at, 'dayminute')} </div>
            </div>
          </div>
        </div>
        : <div className='zchat_row_child'> {props.parseMessage(omess)} </div>}
      {isSort && <div>
        <img className='icon24 zuitem-right' src={'./images/default/icons/sort.svg'} alt='' />
        </div>}
    </div>)
  });
  const SortableList = SortableContainer(({ items }) => {
    return (
      <div className='zchat_list' id='zchat_list' >
        {pinedMess.map((omess, i, arr) => (
          <SortableItem key={i} index={i} i={i} omess={omess} arr={arr} disabled={!isSort} />
        ))}
      </div>
    );
  });
  var lastPin = null
  if (pinedMess.length) {
    lastPin = JSON.parse(JSON.stringify(pinedMess[pinedMess.length - 1]))
    lastPin.type === 8 && (lastPin.type = 0)
  }
  return (
    <div className="rodal-pin">
      {lastPin ? <div>
        <div className='ztbar' style={{ paddingRight: props.tabmoreNextprop === true ? 300 : 0 }}
          onClick={() => setModalPin(true)}>
          <div className='ztbar_avatar_header'>
            <div className="icon-pin"></div>
          </div>
          <div className='ztbar_left' >           
            <div className='ztbar_status'>
              <div className='ztbar_name modal'>{translate("Pinned Message")+": "}</div>
              <div className="ztab-more-user_status">
                {/*<div className="lastpin" dangerouslySetInnerHTML={{ __html: props.parseMessage(lastPin, 'pin_model') }}></div>
                  parseMessageDesc(lastPin, props.users, props.userid)*/
              }
              <div className="lastpin" dangerouslySetInnerHTML={{ __html: parseMessageDesc(lastPin, props.users, props.userid)}}></div>
              </div>
            </div>
          </div>
          <div className='ztbar_right ztbar_btn ztbar_btnmore' style={{ right: props.tabmoreNextprop === true ? 300 : 0 }}>
            <img className='icon24 zuitem-right' src={'./images/default/icons/right-arrow.svg'} alt='' />
          </div>
        </div>
      </div> : null}
      {modalPin&&
        <div className={closeModalpin === true ? 'avatarClick_rectangle_hiden':'avatarClick_rectangle'}>
          <div className='avatarClick_rectangle_1'></div>
          <div className='avatarClick_rectangle_2_1'>
            <div className='avatarClick_title_place modal'>
              <div className='avatarClick_title modal'>{translate("Pinned Message")}</div>
              <div className='avatarClick_closeIcon' onClick={() => setModalPin(false)}>
                <img className='icon-basic-up filter_img_class' src={'./images/default/icons/icon-basic-up.svg'} alt='' />
              </div>
            </div>
            <div className="ztbar_name pmodal" onClick={() => setIsSort(!isSort)}>{translate(isSort ? "Done" : "Edit")}</div>
            <div className="rodal-body">
              <div className='zchattab_body' style={{ paddingRight: 'unset' }}>
                <div className='zchat_body mtheme'>
                  <div className='zchat_list' id='zchat_list' >
                    <SortableList onSortEnd={onSortEnd} helperClass='sortableHelper' />
                  </div>
                </div>
              </div>
            </div>
            <div className="rodal-footer">
              <div className="zmessage_text my_message cbtn" onClick={() => props.unPin(true)}>
                <div>
                  <div className="zchat-textmess">{translate("Unpin All")}</div>
                </div>
              </div>
            </div>
          </div >
        </div>}
    </div >
  )
}