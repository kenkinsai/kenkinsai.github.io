/*eslint-disable no-undef*/
/*global translate*/
import { connect } from 'react-redux'
import React, { Component } from 'react'

global.isclient && require('./RxManageGroup.css')
const { rxsetLocal, rxgetLocal } = global.rootRequire('classes/request')
const { rxaget, rxChangeSlug, stringToColour, autoConvertTime, subString } = global.rootRequire('classes/ulti')
const { checkNameGroup, checkAvatarGroup, checkNameContact, checkNameUser, getGroupById, checkBlock, updateUsersOnline } = global.rootRequire('classes/chat')
const { netaMediaAdd, netaGroupsUpdate, netaGroupsRemove, chooseGroupAction, changeStatusLoadMess, netaAuthSettingUpdate, clickPopup } = global.rootRequire('redux')
const RxImageGallery = global.rootRequire('components/shares/rxImageGallery').default
const rxio = global.rootRequire('classes/socket').default
const BlockUser = global.rootRequire('components/shares/block_user/block_user').default
const CreateGroupChat = global.rootRequire('components/shares/create_group_chat/create_group_chat').default
let zget = global.rxu.get

class RxManagerGroup extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      group: props.groupManager ?? {}, //rxaget(props, 'groupManager', {}) ,
      images: [],
      videos: [],
      files: [],
      tabactive: 'images',
      paging_page: 0,
      paging_size: 50,
      block_scroll: false,
      arrData: [],
      doneBtnClick: false,
      closeBtnClick: false,
      displayLeaveGroupScreen: false,
      leaveGroup_okBtnClick: false,
      displaySelectManagerScreen: false,
      displayGroupList: true,
      // groupsMemberTemp: rxaget(this.props, 'rxgroupsMember.group', {}),
      group_id: '',
      isShowPopUp: false,
      admin_uins_index: rxaget(props, 'groupManager.admin_uins', {}).length - 1,
      groupsNChat: [],
      groupsNChatOrigin: [],
      groupsNChatChecked: [],
      countMemberOnl: 0,
      groupsTemp: [],
      chooseLeader_groupsTemp: [],
      leaderMemberChecked: '',
      clickAddMemberBtn: false,
      lg_chooseLeader_groupsTemp: [],
      lg_leaderMemberChecked: '',
      groupNameValue: '',
      theInputFileKey: new Date().getTime(),
      click_lg_chooseLeader_okBtn: false,
      loadingMedia: true,
      // notificationStatus :JSON.parse(rxgetLocal('netaNotificationStatus'))
      notificationStatus: global.rxu.json(rxgetLocal('netaNotificationStatus'), {}) || {},
      flagCreateGroupPopup: false,
      groupImageURL: '',
      flagManageGroupContextMenu: false,

      isShowPopupManageGroup: true,
      usersStatus: {},
    }

    this.users = rxaget(this.props, 'user.users', {}) || {}
    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    // const contactsUsers = []
    // if (this.users && Object.keys(this.users).length > 0) {
    //   for (const userid of Object.keys(this.users)) {
    //     let arrgroup = rxaget(this.props, 'rxgroup.group.occupants_uins', [])
    //     if (userid !== this.userid && arrgroup.indexOf(userid) === -1 ) {
    //       contactsUsers.push(this.users[userid])
    //     }
    //   }
    //   this.state.groupsNChat = this.state.groupsNChatOrigin = contactsUsers
    // }
    this.controller = {}
    this.keyClickFunction = this.keyClickFunction.bind(this);
    this.uploadFileImages = this.uploadFileImages.bind(this)
    this.token = rxaget(this.props, 'netaauth.user.token', '')
    this.user = rxaget(this.props, 'netaauth.user', {})
    this.users = rxaget(this.props, 'user.users', {}) || {}
    this.downloadFile = this.downloadFile.bind(this)
    this.doneAccountInfo = this.doneAccountInfo.bind(this)
    this.chooseLeader_okBtnClick = this.chooseLeader_okBtnClick.bind(this)
    this.removeMember = this.removeMember.bind(this)
    this.onChangeNotiGroup = this.onChangeNotiGroup.bind(this)

    let netaAuthSetting = JSON.parse(localStorage.getItem('netaAuthSetting') || `{"groups":{}}`)
    if (this.state.group.group_id && netaAuthSetting.groups[Number(this.state.group.group_id)]
      && netaAuthSetting.groups[Number(this.state.group.group_id)].disableNoti) {
      this.state.disableNoti = true
    } else this.state.disableNoti = false
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyClickFunction, false);
  }

  componentDidMount() {
    let occupants_uins = this.state.group.occupants_uins
    this.loadGroupsTemp(occupants_uins, this.users)
    document.addEventListener("keydown", this.keyClickFunction, false);
    const contactsUsers = []
    if (this.users && Object.keys(this.users).length > 0) {
      let arrgroup = rxaget(this.props, 'groupManager.occupants_uins', [])
      for (const userid of Object.keys(this.users)) {
        if (
          userid !== this.userid &&
          arrgroup.indexOf(userid) === -1
        )
          contactsUsers.push(this.users[userid])
      }
      this.setState({
        groupsNChat: contactsUsers,
        groupsNChatOrigin: contactsUsers
      })
    }
    // this.preGetMedia(rxaget(this.props, 'netaMedia', {}), rxaget(this.state.group, 'group_id', ''))

    const { isChange, usersStatus, countMemberOnl } = updateUsersOnline(occupants_uins, this.state.countMemberOnl, this.state.usersStatus)
    if (isChange) this.setState({ isChange: isChange, usersStatus: usersStatus, countMemberOnl: countMemberOnl })


    rxio.getUpdateGroup((data) => {
      let groupObj = JSON.parse(JSON.stringify(this.state.group))
      if (data.push_all.length) {
        groupObj.occupants_uins = [...new Set([...groupObj.occupants_uins, ...data.push_all])]
        // console.log(groupObj.occupants_uins, 'data sau khi add')
      }
      else if (data.pull_all.length) {
        groupObj.occupants_uins = groupObj.occupants_uins.filter(group => !data.pull_all.includes(group))
        // console.log(groupObj.occupants_uins, 'data sau khi remove')
      }

      // this.props.chooseGroupAction(groupObj)
      // this.loadGroupsTemp(groupObj.occupants_uins, this.users)
      this.setState({ group: groupObj }, () => {
        // this.props.chooseGroupAction(groupObj)
        this.loadGroupsTemp(groupObj.occupants_uins, this.users)
      })
    })

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // let disableNoti
    // let netaAuthSetting = JSON.parse(localStorage.getItem('netaAuthSetting') || `{"groups":{}}`)
    // if (this.state.group.group_id && netaAuthSetting.groups[Number(this.state.group.group_id)]
    //   && netaAuthSetting.groups[Number(this.state.group.group_id)].disableNoti) {
    //   disableNoti = true
    // } else {
    //   disableNoti = false
    // }
    // if (disableNoti !== this.state.disableNoti) {
    //   this.setState({ disableNoti: disableNoti })
    // }

    console.log(nextProps.usersStatus, 'nextProps.usersStatus')
    if (nextProps.usersStatus) {
      const { isChange, usersStatus, countMemberOnl } =
        updateUsersOnline(this.state.group.occupants_uins, this.state.countMemberOnl, nextProps.usersStatus, this.state.usersStatus)
      if (isChange) this.setState({ isChange: isChange, usersStatus: usersStatus, countMemberOnl: countMemberOnl })
    }

    if (JSON.stringify(nextProps.groupManager) !== JSON.stringify(this.props.groupManager)
      // rxaget(nextProps, 'groupManager.group_id', '') !== rxaget(this.state, 'group.group_id', '')
    ) {
      const newgroup = rxaget(nextProps, 'groupManager', {})
      let occupants_uins = newgroup.occupants_uins || []
      this.loadGroupsTemp(occupants_uins, this.users)

      let netaAuthSetting = JSON.parse(localStorage.getItem('netaAuthSetting') || `{"groups":{}}`)
      let disableNoti = false
      if (newgroup.group_id && netaAuthSetting.groups[Number(newgroup.group_id)] && netaAuthSetting.groups[Number(newgroup.group_id)].disableNoti) {
        disableNoti = true
      }

      if (this.controller[rxaget(this.state.group, 'group_id', '')]) {
        this.controller[rxaget(this.state.group, 'group_id', '')].abort();
        delete this.controller[rxaget(this.state.group, 'group_id', '')]
      }
      this.preGetMedia(rxaget(nextProps, 'netaMedia', {}), rxaget(newgroup, 'group_id', ''))

      const { isChange, usersStatus, countMemberOnl } = updateUsersOnline(occupants_uins, this.state.countMemberOnl, this.state.usersStatus)
      if (isChange) this.setState({ isChange: isChange, usersStatus: usersStatus, countMemberOnl: countMemberOnl })
      
      this.setState({ group: rxaget(nextProps, 'groupManager', {}), closeBtnClick: false, doneBtnClick: false, loadingMedia: true, disableNoti: disableNoti })
    }

    if (rxaget(this.state.group, 'group_id', '') !== nextProps.rxgroup.groupid) {
      this.setState({ closeBtnClick: false, doneBtnClick: false })
    }

    if (nextProps.user.users && JSON.stringify(nextProps.user.users) !== JSON.stringify(this.users)) {
      let occupants_uins = nextProps.groupManager.occupants_uins || []
      this.users = rxaget(nextProps, 'user.users', {}) || {}
      this.loadGroupsTemp(occupants_uins, this.users)
    }

    if (nextProps?.rxgroup?.group.group_id === this.props.groupManager.group_id
      && JSON.stringify(nextProps.rxgroup.group) !== JSON.stringify(this.props.groupManager)
    ) {
      let occupants_uins = nextProps.rxgroup.group.occupants_uins || []
      this.setState({ group: nextProps.rxgroup.group })
      this.loadGroupsTemp(occupants_uins, this.users)
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    let isRerender = false
    if (JSON.stringify(nextState) !== JSON.stringify(this.state))
      isRerender = true
    else if (rxaget(nextProps, 'groupManager.group_id', '') !== rxaget(this.state, 'group.group_id', ''))
      isRerender = true
    return isRerender
  }

  preGetMedia(netaMedia, group_id) {
    var arrData = []
    if (netaMedia && netaMedia.data && netaMedia.data[group_id]) {
      const objMedia = JSON.parse(JSON.stringify(netaMedia.data[group_id]))
      if (objMedia && objMedia.images) {
        for (const key of Object.keys(objMedia.images || {})) {
          if (objMedia.images[key]) { arrData.push(objMedia.images[key]) }
        }
      }
    }
    arrData.sort((a, b) => (a.msg_create_at > b.msg_create_at) ? -1 : ((b.msg_create_at > a.msg_create_at) ? 1 : 0))
    this.setState({
      loadingMedia: true, arrData: arrData,
      block_scroll: false, paging_page: 0
    }, () => this.loadMediaStatic())
  }

  lg_chooseLeader(ele) {
    this.setState({ lg_leaderMemberChecked: ele.id })
  }

  chooseLeader(ele) {
    this.setState({ leaderMemberChecked: ele.id })
  }

  isLeader(eleId) {
    let isLeaderFlag = false
    try {
      eleId = eleId.toString()
      let owner_uin = this.state.group.owner_uin.toString()
      if (eleId === owner_uin) {
        isLeaderFlag = true
      }
      else if (this.state.group.occupants_uins.indexOf(owner_uin) === -1
        && this.state.group.admin_uins
        && this.state.group.admin_uins.indexOf(eleId) >= 0) {
        isLeaderFlag = true
      }
      // eleId !== owner_uin && console.log(" this.state.group", eleId,owner_uin,this.state.group.admin_uins)
    } catch (error) { }
    return isLeaderFlag
  }

  onChangeSearch_chooseLeader(e) {
    let value = e.target.value
    let arrGroups
    if (value.startsWith('0')) {
      value = value.replace(value.charAt(0), '+84')
    }
    if (e.target.value.length > 0) {
      arrGroups = this.state.groupsTemp.filter(o => (rxChangeSlug(checkNameUser(o)).indexOf(rxChangeSlug(value)) !== -1 || rxChangeSlug(o.phone).indexOf(rxChangeSlug(value)) !== -1))
    } else {
      value = ''
      arrGroups = this.state.groupsTemp.filter(o => rxChangeSlug(checkNameUser(o)).indexOf(rxChangeSlug(value)) !== -1)
    }
    this.setState({ chooseLeader_groupsTemp: arrGroups })
  }

  fetchImage(src, callback) {
    const timenow = Math.floor(Date.now() / 1000)
    try {
      let timeCreateImg = (typeof this.checkImage[src] !== 'undefined') ? rxaget(this.checkImage[src], 'created_at', 0) : 0
      if (!this.checkImage[src] || ((timenow - timeCreateImg) > 43200 && timeCreateImg > 0)) {
        fetch(src, { headers: { 'TC-Token': this.token }, redirect: 'follow' })
          .then(res => {
            if (res && res.redirected && res.url && src) {
              try {
                callback(res.url)
                this.props.netaBlobsUpdate(src, res.url)
              } catch (e) {
                callback('')
              }
            } else {
              callback('')
            }
          })
      } else {
        callback(rxaget(this.checkImage[src], 'link', ''))
      }
    } catch (e) {
      callback('')
    }
  }

  onChangeSearch_lg_chooseLeader(e) {
    let value = e.target.value
    let arrGroups
    if (value.startsWith('0')) {
      value = value.replace(value.charAt(0), '+84')
    }
    if (e.target.value.length > 0) {
      arrGroups = this.state.groupsTemp.filter(o => (rxChangeSlug(checkNameUser(o)).indexOf(rxChangeSlug(value)) !== -1 || rxChangeSlug(o.phone).indexOf(rxChangeSlug(value)) !== -1))
    } else {
      value = ''
      arrGroups = this.state.groupsTemp.filter(o => rxChangeSlug(checkNameUser(o)).indexOf(rxChangeSlug(value)) !== -1)
    }
    this.setState({ lg_chooseLeader_groupsTemp: arrGroups })
  }

  onChangeSearchNChat(e) {
    let value = e.target.value
    let arrGroups
    if (value.startsWith('0')) {
      value = value.replace(value.charAt(0), '+84')
    }
    if (value) {
      arrGroups = this.state.groupsNChatOrigin.filter(member => (rxChangeSlug(checkNameUser(member)).indexOf(rxChangeSlug(value)) !== -1 || rxChangeSlug(member.phone).indexOf(rxChangeSlug(value)) !== -1))
    } else {
      arrGroups = this.state.groupsNChatOrigin
    }
    this.setState({
      groupsNChat: arrGroups,
    }, () => {
      const images = document.getElementsByClassName('ava-useravatar')
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const valueAttr = images[i].getAttribute('data-id')
          if (valueAttr && valueAttr.indexOf('userava') !== -1) {
            const userid = valueAttr.replace('userava', '')
            if (userid) {
              const avatar_url = global.rxu.config.get_avatar + userid
              this.fetchImage(avatar_url, (data) => {
                if (data) {
                  images[i].src = data
                }
              })
            }
          }
        }
      }
    })
  }

  leaveGroupBtnClick() {
    let groupObj = JSON.parse(JSON.stringify(this.state.group))
    let groupObjMemberIdArr = groupObj.occupants_uins
    let contactsUsers = []
    if (groupObj && groupObj.occupants_uins && groupObj.occupants_uins.constructor === Array && this.users && Object.keys(this.users).length > 0) {
      for (const userid of Object.keys(this.users)) {
        if (groupObjMemberIdArr.indexOf(userid.toString()) !== -1) {
          contactsUsers.push(this.users[userid])
        }
      }
      if (contactsUsers.length > 0) {
        let user = rxaget(this.props, 'netaauth.user', {})
        this.props.clickPopup('leave_group', { data: { groups: contactsUsers, user: user, group: groupObj } }, (data) => {
          if (data) {
            this.funcChooseLeader(data)
          } else {
            this.leaveGroup()
          }
          // console.log('Đây là thời điểm mà hoàn tất rời khỏi nhóm.')
          // this.props.closePopup?.();
        })
      }
    }
  }

  funcChooseLeader(leaderChecked) {
    let groupObj = rxaget(this.props, 'groupManager', {})
    let leaderMemberChecked = leaderChecked
    let index = this.state.admin_uins_index

    groupObj.admin_uins[index] = leaderMemberChecked.toString()
    const params = {
      group_id: Number(groupObj.group_id),
      admin_uins: groupObj.admin_uins
    }

    rxio.addAdmin(params, (data) => {
      if (data) {
        try {
          this.setState({ closeBtnClick: false, doneBtnClick: false })
          const arrUsers = this.users
          const user = rxaget(this.props, 'netaauth.user', {})
          const objUser = arrUsers[user.id.toString()]
          const paramsCreateMess = {
            group_id: Number(this.state.group.group_id),
            type: 6,
            version: 1,
            nonce: (Math.floor(Date.now()) * 1000).toString(),
            sender_name: rxaget(objUser, 'full_name', ''),
            attachments: JSON.stringify({
              mediaType: 0, type: 'update_group',
              admin_uins: [groupObj.admin_uins[index]]
            }).replace(/"/g, '\\"'),
            "is_encrypted": false, "mentioned_all": false
          }
          rxio.createMessage(paramsCreateMess, (dataMess) => {
            if (dataMess) {
              let groupObj = JSON.parse(JSON.stringify(this.state.group))
              groupObj.admin_uins = groupObj.admin_uins[index]
              groupObj.last_message = dataMess.message
              groupObj.last_message_id = dataMess.last_message_id
              this.props.changeStatusLoadMess()
              this.props.chooseGroupAction(groupObj)
              this.props.netaGroupsUpdate(Number(groupObj.group_id), groupObj)
              this.leaveGroup()
            }
          })
        } catch (error) { console.log("addAdmin", error) }
      }
    }) //async function

    this.setState({ displayLeaveGroupScreen: false })
  }


  leaveGroup_cancelBtnClick() {
    this.setState({ displayLeaveGroupScreen: false })
  }

  leaveGroup_okBtnClick() {
    if (this.state.group.admin_uins) {
      let admin_unis = this.state.group.admin_uins
      let isOpen = !admin_unis.some(i => (this.userid.toString() !== i.toString() && this.state.group.occupants_uins.indexOf(i.toString()) >= 0))

      if (isOpen) {
        this.setState({ displaySelectManagerScreen: true })
      } else {
        this.leaveGroup()
      }
    }
  }


  chooseLeader_okBtnClick() {
    // let groupObj = rxaget(this.state, 'group', {})
    let groupObj = rxaget(this.props, 'groupManager', {})
    let leaderMemberChecked = this.state.leaderMemberChecked
    let index = this.state.admin_uins_index

    groupObj.admin_uins[index] = leaderMemberChecked.toString()
    let owner_uin = Number(groupObj.admin_uins[index])
    if (groupObj.admin_uins[index]) {
      const msg = {
        group_id: Number(groupObj.group_id),
        name: "",
        owner_uin: owner_uin
      }
      rxio.socket.emit("update_group", msg, (data) => {
        if (data && data.result === 0) {
          try {
            this.setState({
              closeBtnClick: false,
              doneBtnClick: false,
              leaderMemberChecked: ''
            })

            const arrUsers = this.users
            const user = rxaget(this.props, 'netaauth.user', {})
            const objUser = arrUsers[user.id.toString()]
            const paramsCreateMess = {
              group_id: Number(this.state.group.group_id),
              type: 6,
              version: 1,
              nonce: (Math.floor(Date.now()) * 1000).toString(),
              sender_name: rxaget(objUser, 'full_name', ''),
              attachments: JSON.stringify({
                mediaType: 0, type: 'update_group',
                owner_uin: owner_uin
              }).replace(/"/g, '\\"'),
              "is_encrypted": false, "mentioned_all": false
            }
            rxio.createMessage(paramsCreateMess, (dataMess) => {
              if (dataMess) {
                let groupObj = JSON.parse(JSON.stringify(this.state.group))
                groupObj.owner_uin = owner_uin
                groupObj.last_message = dataMess.message
                groupObj.last_message_id = dataMess.last_message_id
                this.props.changeStatusLoadMess()
                this.props.chooseGroupAction(groupObj)
                this.props.netaGroupsUpdate(Number(groupObj.group_id), groupObj)
              }
            })
          } catch (error) { console.log("addAdmin", error) }
        }
      })
    }
  }

  lg_chooseLeader_okBtnClick() {
    let groupObj = rxaget(this.props, 'groupManager', {})
    let leaderMemberChecked = this.state.lg_leaderMemberChecked
    let index = this.state.admin_uins_index

    const params = {
      group_id: Number(groupObj.group_id),
      admin_uins: [leaderMemberChecked.toString()]
    }
    rxio.addAdmin(params, (data) => {
      if (data) {
        try {
          this.setState({
            closeBtnClick: false,
            doneBtnClick: false,
            leaderMemberChecked: ''
          })
          const arrUsers = this.users
          const user = rxaget(this.props, 'netaauth.user', {})
          const objUser = arrUsers[user.id.toString()]
          const paramsCreateMess = {
            group_id: Number(this.state.group.group_id),
            type: 6,
            version: 1,
            nonce: (Math.floor(Date.now()) * 1000).toString(),
            sender_name: rxaget(objUser, 'full_name', ''),
            attachments: JSON.stringify({
              mediaType: 0, type: 'update_group',
              admin_uins: [groupObj.admin_uins[index]]
            }).replace(/"/g, '\\"'),
            "is_encrypted": false, "mentioned_all": false
          }

          rxio.createMessage(paramsCreateMess, (dataMess) => {
            if (dataMess) {
              let groupObj = JSON.parse(JSON.stringify(this.state.group))
              groupObj.admin_uins = groupObj.admin_uins[index]
              groupObj.last_message = dataMess.message
              groupObj.last_message_id = dataMess.last_message_id
              this.props.changeStatusLoadMess()
              this.props.chooseGroupAction(groupObj)
              this.props.netaGroupsUpdate(Number(groupObj.group_id), groupObj)
              this.leaveGroup()
            }
          })
        } catch (error) { console.log("addAdmin", error) }
      }

    })
    this.setState({ displayLeaveGroupScreen: false })
  }

  leaveGroup() {
    let groupObj = this.state.group
    if (groupObj && groupObj.group_id) {
      if (rxio.connected) {
        const msgUpGroup = {
          group_id: Number(groupObj.group_id)
        }
        let groupsStore = this.props.netaGroups
        rxio.leaveGroup(msgUpGroup, (data) => {
          if (data && [0, 1].indexOf(data.result) !== -1) {
            this.setState({ displayLeaveGroupScreen: false }, () => {
              this.props.netaGroupsRemove(groupObj.group_id)
              if (groupsStore && groupsStore.groups) {
                let arrGroups = Object.keys(groupsStore.groups)
                if (arrGroups.constructor === Array && arrGroups.length > 2) {
                  arrGroups = arrGroups.filter(groupid => groupid !== groupObj.group_id.toString())
                  if (groupsStore.groups && groupsStore.groups[arrGroups[0]]) {
                    this.props.chooseGroupAction(groupsStore.groups[arrGroups[0]])
                  }
                }
              }
            })
          }
          this?.props?.closePopup && this.props.closePopup();
        }) //async function
      }
    }

  }

  removeMember(mem) {
    let groupObj = JSON.parse(JSON.stringify(this.state.group))
    if (rxio.connected) {
      const msgUpGroup = {
        group_id: Number(groupObj.group_id),
        name: '',
        avatar_url: '',
        pull_all: [mem.id.toString()]
      }
      rxio.socket.emit('update_group', msgUpGroup, (data) => {
        const arrUsers = this.users
        const user = rxaget(this.props, 'netaauth.user', {})
        const objUser = arrUsers[user.id.toString()]
        const paramsCreateMess = {
          group_id: Number(groupObj.group_id),
          type: 6,
          version: 1,
          sender_name: objUser.full_name || '',
          message: '',
          attachments: JSON.stringify({ removed_uins: [mem.id.toString()], type: 'update_group' }).replace(/"/g, '\\"')
        }
        rxio.socket.emit('create_message', paramsCreateMess, (dataMess) => {
          if (dataMess) {
            let groupObj = JSON.parse(JSON.stringify(this.state.group))
            groupObj.occupants_uins = data.group.occupants_uins
            groupObj.last_message = dataMess.message
            groupObj.last_message_id = dataMess.last_message_id
            groupObj.timestamp = new Date().getTime() * 1000
            this.props.changeStatusLoadMess()
            this.props.chooseGroupAction(groupObj)
            this.props.netaGroupsUpdate(Number(groupObj.group_id), groupObj)
          }
        })
      })
    }
  }

  onChangeNotiGroup() {
    try {
      let disableNoti = !this.state.disableNoti
      let groupObj = JSON.parse(JSON.stringify(this.state.group))
      let netaAuthSetting = JSON.parse(localStorage.getItem('netaAuthSetting') || `{"groups":{}}`)
      !netaAuthSetting.groups[Number(this.state.group.group_id)]
        && (netaAuthSetting.groups[Number(this.state.group.group_id)] = {})
      netaAuthSetting.groups[Number(this.state.group.group_id)].disableNoti = disableNoti
      // rxsetLocal('netaAuthSetting', JSON.stringify(netaAuthSetting))
      this.props.netaAuthSettingUpdate(netaAuthSetting)
      this.props.changeStatusLoadMess()
      this.props.chooseGroupAction(groupObj)
      this.setState({ disableNoti: disableNoti })
    } catch (error) { console.log("onChangeNotiGroup", error) }
  }

  onClickAddMember() {
    let groupObj = JSON.parse(JSON.stringify(this.state.group))
    let groupObjMemberIdArr = groupObj.occupants_uins
    let contactsUsers = []
    if (this.users && Object.keys(this.users).length > 0) {
      for (const userid of Object.keys(this.users)) {
        if (!groupObjMemberIdArr.includes(userid.toString())) {
          contactsUsers.push(this.users[userid])
        }
      }
      this.setState({ groupsNChat: contactsUsers, groupsNChatChecked: [] }, () => {
        let user = rxaget(this.props, 'netaauth.user', {})
        this.props.clickPopup('add_member', { data: { groups: contactsUsers, user: user } }, (data) => {
          if (data && data.constructor === Array && data.length > 0) {
            this.onClickUpdateGroup(data)
          }
        })
      })
    }
  }

  onClickUpdateGroup(groupsChecked = []) {
    let groupObj = JSON.parse(JSON.stringify(this.state.group))

    // let groupsChecked = groupsNChatChecked || []
    // let clickAddMemberBtn = this.state.clickAddMemberBtn
    // let groupObjMemberIdArr = JSON.parse(JSON.stringify(groupObj.occupants_uins))
    // if (groupsChecked && groupsChecked.constructor === Array) {
    //   for (let i = 0; i < groupsChecked.length; i++) {
    //     groupObjMemberIdArr.push(String(groupsChecked[i]))
    //   }
    // }

    if (groupsChecked.length > 0) {
      let arrMember = groupsChecked.map(o => o.toString())

      // if (clickAddMemberBtn === false && groupObj && groupObj.group_id && arrMember.constructor === Array && arrMember.length > 0) {
      if (groupObj && groupObj.group_id && arrMember.constructor === Array && arrMember.length > 0) {
        if (rxio.connected) {
          const msgUpGroup = {
            group_id: Number(groupObj.group_id),
            name: '',
            avatar_url: '',
            push_all: arrMember
          }
          rxio.updateGroup(msgUpGroup, (data) => {
            const arrUsers = this.users
            const user = rxaget(this.props, 'netaauth.user', {})
            const objUser = arrUsers[user.id.toString()]
            const paramsCreateMess = {
              group_id: Number(groupObj.group_id),
              type: 6,
              version: 1,
              sender_name: objUser.full_name || '',
              message: '',
              attachments: JSON.stringify({ added_uins: arrMember, type: 'update_group' }).replace(/"/g, '\\"')
            }
            rxio.createMessage(paramsCreateMess, (dataMess) => {
              if (dataMess) {
                let groupObj = JSON.parse(JSON.stringify(this.state.group))
                groupObj.occupants_uins = data.group.occupants_uins
                groupObj.last_message = dataMess.message
                groupObj.last_message_id = dataMess.last_message_id
                groupObj.timestamp = new Date().getTime() * 1000
                // this.clearSearchBox()
                this.props.changeStatusLoadMess()
                this.setState({ addMemberScreen: false })
                this.props.chooseGroupAction(groupObj)
                this.props.netaGroupsUpdate(Number(groupObj.group_id), groupObj)
              }
            })
          })
        }
      }
    } else {
      alert(translate('Add Member Error'))
    }
    // this.setState({ clickAddMemberBtn: true })
  }

  closeAddMemberScreen() {
    this.clearSearchBox()
    this.setState({ addMemberScreen: false })
  }

  onClickAddMemberGroup(contact) {
    const groupsNChatChecked = JSON.parse(JSON.stringify(this.state.groupsNChatChecked))
    console.log(groupsNChatChecked, 'groupsNChatChecked')
    if (groupsNChatChecked.indexOf(contact.id) === -1) {
      groupsNChatChecked.push(contact.id)
    } else {
      groupsNChatChecked.splice(groupsNChatChecked.indexOf(contact.id), 1)
    }
    this.setState({ groupsNChatChecked })
  }

  lg_closeNewManager() {
    this.setState({ displaySelectManagerScreen: false })
  }

  newManager_dropListClick() {
    if (this.state.displayGroupList === true) {
      this.setState({ displayGroupList: false })
    } else {
      this.setState({ displayGroupList: true })
    }
  }

  backBtnClickGroup() {
    this.setState({ doneBtnClick: false })
  }

  editAccountInfo() {
    this.setState({ doneBtnClick: true, groupNameValue: checkNameGroup(this.state.group, this.users, this.userid) })
  }

  doneAccountInfo() {
    this.setState({ doneBtnClick: false })
    try {
      if (this.state.groupNameValue !== checkNameGroup(this.state.group, this.users, this.userid)) {
        let newName = this.state.groupNameValue
        if (this.state.group.type === 3) {
          const user = rxaget(this.props, 'netaauth.user', {})
          let groupObj = JSON.parse(JSON.stringify(this.state.group))
          groupObj.name = newName
          groupObj.group_name = newName
          groupObj.group_fullname = newName
          groupObj.last_message = {
            attachments: `{"updated_group_name":${newName},"mediaType":0,"type":"update_group"}`,
            group_id: Number(this.state.group.group_id),
            type: 6,
            sender_uin: user.id.toString()
          }
          let netaAuthSetting = JSON.parse(localStorage.getItem('netaAuthSetting') || `{"groups":{}}`)
          !netaAuthSetting.groups[Number(this.state.group.group_id)]
            && (netaAuthSetting.groups[Number(this.state.group.group_id)] = {})
          netaAuthSetting.groups[Number(this.state.group.group_id)].name = newName
          rxsetLocal('netaAuthSetting', JSON.stringify(netaAuthSetting))
          this.props.changeStatusLoadMess()
          this.props.chooseGroupAction(groupObj)
          // this.props.netaGroupsUpdate(Number(groupObj.group_id), groupObj)
        }
        else
          if (rxio.connected) {
            let msg = {
              group_id: Number(this.state.group.group_id),
              "name": newName
            }
            rxio.socket.emit("update_group", msg, (data) => {
              if (data && data.result === 0) {
                try {
                  const arrUsers = this.users
                  const user = rxaget(this.props, 'netaauth.user', {})
                  const objUser = arrUsers[user.id.toString()]
                  let msg = {
                    group_id: Number(this.state.group.group_id),
                    type: 6,
                    version: 1,
                    nonce: (Math.floor(Date.now()) * 1000).toString(),
                    sender_name: rxaget(objUser, 'full_name', ''),
                    attachments: JSON.stringify({
                      updated_group_name: newName,
                      mediaType: 0, type: "update_group"
                    }).replace(/"/g, '\\"'),
                    "is_encrypted": false, "mentioned_all": false
                  }
                  rxio.socket.emit('create_message', msg, (dataMess) => {
                    console.log("doneAccountInfo update_group", dataMess)
                    if (dataMess) {
                      let groupObj = JSON.parse(JSON.stringify(this.state.group))
                      groupObj.name = newName
                      groupObj.group_name = newName
                      groupObj.group_fullname = newName
                      groupObj.last_message = dataMess.message
                      groupObj.last_message_id = dataMess.last_message_id
                      this.props.changeStatusLoadMess()
                      this.props.chooseGroupAction(groupObj)
                      this.props.netaGroupsUpdate(Number(groupObj.group_id), groupObj)
                    }
                  })
                } catch (error) { console.log("update_group name", error) }
              }
            })
          }
      }
    } catch (error) { console.log("update_group name", error) }
  }

  openNewManager() {
    this.setState({ closeBtnClick: true })
  }

  closeNewManager() {
    this.setState({ closeBtnClick: false })
  }

  loadImgStatic(obj, name, url = global.rxu.config.cdn_endpoint) {
    if (obj.sender_avatar) {
      return global.rxu.config.get_static + obj.sender_avatar
    } else if (obj.avatar_url) {
      return global.rxu.config.get_static + obj.avatar_url
    } else if (obj.type === 3 && !obj.avatar_url) {
      const users = this.users
      if (obj && obj.occupants_uins && obj.occupants_uins.constructor === Array && obj.occupants_uins.length === 2 && obj.occupants_uins.indexOf(this.userid.toString()) !== -1) {
        const arruserid = obj.occupants_uins.filter(o => o !== this.userid.toString())
        if (arruserid && arruserid.constructor === Array && arruserid[0] && users[arruserid[0]] && users[arruserid[0]].profile_url) {
          return url + users[arruserid[0]].profile_url
        }
      } else {
        return './images/default/static/avadefault.svg'
      }
    } else {
      return './images/default/static/avadefault.svg'
    }
  }

  async loadMediaStatic() {
    const group = this.state.group
    const paging_page = this.state.paging_page
    const paging_size = this.state.paging_size
    const block_scroll = this.state.block_scroll
    const netaMedia = JSON.parse(JSON.stringify(rxaget(this.props.netaMedia, 'data.' + group.group_id, { images: {}, videos: {}, files: {} })))
    let breakLoop = false
    let checkContinue = 0
    if (group && group.group_id && this.token) {
      if (!block_scroll) {
        for (let i = paging_page; i < 100; i++) {
          let pageoffset = i
          pageoffset = i
          const api_media_chat = global.rxu.config.get_media_chat
            + '?load_attachments=true&offset=' + pageoffset * paging_size + '&group_id='
            + group.group_id + '&media_type=2%2C%204%2C%2012&limit=' + paging_size
          this.controller[group.group_id] = new AbortController();
          let { signal } = this.controller[group.group_id];
          let res = await fetch(api_media_chat, {
            signal: signal, method: 'GET', headers: {
              Accept: 'application/json', 'TC-Token': this.token,
              Connection: 'Keep-Alive', 'Accept-Encoding': 'gzip'
            }, body: null
          }).catch(function (error) { });
          try {
            let json = await res.json()
            if (json && this.state.group.group_id === group.group_id) {
              const arrMedia = json.filter((v, i, a) => a.findIndex(t => ((t.media_uid + t.message_id) === (v.media_uid + v.message_id))) === i).sort((a, b) => (a.msg_create_at > b.msg_create_at) ? 1 : ((b.msg_create_at > a.msg_create_at) ? -1 : 0))
              for (const media of arrMedia) {
                let attachments = {}
                try {
                  attachments = JSON.parse(rxaget(media, 'attachments', '').replace(/[\t\r\n]/g, ''))
                } catch (e) {
                  if (typeof (rxaget(media, 'attachments', '')) === 'object') {
                    attachments = rxaget(media, 'attachments', '')
                  }
                }
                if (media.media_type === 2) {
                  if (attachments && attachments.images && attachments.images.constructor === Array && attachments.images.length > 0) {
                    for (const oimage of attachments.images) {
                      media.url = rxaget(oimage, 'url', '')
                      if (!netaMedia.images[media.url] && media.url) {
                        netaMedia.images[media.url] = { url: media.url, message_id: media.message_id, group_id: media.group_id, media_type: media.media_type, msg_create_at: media.msg_create_at }
                        checkContinue = checkContinue + 1
                      }
                    }
                  }
                }

                if (media.media_type === 4) {
                  if (attachments && attachments.video && attachments.video.constructor === Object) {
                    media.url = rxaget(attachments, 'video.url', '') || ''
                    media.thumbnail_url = rxaget(attachments, 'video.thumbnail_url', '') || ''
                    if (netaMedia.videos && !netaMedia.videos[media.url] && media.url) {
                      netaMedia.videos[media.url] = { url: media.url, thumbnail_url: media.thumbnail_url, message_id: media.message_id, group_id: media.group_id, media_type: media.media_type, msg_create_at: media.msg_create_at }
                      checkContinue = checkContinue + 1
                    }
                  }
                }

                if (media.media_type === 12) {
                  if (attachments && attachments.file && attachments.file.constructor === Object) {
                    media.url = rxaget(attachments, 'file.url', '') || ''
                    media.ext = rxaget(attachments, 'file.file_extension', '') || ''
                    media.file_name = rxaget(attachments, 'file.file_name', '') || ''
                    if (netaMedia.files && !netaMedia.files[media.url] && media.url) {
                      netaMedia.files[media.url] = { url: media.url, ext: media.ext, name: media.file_name, message_id: media.message_id, group_id: media.group_id, media_type: media.media_type, msg_create_at: media.msg_create_at }
                      checkContinue = checkContinue + 1
                    }
                  }
                }
              }
              if (checkContinue === 0 || this.state.group.group_id !== group.group_id) { breakLoop = true }

              // this.props.netaMediaAdd(group.group_id, netaMedia)

              if ((arrMedia && arrMedia.constructor === Array && arrMedia.length < paging_size) || this.state.group.group_id !== group.group_id) {
                breakLoop = true
              }
              // console.log("++", i, paging_size, arrMedia.length, checkContinue, breakLoop)
            }
            else if (this.state.group.group_id !== group.group_id) {
              console.log("ASYCN CHANGE ID")
            }
          } catch (eJson) {
            this.setState({ paging_page: 0, arrData: [], block_scroll: false })
            break
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
          if (this.state.group.group_id === group.group_id) {

            let arrDataTmp = []
            const type = this.state.tabactive || 'images'
            if (netaMedia && netaMedia[type]) {
              for (const key of Object.keys(netaMedia[type] || {})) {
                if (netaMedia[type][key]) { arrDataTmp.push(netaMedia[type][key]) }
              }
            }
            arrDataTmp = arrDataTmp.sort((a, b) => (a.msg_create_at > b.msg_create_at) ? -1 : ((b.msg_create_at > a.msg_create_at) ? 1 : 0))

            this.setState({ arrData: arrDataTmp })
          }

          if (breakLoop) {
            if (this.state.group.group_id === group.group_id) {
              this.setState({ paging_page: i + 1, block_scroll: true, loadingMedia: false })
            }
            break
          }
        }
      }
    }
  }

  changeTabActive(type) {
    const group_id = rxaget(this.state.group, 'group_id', '')
    const netaMedia = rxaget(this.props.netaMedia, 'data.' + group_id, { images: {}, videos: {}, files: {} })
    let arrData = []
    if (netaMedia && netaMedia[type]) {
      for (const key of Object.keys(netaMedia[type] || {})) {
        if (netaMedia[type][key]) { arrData.push(netaMedia[type][key]) }
      }
    }
    arrData = arrData.sort((a, b) => (a.msg_create_at > b.msg_create_at) ? -1 : ((b.msg_create_at > a.msg_create_at) ? 1 : 0))
    this.setState({ tabactive: type, arrData: arrData })
  }

  showGallery({ index, type }) {
    this.setState({ checkgallery: true, galleryPosition: Number(index), type: type })
  }

  keyClickFunction(event) {
    if (event.keyCode === 27) {
      this.closeGallery()
    }
  }

  closeGallery() {
    this.setState({ checkgallery: false })
  }

  downloadFile(file_id, file_name) {
    const src = global.rxu.config.get_static + '/' + file_id
    try {
      const downloadLink = document.createElement('a')
      downloadLink.href = src
      downloadLink.download = file_name
      downloadLink.setAttribute('download', 'download')
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (e) { }
  }

  getStringsImages(arrData) {
    let galleryImages = ''
    arrData.forEach(element => {
      galleryImages += element.url.replace(/\s/g, '') + ','
    })
    return (
      galleryImages

    )
  }

  clearSearchBox() {
    const chatDiv = document.getElementById('addmember_searchBox')
    chatDiv.value = ''

  }

  func_getCharacName(name) {
    let arrName = name.split(' ');
    if (arrName.length === 1) {
      let _name = arrName[0][0] + arrName[0][1]
      return _name.toUpperCase()
    }
    else {
      let _name = (arrName[0][0] + arrName[arrName.length - 1][0])
      return _name.toUpperCase()
    }
  }

  loadGroupsTemp(occupants_uins, users) {
    // let groupId = occupants_uins//this.state.group.occupants_uins
    // let groups = users//this.users
    let groupsTemp = []
    let countMemberOnl = 0
    if (occupants_uins) {
      for (const useridkey of Object.keys(users)) {
        for (let i = 0; i < occupants_uins.length; i++) {
          if (String(occupants_uins[i]) === String(users[(useridkey)].id)) {
            groupsTemp.push(users[(useridkey)])
            if (users[(useridkey)].online_status === 1) {
              countMemberOnl++
            }
          }
        }
      }
      this.setState({
        occupants_uins: occupants_uins,
        groupsTemp: groupsTemp,
        chooseLeader_groupsTemp: groupsTemp,
        lg_chooseLeader_groupsTemp: groupsTemp,
        countMemberOnl: countMemberOnl
      })
    }

  }

  uploadFileImages(fileList) {
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
                                const arrUsers = this.users
                                const user = rxaget(this.props, 'netaauth.user', {})
                                const objUser = arrUsers[user.id.toString()]
                                let msg = {
                                  group_id: Number(this.state.group.group_id),
                                  avatar_url: key,
                                }
                                if (msg && msg.group_id) {
                                  if (rxio.connected) {
                                    rxio.socket.emit("update_group", msg, (data) => {
                                      if (data && data.result === 0) {
                                        let msg = {
                                          group_id: Number(this.state.group.group_id),
                                          type: 6,
                                          version: 1,
                                          nonce: (Math.floor(Date.now()) * 1000).toString(),
                                          sender_name: rxaget(objUser, 'full_name', ''),
                                          attachments: JSON.stringify({
                                            updated_group_avatar: key,
                                            mediaType: 0, type: "update_group"
                                          }).replace(/"/g, '\\"'),
                                          "is_encrypted": false, "mentioned_all": false
                                        }
                                        rxio.socket.emit('create_message', msg, (dataMess) => {
                                          if (dataMess) {
                                            let groupObj = JSON.parse(JSON.stringify(this.state.group))
                                            groupObj.avatar_url = key
                                            groupObj.last_message = dataMess.message
                                            groupObj.last_message_id = dataMess.last_message_id
                                            this.props.changeStatusLoadMess()
                                            this.props.chooseGroupAction(groupObj)
                                            this.props.netaGroupsUpdate(Number(groupObj.group_id), groupObj)
                                          }
                                        })
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

  disableDrop = event => {
    event.preventDefault();
  }

  onClickStopCall() {
    this.props.closePopup()
  }

  onClickShowPopupCreateGroup() {
    let flagCreateGroupPopup = this.state.flagCreateGroupPopup
    this.setState({ flagCreateGroupPopup: !flagCreateGroupPopup })
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

  onClickClosePopup = () => {
    this.setState({ flagCreateGroupPopup: false })
  }

  chooseFileImages(fileList) {
    console.log(fileList, 'phai lít')
    if(!fileList?.length) return
    let groupImageURL = URL.createObjectURL(fileList[0])
    this.setState({ groupImage: fileList, chooseFileImagesStatus: true, groupImageURL: groupImageURL })
  }

  onAfterBlockUser = group => {
    this.setState({ group: {...group} }, () => this.props.chooseGroupAction(group))
    this.forceUpdate()
  }

  render() {
    const group = this.state.group
    const tabactive = this.state.tabactive
    const arrData = this.state.arrData
    const galleryImages = arrData && this.getStringsImages(arrData)
    
    let arrUserSelected = []
    let contactTitle = ''
    if (this.state.groupsNChatOrigin && this.state.groupsNChatOrigin.constructor === Array && this.state.groupsNChatOrigin.length > 0) {
      arrUserSelected = this.state.groupsNChatOrigin.filter(ucontact => this.state.groupsNChatChecked.indexOf(ucontact.id) !== -1)
    }
    this.state.groupsNChat.sort(this.compareContact)

    return (
      <div className='zchat_mangagerscreen'>
        <div className='zchat_callscreen_bg'></div>
        <div className={`zchat_callscreen_main ${this.state.isShowPopupManageGroup ? 'visible' : 'invisible'}`}>
          {/* {this.state.flagManageGroupContextMenu &&  */}
          <div className='zchat_mangagercenter'>
            <img className='zchat_mangagercenter_close' alt='' src={'./images/default/icons/icon-close.png'} onClick={e => this.onClickStopCall()} />

            <div className='' >
              <div className='newManager_ztab-more-user'>
                <div className='zmore-header'>
                  <div className='edit-img-user_manage_group'>
                    {/* <div className='edit-img-user_group'> */}
                    {(checkAvatarGroup(this.state.group, this.users, this.userid))
                      && <>
                        <img src={this.loadImgStatic(this.state.group, 'group', global.rxu.config.get_static)} alt='' className='account-ava-group images-static'
                          onError={(e) => { e.target.style.display = 'none' }} />
                        <img src={this.loadImgStatic(this.state.group, 'group')} alt='' className='account-ava-group images-static'
                          onError={(e) => { e.target.style.display = 'none' }} />
                      </>}
                    {!(this.state.group.avatar_url || (this.users[this.state.group.partner_id] && this.users[this.state.group.partner_id]['profile_url'])) &&
                      <span className='account-ava-span'
                        style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + checkNameGroup(this.state.group, this.users).slice(0, 2).toUpperCase())}, #FFFFFF)` }}>
                        {rxChangeSlug(checkNameGroup(this.state.group, this.users, this.userid), true).slice(0, 2).toUpperCase()}
                      </span>
                    }

                  </div>
                  <div className='zmore-btn-edit_groupAcount'>
                    {((this.isLeader(this.userid) && rxaget(group, 'type', 0) !== 3) || rxaget(group, 'type', 0) === 3) &&
                      <span className='zmore-txt-edit_manage_group' onClick={e => this.editAccountInfo()}>
                        {translate('Edit')}
                      </span>
                    }

                  </div>
                </div>
                <span className='ztab-more-user_txtname'>
                  {subString(checkNameGroup(this.state.group, this.users, this.userid), 20)}
                </span>

                {/* {(rxaget(group, 'type', 0) === 3)
                  && getGroupById(this.state.group, this.users, this.userid).online_status === 1
                  && <span className='ztab-more-user_status'>
                    {translate('Online')}
                  </span>
                } */}

                {/* {console.log(this.state.group, 'this.state.group')}
                {console.log(this.state.usersStatus, 'this.state.usersStatus')}
                {console.log(this, 'this')} */}

                {(rxaget(group, 'type', 0) === 3)
                  && this.state.group
                  && (this.state.group.partner_id || this.state.group.occupants_uins[0])
                  && this.state.usersStatus[Number(this.state.group.partner_id || this.state.group.occupants_uins[0])]
                  && (this.state.usersStatus[Number(this.state.group.partner_id || this.state.group.occupants_uins[0])].online_status === 1
                    ? <span className='ztab-more-user_status'>Online</span>
                    : this.state.usersStatus[Number(this.state.group.partner_id
                      || this.state.group.occupants_uins[0])].last_seen_at > 0
                      ? <span className='ztab-more-user_status'>
                        {translate('Last seen ')}
                        {autoConvertTime(this.state.usersStatus[Number(this.state.group.partner_id || this.state.group.occupants_uins[0])].last_seen_at)}
                      </span>
                      : <span className='ztab-more-user_status'>Offline</span>
                  )
                }

                {/* {(rxaget(group, 'type', 0) === 3)
                  && getGroupById(this.state.group, this.users, this.userid).online_status !== 1
                  && <span className='ztab-more-user_status'>
                    {translate('Last seen ')}
                    {autoConvertTime(rxaget(group, 'last_message.created_at', ''))
                      || autoConvertTime(rxaget(group, 'created_at', ''))}
                  </span>
                } */}

                {(rxaget(group, 'type', 0) !== 3)
                  && <span className='ztab-more-user_status'>
                    {this.state.groupsTemp?.length}
                    {translate(' member')}
                    {this.state.countMemberOnl > 0 ? (', ' + this.state.countMemberOnl + ' Online') : ''}
                  </span>
                }

                <div className='newManager_dropList' onClick={e => this.newManager_dropListClick()}>
                  <div className={(rxaget(group, 'type', 0) !== 3) ? 'newManager_dropList_body' : 'className_hiden'}>
                    <div className='newManager_dropList_title'>
                      {translate('Group members')}
                    </div>
                    <div className='newManager_dropList_icon'>
                      <i className={this.state.displayGroupList === true ? 'editGroup_arrow_right' : 'arrow down'}></i>
                    </div>
                  </div>
                </div>
              </div>

              {(rxaget(group, 'type', 0) === 3) && <div className='ztab-more-info'>
                <div className='ztab-more-info_phone'>
                  <span className='ztab-more-info_phone-txt'>{translate('Phone number')}</span>
                  <span className='ztab-more-info_phone_number_user'>{zget(this.users, [this.state.group.partner_id], {}).phone}</span>

                </div>
                {/*<div className='ztab-more-info_act'>
                  <img className='icon32 icon-act' alt='' src={zget(this.props, 'themeValue')==='blueColor'?'./images/icons/messenger_bl.png':'./images/icons/messenger.png'} />
                  <img className='icon32 icon-act' alt='' src={zget(this.props, 'themeValue')==='blueColor'?'./images/icons/callright_bl.png':'./images/icons/callright.png'}  />
                  <img className='icon32 icon-act' alt='' src={zget(this.props, 'themeValue')==='blueColor'?'./images/icons/videocall_bl.png':'./images/icons/videocall.png'} />
                </div>*/}
              </div>}

              {/* Danh sach nhom */}
              <div className={(rxaget(group, 'type', 0) === 3) || (this.state.displayGroupList === true) ? 'newManager_contactlist_hiden' : 'newManager_contactlist'} id='zgroup_list' onScroll={this.scrollGroupChat}>
                {this.state.groupsTemp.map((ele, index) =>
                  <div className={(ele.group_id === this.state.group_id) ? 'newManager_zgroupitem-contact active clearfix' : 'newManager_zgroupitem-contact clearfix'} key={index}  >
                    {/*<div id='menu-mouseright-chat'><RxModalMouseRightChat /></div>*/}
                    <div className='newManager_avatar'>
                      {(ele.profile_url) && <img src={global.rxu.config.cdn_endpoint + ele.profile_url} alt='' className='ava-group images-static'
                        onError={(e) => { e.target.onerror = null; e.target.src = global.rxu.config.get_static + ele.profile_url }} />}
                      {(!ele.profile_url) &&
                        <span className='ava-span' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + checkNameContact(ele).slice(0, 2).toUpperCase())}, #FFFFFF)` }}>
                          {rxChangeSlug(checkNameUser(ele)).slice(0, 2).toUpperCase()}
                        </span>
                      }
                    </div>

                    <div className={'zgroup_maininfo-contact' + (ele.id !== this.userid && this.isLeader(this.userid) ? "edit" : '')}>
                      <div className='newManager_userinfo_place'> {subString(checkNameUser(ele, this.userid, this.props.netaauth), 20)} </div>
                      {!this.isLeader(ele.id) && <div className='remove_member'
                        onClick={() => this.removeMember(ele)} >{translate('Remove')}</div>}
                      {<div className={this.isLeader(ele.id) ? 'newManager_leader' : 'newManager_leader_hiden'}>{translate('Leader')}</div>}
                      {(ele.online_status) && <div className={ele.online_status === 1 ? 'newManager_user_online' : 'newManager_user_hiden'}>Online</div>}
                    </div>
                    <div className='group_divider' ></div>
                  </div>
                )
                }
              </div>
              <div className={(rxaget(group, 'type', 0) === 3) ? 'ztab-add-member_hiden' : 'ztab-add-member'} >
                <div className='zact-add_manage_group'>
                  <span className={rxaget(group, 'type', 0) !== 3 ? 'zact-add-member' : 'zact-add-member_hiden'}
                    onClick={e => this.onClickAddMember()}
                  >
                    {translate('Add member')}
                  </span>
                  {/* <span className={rxaget(group, 'type', 0) === 3 ? 'zact-block-contact':'zact-block-contact_hiden'} > 
                    {translate('Block contact')}
                  </span> */}
                </div>
              </div>

              <div className={(rxaget(group, 'type', 0) !== 3) ? 'tab_create_group_chat_hiden' : 'tab_create_group_chat'} >
                <div className='tab_create_group_chat_area'>
                  <span className={rxaget(group, 'type', 0) === 3 ? 'tab_create_group_chat_main' : 'tab_create_group_chat_main_hiden'}>
                    <CreateGroupChat
                      currentUser={this.users[this.userid]} //cái này là id của mình (acc đang đăng nhập) chứ không phải của thằng được click
                      userChecked={this.users[this.state.group.partner_id]}
                      netaauth={this.props.netaauth}
                      users={this.state.groupsNChat}
                      createGroupChatText= {translate('Create a group')}
                      onShow={() => this.setState({ isShowPopupManageGroup: false })} 
                      onHide={() => this.setState({ isShowPopupManageGroup: true })} 
                      onHideAllPopup={() => this.setState({ isShowPopupManageGroup: true })} 
                    />
                  </span>
                </div>
              </div>
              
              <div className={this.state.notificationStatus === true ? 'ztab-more-act' : 'ztab-more-act_hiden'}>
                <div className='zact-add_manage_group_noti'>
                  <span className='group_manage_allow_noti'>
                    {translate('Allows notifications')}
                  </span>
                  <div className='manage_group_noti_mode'>
                    <label className='switch'>
                      <input className='pushToggles' type='checkbox' checked={!this.state.disableNoti}
                        onChange={e => this.onChangeNotiGroup()} />
                      <span className='slider round'></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* HERE - Blocke User */}
                { group.type === 3 && <div className='group_manage_block_user'>
                  <BlockUser
                    isBlocked={checkBlock(group, this.userid)} 
                    group={group}
                    onAfterBlockUser={this.onAfterBlockUser}
                    blockText= {translate('Block contact')}
                    unBlockText= {translate('Unblock contact')}
                    blockConfirmText = {translate('Are you sure you want to block this contact, you and this person will not be able to make calls or send messages')}
                    unBlockConfirmText = {translate('Are you sure you want to unblock this contact')}
                    cancelBtnText = {translate('Cancel')}
                    acceptBtnText = {translate('Accept')}
                  />
                </div>}
              {/* END - Block User */}

              <div className='ztab-more-act'>
                <div className={rxaget(group, 'type', 0) !== 3 ? 'zact' : 'zact_hiden'}>
                  <span className={rxaget(group, 'type', 0) !== 3 ? 'zact-leave-group' : 'zact-leave-group_hiden'}
                    onClick={e => this.leaveGroupBtnClick()}>
                    {translate('Leave group')}
                  </span>

                  <span className={rxaget(group, 'type', 0) === 3 ? 'zact-block-contact' : 'zact-block-contact_hiden'} >
                    {translate('Block contact')}
                  </span>
                </div>
              </div>
              <div className='ztab-more-document'>
                <div className='zdocument-header'>
                  <span className={(tabactive === 'images') ? 'zdocument-header-txt zdocument-header-txt-active' : 'zdocument-header-txt'} onClick={e => this.changeTabActive('images')}>{translate('Image')}</span>
                  <span className={(tabactive === 'videos') ? 'zdocument-header-txt zdocument-header-txt-active' : 'zdocument-header-txt'} onClick={e => this.changeTabActive('videos')}>Video</span>
                  <span className={(tabactive === 'files') ? 'zdocument-header-txt zdocument-header-txt-active' : 'zdocument-header-txt'} onClick={e => this.changeTabActive('files')}>{translate('Document')}</span>
                </div>
                <div className='zdocument-list'>
                  {(arrData && arrData.length > 0) && <>
                    {arrData.map((ele, index) => (
                      <div key={ele.media_uid + ele.url} className='zdocument-item'>
                        {(tabactive === 'images') && <img src={global.rxu.config.get_static + ele.url} alt='' className='zdoc-item' onClick={e => this.showGallery({ index, type: 'img' })} />}
                        {(tabactive === 'videos') && <div className='zvideo-list' onClick={e => this.showGallery({ index, type: 'video' })}>
                          {(ele.thumbnail_url && ele.thumbnail_url !== '') && <img src={global.rxu.config.get_static + ele.thumbnail_url} alt='' className='zvideo-item' onClick={e => this.showGallery({ index, type: 'video' })} />}
                          <div className='zvideo-item-play'><img src={'./images/default/static/icon-media-play-white.svg'} alt='icon-media-play-white' /></div>
                        </div>}
                        {(tabactive === 'files') && <div className='zdoc-list' title={ele.name || ''}>
                          <div className='zicon-doc'><span className='icon-doc' onClick={e => this.downloadFile(ele.url, ele.name)} /></div>
                          <div className='zicon-name' title={ele.name || ''}><span className='icon-doc-name'>{(ele.name) ? ele.name.substring(0, (6)) + '...' : ''}</span></div>
                        </div>}
                      </div>))}
                  </>}

                  <div className="loading" style={{ display: this.state.loadingMedia ? 'flex' : 'none' }}><div className="dot-flashing"></div></div>
                </div>
                {this.state.checkgallery && RxImageGallery &&
                  <RxImageGallery images={galleryImages} closeShowGallery={() => this.closeGallery()} position={this.state.galleryPosition} type={this.state.type} />
                }
              </div>

              <div className={this.state.displayLeaveGroupScreen ? 'leaveGroup_rectangle' : 'leaveGroup_rectangle_hiden'}>
                <div className='leaveGroup_rectangle_1'></div>
                <div className='leaveGroup_rectangle_2'></div>
              </div>
            </div>
          </div>
          {/* } */}

          <div className={this.state.doneBtnClick === true ? 'edit_group_manage_area' : 'edit_group_manage_area_hiden'} >
            <div className='edit_group_manage'>
              <div className='zmore-header'>
                <div className='zmore-btn-back_place' onClick={e => this.backBtnClickGroup()}>
                  <i className='icon-arrow-left' ></i>
                </div>
                <div className='rxAccount-edit-btn-done'>
                  <span className='manage_group-edit-txt-done' onClick={e => this.doneAccountInfo()}>
                    {translate('Done')}
                  </span>
                </div>
                <div className='edit-img-manage-group' onClick={(e) => { rxaget(group, 'type', 0) !== 3 && this.refs.data_image.click() }}>
                  <input type='file'
                    id='data_image'
                    ref='data_image'
                    multiple={false}
                    key={this.state.theInputFileKey + '_data_image'}
                    style={{ display: 'none' }}
                    onChange={(e) => this.uploadFileImages(e.target.files)}
                    accept="image/jpg,image/png,video/mp4" />
                  {rxaget(group, 'type', 0) !== 3 && <div className="icon-camera"></div>}
                  {(checkAvatarGroup(this.state.group, this.users, this.userid)) &&
                    <>
                      <img src={this.loadImgStatic(this.state.group, 'group')} alt=''
                        className={'account-ava-group images-static' + (rxaget(group, 'type', 0) !== 3 ? " edit" : "")}
                        onError={(e) => { e.target.style.display = 'none' }} />
                      <img src={this.loadImgStatic(this.state.group, 'group', global.rxu.config.get_static)} alt=''
                        className={'account-ava-group images-static' + (rxaget(group, 'type', 0) !== 3 ? " edit" : "")}
                        onError={(e) => { e.target.style.display = 'none' }} />
                    </>
                  }
                  {!(this.state.group.avatar_url || (this.users[this.state.group.partner_id] && this.users[this.state.group.partner_id]['profile_url'])) &&
                    <span className={'account-ava-span' + (rxaget(group, 'type', 0) !== 3 ? " edit" : "")}
                      style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + checkNameGroup(this.state.group, this.users).slice(0, 2).toUpperCase())}, #FFFFFF)` }}>
                      {rxChangeSlug(checkNameGroup(this.state.group, this.users, this.userid)).slice(0, 2).toUpperCase()}
                    </span>
                  }

                </div>

              </div>
              <div className='rxAccount_group_name_place'>
                <div className='rxAccount_group_name_title'>{(rxaget(group, 'type', 0) !== 3) ? translate('Group name') : translate('Full name')}</div>
                <input className='rxAccount_group_name_input' placeholder={translate('Edit name')}
                  value={this.state.groupNameValue}
                  onChange={(event) => this.setState({ groupNameValue: event.target.value })} ></input>
                <div className='edit_divider_manage_group'></div>
              </div>
              <div className={(rxaget(group, 'type', 0) !== 3) ? 'rxAccount_btn_newManager' : 'rxAccount_btn_newManager_hiden'} onClick={e => this.openNewManager()}>{translate('Add new leader')}</div>
            </div>
          </div>
          <div className={this.state.closeBtnClick === true ? 'add_new_group_leader_area' : 'add_new_group_leader_area_hiden'}>
            <div className='add_new_group_leader'>
              <div className='newManager_title_place'>
                <div className='newManager_title'>{translate('Choose leader')}</div>
                <div className='newManager_btn_close'>
                  <img className='newManager_icon_close filter_img_class' src={'./images/default/icons/icon-basic-up.svg'} alt="" onClick={e => this.closeNewManager()} />
                </div>
              </div>
              <div className='newgroup_searchwrap'>
                <div className='newgroup_icon_search_area'>
                  <img className='newgroup_icon_search_search filter_img_class' src={'./images/default/icons/search-active.svg'} alt='' />
                </div>
                <input type='search' placeholder={translate('Search')} maxLength='30' className={zget(this.props, 'themeBackgroudValue') === 'darkTheme' ? 'newgroup_search_place darkThemeInput' : 'newgroup_search_place lightThemeInput'} onChange={e => { this.onChangeSearch_chooseLeader(e) }} onDrop={this.disableDrop}></input>

                <div className='newgroup_icon_close_area'></div>
              </div>
              {/* doi truong nhom*/}
              <div className='selectManager_contactlist' id='zgroup_list' onScroll={this.scrollGroupChat}>
                {this.state.chooseLeader_groupsTemp.map((ele, index) => (
                  this.userid !== ele.id && <div className={(ele.group_id === this.state.group_id) ? 'newManager_zgroupitem-contact active clearfix' : 'newManager_zgroupitem-contact clearfix'} key={index}  >
                    <div className='newManager_avatar'>
                      {(ele.profile_url) && <img src={global.rxu.config.cdn_endpoint + ele.profile_url} alt='' className='ava-group images-static'
                        onError={(e) => { e.target.onerror = null; e.target.src = global.rxu.config.get_static + ele.profile_url }} />
                      }
                      {(!ele.profile_url) &&
                        <span className='ava-span' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + checkNameContact(ele).slice(0, 2).toUpperCase())}, #FFFFFF)` }}>{rxChangeSlug(checkNameContact(ele)).slice(0, 2).toUpperCase()}</span>
                      }
                    </div>
                    <div className='zgroup_maininfo-contact' onClick={e => this.chooseLeader(ele)}>
                      <div className='newManager_userinfo_place'> {subString(checkNameUser(ele), 20)} </div>
                      <div className='newManager_checked'>
                        <label className='container101'>
                          <input className='checkmark_leader' checked={this.state.leaderMemberChecked === ele.id} type='radio' name="newManager_radio" />
                          <span className='checkmark_choose_leader' onClick={e => this.chooseLeader(ele)}></span>
                        </label>
                      </div>
                    </div>
                    <div className='group_divider_choose_leader' ></div>
                  </div>
                ))}
              </div>
              <div className='chooseLeader_okBtn_area'>
                <div className='chooseLeader_okBtn' onClick={e => this.chooseLeader_okBtnClick()}>{translate('Done')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  themeValue: state.themeValue,
  themeBackgroudValue: state.themeBackgroudValue,
  user: state.user,
  netaauth: state.netaauth,
  rxgroup: state.rxgroup,
  netaGroups: state.netaGroups,
  netaMedia: state.netaMedia,
  usersStatus: state.usersStatus
})

const mapDispatchToProps = {
  netaMediaAdd,
  changeStatusLoadMess,
  chooseGroupAction,
  netaGroupsUpdate,
  netaAuthSettingUpdate,
  netaGroupsRemove,
  clickPopup
}

const RxManagerGroupWrap = connect(
  mapStateToProps,
  mapDispatchToProps
)(RxManagerGroup)

export default RxManagerGroupWrap