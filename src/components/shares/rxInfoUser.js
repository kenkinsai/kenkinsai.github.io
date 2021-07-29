/*global translate*/
import { connect } from 'react-redux'
import React, { Component } from 'react'
global.isclient && require('./rxInfoUser.css')
const { rxaget, stringToColour, rxChangeSlug } = global.rootRequire('classes/ulti')
const { checkNameUser, checkBlock } = global.rootRequire('classes/chat')
const rxio = global.rootRequire('classes/socket').default
const { chooseGroupAction, clickCall } = global.rootRequire('redux')

class RxInfoUser extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      images: [],
      userInfo: {},
      ownerInfo: {},
      userClick_group: {},
      userid:''
    }
  }

  componentDidMount() {
    if (rxaget(this.props, 'userInfo.id', '') !== rxaget(this.state, 'userInfo.id', '')) {
      let userInfo = this.props.userInfo
      let ownerInfo = this.props.ownerInfo
      let userClick_group = this.props.userClick_group
      let userid = this.props.ownerInfo.id
      let partner_id = userInfo.id
 
      this.setState({
        userInfo: userInfo, 
        ownerInfo: ownerInfo,
        userClick_group:userClick_group,
        userid:userid
      })    
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(this.state.userClick_group !== nextProps.userClick_group){
      this.setState({
        userClick_group : nextProps.userClick_group
      })
    }
  }
  downloadFile() {

  }

  showGalleryCurrentUser() {

  }

  changeTabActive() {

  }

  closePopupInfoUser() {
    this.props.closePopupInfoUser()
  }

  createNewChat(partner_id, callback) {
    const owner = rxaget(this.state, 'ownerInfo', {})
    const params = {
      "type": 3,
      "owner_uin": owner.id,
      "name": "",
      "avatar_url": "",
      "occupants_uins": [owner.id, partner_id],
      "sender_name": owner.name
    }
    
    rxio.createNewGroup(params, (data) => {
      if (data && data.group) {
        if(data.group.type === 3){
          data.group.partner_id = partner_id  
        }  
        this.props.chooseGroupAction(data.group)
        setTimeout(() => {
          if (!callback) {
            this.props.closePopupInfoUser()  
          } else {
            this.props.closePopupInfoUser()
            callback(data.group)
          }
          
        }, 500)
      }
    })
  }

  onClickStartCall(typeCall, partner_id) {
    this.createNewChat(partner_id, (group) => {
      if (group) {
        console.log(group)
        console.log({
          group_id: rxaget(group, 'group_id', '' ),
          type: rxaget(group, 'type', 0 ),
          occupants_uins: rxaget(group, 'occupants_uins', [] )
        })

        this.props.clickCall(typeCall, {
          group_id: rxaget(group, 'group_id', '' ),
          type: rxaget(group, 'type', 0 ),
          occupants_uins: rxaget(group, 'occupants_uins', [] )
        })  
      }        
    })
  }

  onSubmitContact(){
    let token = rxaget(this.state.ownerInfo, 'token', '')


    let address_book_link = global.rxu.config.base_api_neta + '/api/address_book.json'
    let arrContacts = [{name: checkNameUser(this.state.userInfo), phone: rxaget(this.state.userInfo, 'phone', '')}]
    let params = { "force":0, "contacts": arrContacts, "udid":""}
    let headers = { 'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8',  'TC-Token': token }
    
    if (params.contacts && params.contacts.length > 0 ) {
      fetch(address_book_link, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: headers }).then((res) => { return res.json() })
        .then((json) => {
          this.props.closePopupInfoUser()
        }).catch(er => console.log(er))
    }
  }

  render() {
    let userInfo = this.state.userInfo || {}

    return (
      <div className='avatarClick_rectangle'>
        <div className='avatarClick_rectangle_1'></div>
        <div className='avatarClick_rectangle_2_1'>
          <div className='avatarClick_title_place'>
            <div className='avatarClick_title'>{translate('Account information')}</div>
            <div className='avatarClick_closeIcon' onClick={() => this.closePopupInfoUser()}>
              <img className='icon-basic-up filter_img_class' src={'./images/default/icons/icon-basic-up.svg'} alt='' />
            </div>
          </div>
          <div className='avatarClick_avatarPlace'>
            <div className='avatarClick_avatar'  >
              { (userInfo && userInfo.profile_url) ? 
                  <img src={`${global.rxu.config.cdn_endpoint}` + userInfo['profile_url']} alt='profile_url' className='images-static' onError={(e) => {e.target.onerror = null; e.target.src = `./images/default/static/avadefault.svg` }} /> 
                :
                  <span className='ava-span' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + rxaget(userInfo, 'id', '').toString() + rxaget(userInfo, 'phone', '').toString())}, #FFFFFF)` }}> {rxChangeSlug(checkNameUser(userInfo), true).slice(0, 2).toUpperCase()} </span> 
              }
            </div>
          </div>
          <div className='avatarClick_userName'>
            <div>{checkNameUser(this.state.userInfo)}</div>
          </div>
          {/*<div className='avatarClick_body'>
            <div className='avatarClick_phone_place'>
              <div className='avatarClick_info_act'>
                <img className='icon_messenger icon_talk filter_img_class' src={'./images/default/icons/messenger.svg'} alt='' onClick={e => this.createNewChat(rxaget(userInfo, 'id', ''))}/>
                <img className='icon_call icon_talk filter_img_class' src={'./images/default/icons/callright.svg'} alt='' onClick={(e) => this.onClickStartCall('voicecall', rxaget(userInfo, 'id', ''))}/>
                <img className='icon_videocall icon_talk filter_img_class' src={'./images/default/icons/videocall.svg'} alt='' onClick={(e) => this.onClickStartCall('videocall', rxaget(userInfo, 'id', ''))}/>
              </div>
            </div>
          </div>

          <div className='avatarClick_infophone'>
            <span className='avatarClick_infophone-txt'>{translate('Phone number')}</span>
            <span className='avatarClick_infophone-number'>{userInfo.phone || ''}</span>
          </div>*/}
          <div className='ztab-more-info'>
            <div className='ztab-more-info_phone'>
              <span className='ztab-more-info_phone-txt'>{translate('Phone number')}</span>
              <span className='ztab-more-info_phone_number'>{userInfo.phone || ''}</span>
            </div>
            {!checkBlock(this.state.userClick_group, this.state.userid)&&<div className='ztab-more-info_act '>            
              <img className='icon32 ztab-icon-act filter_img_class' alt='' src={'./images/default/icons/messenger.svg'} onClick={(e) => this.createNewChat(rxaget(userInfo, 'id', ''))} />
              <img className='icon32 ztab-icon-act filter_img_class' alt='' src={'./images/default/icons/callright.svg'} onClick={(e) => this.onClickStartCall('voicecall', rxaget(userInfo, 'id', ''))} />
              <img className='videocall-icon ztab-icon-act filter_img_class' alt='' src={'./images/default/icons/videocall.svg'} onClick={(e) => this.onClickStartCall('videocall', rxaget(userInfo, 'id', ''))}/>
            </div>}
          </div>
          <div className='avatarClick_addContact' onClick={e => this.onSubmitContact()}>{translate('Add a contact')}</div>

        </div>
      </div> 

    )
  }
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = {
  chooseGroupAction,
  clickCall
}

const RxInfoUserWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(RxInfoUser)

export default RxInfoUserWrapped
