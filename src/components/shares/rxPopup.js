/*global translate*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import QRCode from 'qrcode.react'

const { rxaget, stringToColour, rxChangeSlug, subString } = global.rootRequire('classes/ulti')
const { checkNameContact, checkNameUser } = global.rootRequire('classes/chat')
const { chooseGroupAction, closePopup, changeStatusLoadMess, netaGroupsUpdate } = global.rootRequire('redux')
const RxImageGallery = global.rootRequire('components/shares/rxImageGallery').default
const rxio = global.rootRequire('classes/socket').default

global.isclient && require('./rxPopup.css')

class RxGroupList extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      user: {},
      group: {},
      groupsNChat: [],
      groupsNChatOrigin: [],
      groupsNChatChecked: [],
      flagPopup: false,
      flagCreateGroup: false,
      flagLeaveGroup: false,
      flagShowGallery: false,
      flagCreateGroupPopup: false,
      flagChooseLeader: false,
      flagQRCode: false,
      nameNewGroup: '',
      typePopup: '',
      typeGallery: '',
      strArrImg: '',
      linkQRCode: '',
      galleryPosition: 0,
      groupImage: '',
      chooseFileImagesStatus: false,
      groupImageURL: '',
    }
    this.compareContact = this.compareContact.bind(this)
    this.token = rxaget(this.props, 'netaauth.user.token', '')
    this.users = rxaget(this.props, 'user.users', {}) || {}
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('nextProps rxpopup')
    let nextPopup = rxaget(nextProps, 'netaPopup', {}) //nextProps.netaPopup || {}
    if (nextPopup.status) {
      let user = rxaget(nextPopup, 'data.user', {})
      let group = rxaget(nextPopup, 'data.group', {})
      let flagPopup = rxaget(nextPopup, 'status', false)
      let arrGroupsTmp = rxaget(nextPopup, 'data.groups', []).filter(o => o.id !== user.id)
      let strArrImg = rxaget(nextPopup, 'data.arrImg', '')
      let linkQRCode = rxaget(nextPopup, 'data', '')

      let typeGallery = rxaget(nextPopup, 'data.typeGallery', '')
      let galleryPosition = rxaget(nextPopup, 'data.galleryPosition', 0)

      let flagCreateGroup = (['create_group', 'add_member'].indexOf(nextPopup.type_popup) !== -1) ? true : false
      let flagLeaveGroup = (['leave_group'].indexOf(nextPopup.type_popup) !== -1) ? true : false
      let flagShowGallery = (['show_gallery'].indexOf(nextPopup.type_popup) !== -1) ? true : false
      let flagQRCode = (['create_qr'].indexOf(nextPopup.type_popup) !== -1) ? true : false
      this.setState({
        flagPopup: flagPopup,
        groupsNChat: arrGroupsTmp,
        groupsNChatOrigin: arrGroupsTmp,
        strArrImg: strArrImg,
        linkQRCode: linkQRCode,
        flagCreateGroup: flagCreateGroup,
        flagLeaveGroup: flagLeaveGroup,
        flagShowGallery: flagShowGallery,
        flagQRCode: flagQRCode,
        typePopup: nextPopup.type_popup,
        typeGallery: typeGallery,
        galleryPosition: galleryPosition,
        user: user,
        group: group
      })
    }
  }

  onClickClosePopup() {
    this.resetState()
  }

  onClickShowPopupCreateGroup() {
    let flagCreateGroupPopup = this.state.flagCreateGroupPopup
    this.setState({ flagCreateGroupPopup: !flagCreateGroupPopup })
  }

  compareContact(a, b) {
    let userA = rxChangeSlug(checkNameUser(a, this.userid, this.props.netaauth))
    let userB = rxChangeSlug(checkNameUser(b, this.userid, this.props.netaauth))

    if (userA < userB) {
      return -1;
    }
    if (userA > userB) {
      return 1;
    }
    return 0;
  }

  onChangeSearchNChat(e) {
    let value = e.target.value
    let arrGroups
    let statusSeachNchatValue

    if (value.startsWith('0')) {
      value = value.replace(value.charAt(0), '+84')
    }
    if (value) {
      arrGroups = this.state.groupsNChatOrigin.filter(o => (rxChangeSlug(checkNameUser(o)).indexOf(rxChangeSlug(value)) !== -1 || rxChangeSlug(o.phone).indexOf(rxChangeSlug(value)) !== -1))
      statusSeachNchatValue = true
    } else {
      arrGroups = this.state.groupsNChatOrigin
    }
    this.setState({
      groupsNChat: arrGroups,
      statusSeachNchatValue: statusSeachNchatValue,
      searchNchatValue: value
    }, () => {
    })
  }

  createNewChat(user) {
    let flagCreateGroupPopup = this.state.flagCreateGroupPopup
    let typePopup = this.state.typePopup
    if (flagCreateGroupPopup) {
      let groupsNChatChecked = this.state.groupsNChatChecked
      if (groupsNChatChecked.indexOf(user.id) === -1) {
        groupsNChatChecked.push(user.id)
      } else {
        groupsNChatChecked.splice(groupsNChatChecked.indexOf(user.id), 1)
      }
      this.setState({ groupsNChatChecked })
    } else {
      if (typePopup === 'create_group') {
        let userOwner = rxaget(this.state, 'user', {})
        let partner_id = user.id
        const params = {
          'type': 3,
          'owner_uin': userOwner.id,
          'name': '',
          'avatar_url': '',
          'occupants_uins': [userOwner.id, partner_id],
          'sender_name': userOwner.name
        }
        try {
          if (this.props.netaPopup && this.props.netaPopup.status) {
            let funcCreateGroup = this.props.netaPopup.callback

            rxio.createNewGroup(params, (data) => {
              if (data && data.group) {
                if (data.group.type === 3) {
                  data.group.partner_id = partner_id
                }
                this.props.chooseGroupAction(data.group)
              }
              setTimeout(() => {
                funcCreateGroup()
                this.resetState()
              }, 1000)
            })
          }
        } catch (e) {
          console.log(e)
        }
      } else if (typePopup === 'add_member') {
        let groupsNChatChecked = this.state.groupsNChatChecked
        if (groupsNChatChecked.indexOf(user.id) === -1) {
          groupsNChatChecked.push(user.id)
        } else {
          groupsNChatChecked.splice(groupsNChatChecked.indexOf(user.id), 1)
        }
        this.setState({ groupsNChatChecked })
      } else if (typePopup === 'leave_group') {
        let groupsNChatChecked = [user.id]
        this.setState({ groupsNChatChecked })
      }
    }
  }

  addChangeNameGroup(e) {
    const value = e.target.value
    this.setState({ nameNewGroup: value })
  }

  onClickCreateGroup() {
    let groupsNChatChecked = this.state.groupsNChatChecked
    let user = rxaget(this.state, 'user', {})
    let nameNewGroup = this.state.nameNewGroup
    let emptyValue = ''
    if (this.state.nameNewGroup) {
      emptyValue = nameNewGroup.replace(/[\s]/g, '')
    }
    if (emptyValue.length > 0) {
      if (groupsNChatChecked.length === 0) {
        alert(translate('You have not selected a member'))
      } else {
        const params = {
          type: 2,
          owner_uin: user.id,
          name: this.state.nameNewGroup,
          avatar_url: '',
          occupants_uins: groupsNChatChecked,
          sender_name: user.name
        }

        try {
          if (this.props.netaPopup && this.props.netaPopup.status) {
            let funcCreateGroup = this.props.netaPopup.callback

            rxio.createNewGroup(params, (data) => {
              if (data && data.group) {

                let chooseFileImagesStatus = this.state.chooseFileImagesStatus
                if (chooseFileImagesStatus) {
                  let groupImage = this.state.groupImage
                  this.uploadFileImages(groupImage, data.group)
                } else {
                  this.props.chooseGroupAction(data.group)
                  this.props.netaGroupsUpdate(Number(data.group.group_id), data.group)
                }

              }
              setTimeout(() => {
                funcCreateGroup()
                this.resetState()
              }, 1000)
            })
          }
        } catch (e) {
          console.log(e)
        }
      }

    } else {
      const mess = translate('The group name can not be blank')
      alert(mess)
    }
  }

  onClickUpdateGroup() {
    let groupsChecked = this.state.groupsNChatChecked
    if (groupsChecked.length > 0) {
      try {
        if (this.props.netaPopup && this.props.netaPopup.status) {
          let funcAddMember = this.props.netaPopup.callback
          funcAddMember(groupsChecked)
          this.resetState()
        }
      } catch (e) { }
    } else {
      alert(translate('Add Member Error'))
    }
  }

  onClickLeaveGroup() {
    try {
      if (this.props.netaPopup && this.props.netaPopup.status) {
        let funLeaveGroup = this.props.netaPopup.callback
        let groupsNChatChecked = this.state.groupsNChatChecked
        if (groupsNChatChecked && groupsNChatChecked.constructor === Array && groupsNChatChecked.length > 0) {
          funLeaveGroup(groupsNChatChecked[0])
          this.resetState()
        } else {
          funLeaveGroup()
          this.resetState()
        }
      }
    } catch (e) { console.log(e) }
  }

  leaveGroupBtn(type) {
    // if (this.state.group.admin_uins) {
    //   let admin_unis = this.state.group.admin_uins
    //   if (!admin_unis.some(i => (this.userid.toString() !== i.toString() && this.state.group.occupants_uins.indexOf(i.toString()) >= 0))) {
    //     this.setState({ flagChooseLeader: true })   
    //   }
    //   else this.leaveGroup()
    // // }
    // console.log('SECOND 55555')
    // console.log(this.state.group.admin_uins, 'this.state.group.admin_uins')

    if (type === 'accept') {
      let user = this.state.user
      let group = this.state.group
      // console.log(group, 'group99')
      if (rxaget(group, 'admin_uins', []).indexOf(rxaget(user, 'id', '').toString()) !== -1 && group.type !== 3) {
        this.setState({
          flagCreateGroup: true,
          flagLeaveGroup: false,
          flagChooseLeader: true
        })
      } else {
        this.onClickLeaveGroup()
      }
    } else {
      this.resetState()
    }
  }

  downloadQRCode() {
    try {
      const timenow = Math.floor(Date.now() / 1000)
      const canvas = document.getElementById('qrcode_id')
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      let downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = "qrcode_" + timenow + ".png"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (e) { }
  }

  resetState() {
    this.setState({
      user: {},
      group: {},
      groupsNChat: [],
      groupsNChatOrigin: [],
      groupsNChatChecked: [],
      flagPopup: false,
      flagCreateGroup: false,
      flagLeaveGroup: false,
      flagShowGallery: false,
      flagCreateGroupPopup: false,
      flagChooseLeader: false,
      flagQRCode: false,
      nameNewGroup: '',
      typePopup: '',
      typeGallery: '',
      strArrImg: '',
      linkQRCode: '',
      galleryPosition: 0,
      groupImageURL: '',
      groupImage: '',
      chooseFileImagesStatus: false,

    }, () => {
      try {
        this.props.closePopup()
      } catch (e) { }
    })
  }

  closeGallery() {
    this.resetState()
  }

  chooseFileImages(fileList) {
    let groupImageURL = URL.createObjectURL(fileList[0])
    this.setState({ groupImage: fileList, chooseFileImagesStatus: true, groupImageURL: groupImageURL })
  }

  uploadFileImages(fileList, groupObj) {
    try {
      if (fileList.length && fileList[0]) {
        var file = fileList[0]
        let parts = (file.name || '').split('.');
        let ext = parts[parts.length - 1] || '';
        if (['png', 'jpg'].indexOf(ext.toLowerCase()) >= 0) {
          let fileSize = file.size
          let extFilename = 'png'

          let _URL = window.URL || window.webkitURL
          let img = new Image();
          let objectUrl = _URL.createObjectURL(file)

          let dataParams = {
            content_type: 'image/' + extFilename,
            name: 'netalo_' + Math.floor(Date.now()),
            public: true,
            size: fileSize
          }
          let header = { 'TC-Token': this.token, 'Content-Type': 'application/json; charset=UTF-8', 'Accept-Encoding': 'gzip', 'Connection': 'keep-alive' }
          let requestOptions = {
            method: 'POST', headers: header, body: JSON.stringify(dataParams), redirect: 'follow'
          };

          fetch(global.rxu.config.create_blob, requestOptions).then(res => res.json()).then((json) => {
            if (json && json.blod_object && json.blod_object.form_data) {
              let dataUpload = new FormData()
              let arrKeys = ['Content-Type', 'key', 'policy', 'x-amz-algorithm', 'x-amz-credential', 'x-amz-date', 'x-amz-meta-netachat', 'x-amz-signature']
              for (let key of arrKeys) {
                if (json.blod_object.form_data[key]) {
                  dataUpload.append(key, json.blod_object.form_data[key])
                }
              }
              dataUpload.append('file', file, file.name)
              dataUpload.append('success_action_status', 201)

              fetch(json.blod_object.params, { method: 'POST', body: dataUpload }).then(resBlob => resBlob.text()).then(result => {
                if (result.indexOf('Key') !== -1) {
                  let patt = '<Key.*?>(.*?)<\\/Key>';
                  let strresult = result.match(patt);
                  if (strresult && strresult.constructor === Array && strresult.length > 1) {
                    let key = strresult[1]
                    if (key) {
                      let optComplete = {
                        method: 'PUT',
                        headers: header,
                        body: JSON.stringify({
                          content_type: json.content_type, id: json.id, name: json.name, size: json.size, uid: json.uid
                        })
                      };

                      fetch(global.rxu.config.get_blobs + '/' + json.id + '/complete.json', optComplete)
                        .then(response => {
                          if (response.status === 200) {
                            try {
                              img.onload = () => {
                                _URL.revokeObjectURL(objectUrl)
                                // const arrUsers = this.users
                                // const user = rxaget(this.props, 'netaauth.user', {})
                                // const objUser = arrUsers[user.id.toString()]
                                let msg = {
                                  group_id: Number(groupObj.group_id),
                                  avatar_url: key,
                                }
                                if (msg && msg.group_id) {
                                  if (rxio.connected) {
                                    rxio.socket.emit("update_group", msg, (data) => {
                                      if (data && data.result === 0) {
                                        this.props.chooseGroupAction(data.group)
                                        this.props.netaGroupsUpdate(Number(data.group.group_id), data.group)
                                      }
                                    })
                                  }
                                }
                              }
                              img.src = objectUrl
                            } catch (e) { }
                          }
                        }).catch(errorPut => console.log('error', errorPut));
                    }
                  }
                }
              })
            }
          }).catch(error => console.log('create_blob error', error))
        } else alert(translate('The image file format is not suitable. Please select the image file as .jpg or .png'))
      }
    } catch (error) { console.log('upload error', error) }
  }

  render() {
    let arrUserSelected = []
    let contactTitle = ''
    if (this.state.groupsNChatOrigin && this.state.groupsNChatOrigin.constructor === Array && this.state.groupsNChatOrigin.length > 0) {
      arrUserSelected = this.state.groupsNChatOrigin.filter(ucontact => this.state.groupsNChatChecked.indexOf(ucontact.id) !== -1)
    }
    this.state.groupsNChat.sort(this.compareContact)

    return (
      <div>
        {(this.state.flagPopup && !this.state.flagShowGallery) && <div className='zchat_popupscreen'>
          <div className='zchat_popupscreen_bg'></div>
          <div className='zchat_popupscreen_main'>
            {this.state.flagCreateGroup && <div className='zchat_popupcenter'>
              <div className='newgroup_rectangle_popup'>
                <div className='popup_choose_leader_title_area'>
                  <div className='popup_choose_leader_title'>
                    {(this.state.typePopup === 'leave_group') ? translate('Choose leader') : (this.state.typePopup === 'add_member') ? translate('Add member') : (!this.state.flagCreateGroupPopup) ? translate("New message") : translate("Create a group")}
                  </div>
                  <div className='popup_choose_leader_btn_close'>
                    <img className='choose_leader_icon_close filter_img_class' alt='' src={'./images/default/icons/icon-basic-up.svg'} onClick={e => this.onClickClosePopup()} />
                  </div>
                </div>

                {this.state.flagCreateGroupPopup && <div className="newgroup_wrap">
                  <div className="newgroup_camera_icon_place" onClick={(e) => { this.refs.data_image_camera.click() }}>
                    <input type='file' id='data_image_camera' ref='data_image_camera' multiple={false} key={this.state.theInputFileKey + '_data_image_camera'}
                      style={{ display: 'none' }}
                      onChange={(e) => this.chooseFileImages(e.target.files)} accept="image/jpg,image/png,video/mp4" />
                    {this.state.groupImageURL.length === 0 && <div className="newgroup_icon_area icon_camera" >
                      <img className="newgroup_icon_search filter_img_class" src={"./images/default/icons/camera.svg"} alt="" />
                    </div>}
                    {this.state.groupImageURL.length > 0 && <img className="newgroup_chooseAvatar" src={this.state.groupImageURL} alt="" />}
                  </div>
                  <input placeholder={translate("Enter a group name")} maxLength="30" className="newgroup_place" onChange={e => this.addChangeNameGroup(e)} value={this.state.nameNewGroup || ""} />
                </div>}

                <div className='popup_choose_leader_search_area'>
                  <div className='popup_choose_leader_icon_search_area'>
                    <img className='popup_choose_leader_icon_search filter_img_class' src={"./images/default/icons/search-active.svg"} alt='' />
                  </div>
                  <input type='search' maxLength='30' id='newgroup_search_input' placeholder={translate("Search")} onChange={e => { this.onChangeSearchNChat(e) }} autoComplete='off'
                    className={rxaget(this.props, "themeBackgroudValue") === "darkTheme"
                      ? "popup_choose_leader_search_input darkThemeInput"
                      : "popup_choose_leader_search_input lightThemeInput"
                    }>
                  </input>
                  {/* <div className='newgroup_icon_close_area'></div> */}
                </div>

                {(!this.state.flagCreateGroupPopup && (['add_member', 'leave_group'].indexOf(this.state.typePopup) === -1)) &&
                  <div className='create_group_chat_area_popup'>
                    <img src={'./images/default/icons/icon-basic-new-friend_group.svg'} alt='' className='avatar_create_group_chat_popup filter_img_class' />
                    <span className='new_group_chat_title_popup' onClick={e => this.onClickShowPopupCreateGroup()} >
                      {translate("Create a group chat")}
                    </span>
                  </div>
                }

                <div className='newgroup_popup_list' style={(this.state.flagCreateGroupPopup && (['add_member', 'leave_group'].indexOf(this.state.typePopup) === -1)) ? { height: '370px' } : {}}>
                  {
                    (arrUserSelected.length > 0 && (['leave_group'].indexOf(this.state.typePopup) === -1)) &&
                    <div className='new_list_contacts_selected'>
                      {
                        arrUserSelected.map((ele, index) => (
                          <div key={ele.id} className='item-row-selected-user'>
                            {subString(checkNameUser(ele), 20)}
                            <img className='item-row-selected-close' src={'./images/default/icons/icon-close.png'} alt='' onClick={e => { this.createNewChat(ele) }} />
                          </div>))
                      }
                    </div>
                  }
                  <div className='add_member_contact_list'>
                    {this.state.groupsNChat.map((ele, index) => {
                      let eleContactTitle = rxChangeSlug(checkNameUser(ele, this.userid, this.props.netaauth)).slice(0, 1)
                      if (contactTitle !== eleContactTitle) {
                        ele.contactTitle = true
                        contactTitle = eleContactTitle
                      } else {
                        ele.contactTitle = false
                      }
                      return (
                        ele.id !== this.userid && (<div key={index}>
                          {ele.contactTitle && <div className='zcontact_title'>{eleContactTitle}</div>}
                          <div onClick={e => { this.createNewChat(ele) }} className='group_contacts_item clearfix' >
                            <div className='zgroup_avatar'>
                              {ele.profile_url && (
                                <img src={global.rxu.config.cdn_endpoint + ele.profile_url} alt=''
                                  data-id={'userava' + ele.id} className='ava-useravatar images-static'
                                  onError={e => { e.target.onerror = null; e.target.src = global.rxu.config.get_static + ele.profile_url }}
                                />
                              )}
                              {!ele.profile_url && <span className='ava-span' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + checkNameContact(ele).slice(0, 2).toUpperCase())}, #FFFFFF)` }} >
                                {rxChangeSlug(checkNameUser(ele)).slice(0, 2).toUpperCase()}
                              </span>}
                            </div>
                            <div className='zgroup_maininfo-contact'>
                              <div className='newgroup_userinfo_place'> {subString(checkNameUser(ele), 20)} </div>
                              {(this.state.flagCreateGroupPopup || (['add_member', 'leave_group'].indexOf(this.state.typePopup) !== -1)) &&
                                <div className='newgroup_checked'>
                                  <label className='container100'>
                                    <input className='checkmark1' type='checkbox' checked={this.state.groupsNChatChecked.indexOf(ele.id) !== -1} onChange={e => this.createNewChat(ele)} />
                                    <span className='checkmark'></span>
                                  </label>
                                </div>
                              }
                            </div>
                            <div className='newgroup_divider'></div>
                          </div>
                        </div>
                        )
                      )
                    })}
                  </div>
                </div>

                {
                  this.state.flagCreateGroupPopup &&
                  <div className='create-newgroup-row'>
                    <div className='create-newgroup-btn' onClick={e => this.onClickCreateGroup()}>
                      {translate("Create a group")}
                    </div>
                  </div>
                }
                {
                  (this.state.typePopup === 'add_member') &&
                  <div className='create-newgroup-row'>
                    <span className='create-newgroup-btn' onClick={() => this.onClickUpdateGroup()}>
                      {translate('Add member')}
                    </span>
                  </div>}
                {
                  (this.state.typePopup === 'leave_group') &&
                  <div className='create-newgroup-row'>
                    <span className='create-newgroup-btn' onClick={() => this.onClickLeaveGroup()}>
                      {translate('Leave group')}
                    </span>
                  </div>
                }
              </div>
            </div>}

            {/* Start RỜI KHỎI NHÓM  */}
            {this.state.flagLeaveGroup && <div className='popup_leave_group_account'>
              <div className='popup_leave_group_title'>{(rxaget(this.state.group, 'delete_conversation')) ? translate('Delete Conversation') : translate('Leave group')}</div>
              <div className='popup_leave_group_body'>{(rxaget(this.state.group, 'delete_conversation')) ? translate('Are you sure you want to delete this conversation?') : translate('Are you sure you want to leave the group? After leaving the group, you will not be able to read this group news')}</div>
              <div className='leave_group_btn_area'>
                <div className='leave_group_btn'>
                  <div className='leave_group_cancel_btn' onClick={e => this.leaveGroupBtn('cancel')}>{translate('Cancel')}</div>
                </div>
                <div className='delete_group_btn'>
                  <div className='delete_group_accept_btn' onClick={e => this.leaveGroupBtn('accept')}>{(rxaget(this.state.group, 'delete_conversation')) ? translate('Delete Conversation') : translate('Leave group')}</div>
                </div>
              </div>
            </div>}
            {/* End RỜI KHỎI NHÓM  */}

            {this.state.flagQRCode && <div className='zchat_popupcenter'>
              <div className='popup_qrcode_container'>
                <div className='popup_choose_leader_title_area'>
                  <div className='popup_choose_leader_title'>
                    {translate('Group QR code')}
                  </div>
                  <div className='popup_choose_leader_btn_close'>
                    <img className='choose_leader_icon_close filter_img_class' alt='' src={'./images/default/icons/icon-basic-up.svg'} onClick={e => this.onClickClosePopup()} />
                  </div>
                </div>
                <div className='popup_qrcode_box'>
                  <QRCode id="qrcode_id" value={this.state.linkQRCode} size={180} />
                </div>
                <div className='leave_group_btn_area'>
                  <div className='download_qr_code' onClick={e => this.downloadQRCode()}>{translate('Download QR')}</div>
                </div>
              </div>
            </div>}

          </div>
        </div>}

        {(this.state.flagPopup && this.state.flagShowGallery) && <RxImageGallery images={this.state.strArrImg} closeShowGallery={() => this.closeGallery()} position={this.state.galleryPosition} type={this.state.typeGallery} />}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  netaPopup: state.netaPopup,
  netaauth: state.netaauth,
  user: state.user,
  themeBackgroudValue: state.themeBackgroudValue,
})

const mapDispatchToProps = {
  closePopup,
  changeStatusLoadMess,
  chooseGroupAction,
  netaGroupsUpdate
}

const ComponentGroupListW = connect(
  mapStateToProps,
  mapDispatchToProps
)(RxGroupList)

export default ComponentGroupListW
