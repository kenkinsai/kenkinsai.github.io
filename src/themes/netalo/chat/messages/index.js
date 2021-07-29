/*global translate*/
import { connect } from 'react-redux'
import * as Jsx from './index.jsx'
import React, { Fragment } from 'react'


const stickerDataObj = global.rootRequire('classes/stickerData.json');
const RxComponent = global.rootRequire('components/shares/rxComponent').default
const { timeConverter, timeToDate, secondToTime, rxaget, formatBytes, subString, changeTheme, changeTheme_ThemeColor, changeThemeColor, rxconfig, isElectron, sortArrObj, timesUnixToDate, convertSecondUnix } = global.rootRequire('classes/ulti')
const { updateUserStatus, netaGroupsRemove, netaBlobsUpdate, netaMessAdd, netaMessPin, chooseGroupAction, netaUserUpdate, netaGroupsUpdate, netaGroupsUpdateLastMess, changeStatusTabmore, netaLinkAdd, netaMediaOneAdd,userClickUpdate } = global.rootRequire('redux')
const { checkIsOwner, parseMessageDesc, checkNameUser, checkNameGroup } = global.rootRequire('classes/chat')
const rxio = global.rootRequire('classes/socket').default
const { rxgetLocal, rxsetLocal } = global.rootRequire('classes/request')
const themeData = global.rootRequire('classes/themeData.json')
const themeColorData = global.rootRequire('classes/themeColorData.json')
const theme_themeColorData = global.rootRequire('classes/theme_themeColorData.json')
let zget = global.rxu.get

window.ClickInfoUser = (useridtmp,userOwnerid,groupid) => {
  if(useridtmp !== userOwnerid){
    let user = window[useridtmp]
    let partner_id = user.id
    let userOwner = window[userOwnerid]
    let userClick_group =window[groupid]
    window.vmChat.setState({
      infoUserScreen: true,
      // currentAvatarUser: user.avatar, 
      // currentNameUser: user.name,
      userInfo:user,
      avatarClick_user: user,
      currentSender_uin: useridtmp,
      userClick_group:userClick_group,
      tagIsClick: true,
      // avatarClick_omess: user.msg,
    })
  }
}

class Component_ extends RxComponent {
  constructor(props, context) {
    super(props, context, Jsx)
    this.state = {
      stickerFolderName: [],
      arrTabsDisplay: [],
      messages: {},
      pinedMess: {},
      group_id: rxaget(this.props, 'rxgroup.groupid', ''),
      group: rxaget(this.props, 'rxgroup.group', {}),
      groupfw: '',
      scroll_mess: true,
      scrollChatBoxStatus: false,
      tabmore: rxaget(this.props, 'tabmore.data', false),
      id_userclick: '',
      groupid_forward_old: 'null',
      tabmoreNextprop: false,
      seenMess: false,
      lastSeenMessId: '',
      lastSeenMessObj: {},
      userInfo: {},
      screenUserInfo: false,
      avatarClick_user: '',
      avatarClick_omess: '',
      pathImg: './images/sticker',
      currentAvatarUser: '',
      currentNameUser: '',
      displayScrollDownBtn: false,
      isForwardAudio:false,
      tagnameClick_status:false,
      arrData: [],
      tabActive: 'images',
      userClick_group:{},      
      displaymodalpin:'',
      displayDragAndDrop: false,
    }
    this.dropRef_Mess = React.createRef()

    let tmp_stickerFolderName = rxgetLocal('netaStickerFolder')
    if (tmp_stickerFolderName) {
      tmp_stickerFolderName = global.rxu.json(rxgetLocal('tmp_stickerFolderName'), {})
      this.state.stickerFolderName = tmp_stickerFolderName
    }

    let dataSticker = global.rxu.json(rxgetLocal('rxsticker'), {})
    if (dataSticker.pathimg) {
      this.state.pathImg = dataSticker.pathimg
    }

    
    this.groupid_forward = 'null'
    this.token = rxaget(this.props, 'netaauth.user.token', '')
    this.user = rxaget(this.props, 'netaauth.user', '')
    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    this.users = rxaget(this.props, 'user.users', {})
    this.groups = rxaget(this.props, 'netaGroups.groups', {})
    this.pg_mess = 1
    this.countNoti = {}
    this.loadRenderer = 0
    this.indexImageForward = -1
    this.strImgForward = ''
    this.timer = {}

    this.state.mess_reply = {}
    this.state.mess_selected = {}
    this.state.mess_id = ''
    this.state.pin_mess_id = ''
    this.state.type_option = 0
    this.state.audio = {}

    this.checkImage = {}
    this.checkLink = {}
    this.blockDownload = false

    this.keyClickFunction = this.keyClickFunction.bind(this);
    this.changeMessage = this.changeMessage.bind(this)
    this.scrollChatBox = this.scrollChatBox.bind(this)
    this.playAudio = this.playAudio.bind(this)
    this.downloadFile = this.downloadFile.bind(this)
    this.openExternalLink = this.openExternalLink.bind(this)
    this.showGallery = this.showGallery.bind(this)
    this.getGallery = this.getGallery.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.reloadStateWhenRepMess = this.reloadStateWhenRepMess.bind(this)
    this.resetSelectedMess = this.resetSelectedMess.bind(this)
    this.unPin = this.unPin.bind(this)
    this.convertTagName = this.convertTagName.bind(this)
    this.parseMessage = this.parseMessage.bind(this)
    this.loadHandleSocket = this.loadHandleSocket.bind(this)
    this.onClickInfoUser = this.onClickInfoUser.bind(this)
    this.onClickNameUser = this.onClickNameUser.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)

    window.vmChat = this //register vm
  }

  componentDidMount() {
    let div = this.dropRef_Mess.current
    div.addEventListener('dragenter', this.handleDragIn)
    if (rxio.socket) {
      rxio.socket.on('user_status', (data) => this.props.updateUserStatus(data))
      
    }
    try {
      let stickerFolderName = []
      let stickerDataTmp = global.rxu.json(rxgetLocal('rxsticker'), {})
      let stickerData = (stickerDataTmp.version) ? stickerDataTmp : stickerDataObj
      if (stickerData && stickerData.stickerData) {
        stickerData.stickerData.forEach(o => {
          if (o.type && o.type !== 'history' && o.type !== 'EmojiIcon') {
            stickerFolderName.push(o.type)
          }
        })
      }
      let group = rxaget(this.props, 'rxgroup.group', {})

      if (typeof group !== 'undefined') {
        let lastSeenMessObj = global.rxu.json(rxgetLocal('netaLastSeenMessObj'), '')
        let groupId = rxaget(this.props, 'rxgroup.groupid', '')
        let rxlastSeenMessId = ''
        if(group && group.last_message ){
          rxlastSeenMessId = group.last_message.message_id
        }
        let seen_uins_list = []

        if (group && group.seen_list && group.seen_list.constructor === Array && group.seen_list.length > 0) {
          if(group.seen_list[1]){            
            seen_uins_list = group.seen_list[1].message_id
          }else{
            if(group.seen_list[0]){
              seen_uins_list  = group.seen_list[0].message_id 
            }
          }
        }
        //<check seen mess>
        if (typeof lastSeenMessObj === 'undefined' || !this.findGroup(groupId)) {
          lastSeenMessObj[groupId] = { lastSeenMessId: rxlastSeenMessId, seen_uins_list: seen_uins_list }
          rxsetLocal('netaLastSeenMessObj', JSON.stringify(lastSeenMessObj))
        }
        this.setState({ lastSeenMessObj: lastSeenMessObj, stickerFolderName: stickerFolderName, arrTabsDisplay: stickerData.stickerData })
      }
    }
    catch (e) {
      console.log(e)
    }

    this.loadDidMount()

    if (window && window.ipcRenderer) {
      window.ipcRenderer.on('reload_page', (event, args) => {
        if (rxaget(this.state.group, 'group_id', '') !== '') {
          this.countNoti = {}
          this.chooseGroup(this.state.group)

          if (this.loadRenderer < 2) {
            rxio.getWaitMessage((data) => {
              this.handleMessage(data, true)
            })
            rxio.getWaitMessDel((data) => {
              this.handleMessage(data, false)
            })
          }

          this.loadRenderer += 1

        }
      })
      window.ipcRenderer.on('new_sticker', (event, args) => {
        if (args) {
          try {
            let objSticker = JSON.parse(args)
            if (objSticker.version) {
              // this.updateSticker(objSticker)
              this.setState({ pathImg: objSticker.pathimg })
            }
          } catch (e) {
          }
        }
      })
    }
    const color = global.rxu.json(rxgetLocal('netaThemeColor'), '')
    const themeBackGround = global.rxu.json(rxgetLocal('netaThemeBackGround'), '')

    if (themeBackGround === 'darkTheme') {
      changeTheme(themeData.nightTheme)
      changeTheme_ThemeColor(theme_themeColorData.nightTheme)
    } else {
      changeTheme(themeData.defaultTheme)
      if (color === 'blueColor') {
        changeTheme_ThemeColor(theme_themeColorData.blueColor)
      } else {
        changeTheme_ThemeColor(theme_themeColorData.orangeColor)
      }
    }
    if (color === 'blueColor') {
      changeThemeColor(themeColorData.blueColor)
    } else {
      changeThemeColor(themeColorData.orangeColor)
    }
    this.chooseGroup(this.state.group)
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if( nextProps.rxgroup && 
        nextProps.rxgroup.group &&
        nextProps.rxgroup.group.blocked_uins &&
        this.state.group &&
        this.state.group.blocked_uins &&
        this.state.group.blocked_uins.length !== nextProps.rxgroup.group.blocked_uins.length){
      let group = nextProps.rxgroup.group
      this.groups[group.group_id]= group
    }
    if (Object.getOwnPropertyNames(this.users).length === 0) {
      this.users = nextProps.user.users
    }
    let lastSeenMessObj = global.rxu.json(rxgetLocal('netaLastSeenMessObj'), '')

    if (rxaget(nextProps, 'rxgroup.groupid', '') && 
      rxaget(nextProps, 'rxgroup.group.group_id', '') && 
      rxaget(nextProps, 'rxgroup.groupid', '') !== this.state.group_id) {
      try {
        let group = rxaget(nextProps, 'rxgroup.group', {})
        if (typeof group !== 'undefined') {
          let groupId = rxaget(nextProps, 'rxgroup.groupid', '')
          let rxlastSeenMessId = ''
          if(group.seen_list[1]){
            rxlastSeenMessId  = group.seen_list[1].message_id 
          }else{
            if(group.seen_list[0]){
              rxlastSeenMessId  = group.seen_list[0].message_id 
            }
          }
          /*check seen mess*/
          if (!this.findGroup(groupId)) {
            let seen_uins_list = []
            lastSeenMessObj[groupId] = { lastSeenMessId: rxlastSeenMessId, seen_uins_list: seen_uins_list }
            rxsetLocal('netaLastSeenMessObj', JSON.stringify(lastSeenMessObj))
          }
        }
      }
      catch (e) {
        console.log('error',e)
      }
      this.setState({ group: nextProps.rxgroup.group })
      this.chooseGroup(rxaget(nextProps, 'rxgroup.group', {}))
    }
    let mess_selected = this.state.mess_selected
    if (typeof mess_selected.groupfw === 'undefined') {
      if (mess_selected.group_id && (mess_selected.group_id !== rxaget(nextProps, 'rxgroup.group.group_id', ''))) {
        this.resetSelectedMess()
      }
    } else {
      if (mess_selected.groupfw !== rxaget(nextProps, 'rxgroup.group.group_id', '')) {
        this.resetSelectedMess()
      }
    }

    if (rxaget(nextProps, 'loadmess.data', false) !== rxaget(this.props, 'loadmess.data', false)) {
      this.loadDidMount()
    }
    if (JSON.stringify(nextProps.tabmore.data) !== JSON.stringify(this.state.tabmoreNextprop) ||
      JSON.stringify(lastSeenMessObj) !== JSON.stringify(this.state.lastSeenMessObj)) {
      this.setState({ tabmoreNextprop: nextProps.tabmore.data, lastSeenMessObj: lastSeenMessObj })
    }
    if (nextProps.netaGroups && 
      // JSON.stringify(nextProps.netaGroups) !== JSON.stringify(this.netaGroups)
      nextProps.netaGroups.status !== rxaget(this.props, 'netaGroups.status', {})) {
      this.groups = rxaget(nextProps, 'netaGroups.groups', {})
      this.netaGroups = nextProps.netaGroups
      let groupsTmp = JSON.parse(JSON.stringify(rxaget(nextProps, 'netaGroups.groups', {})))
      let arrGroupsTmp = []
      Object.keys(groupsTmp).forEach(keygroup => {
        if (groupsTmp[keygroup].last_message) {
          try {
            groupsTmp[keygroup].timestamp = (groupsTmp[keygroup].last_message.created_at
              && Number(groupsTmp[keygroup].last_message.created_at)) || new Date().getTime() * 1000
            arrGroupsTmp.push(groupsTmp[keygroup])
          } catch (error) { }
        }
      })
      let arrGroups = arrGroupsTmp.sort((a, b) => (a.timestamp > b.timestamp) ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0))
      arrGroups.forEach(ogroup => {
        ogroup.group_fullname = checkNameGroup(ogroup, this.users, this.userid)
        if (ogroup && (ogroup.type === 3 || ogroup.type === 5) && !ogroup.avatar_url && rxaget(ogroup, 'occupants_uins', []).length === 2) {
          const arrUins = rxaget(ogroup, 'occupants_uins', [])
          ogroup['partner_id'] = (arrUins[0].toString() === this.userid.toString()) ? arrUins[1] : arrUins[0]
        }
      })
    }
  }

  getGroupByUserId(partner_id){
    let group = {}
    let groupsTmp = this.users[partner_id]
    if (groupsTmp) {
      let group_id = groupsTmp.group_id
      if(group_id){
        group = this.groups[group_id]
      }  
    }
    
    return group
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyClickFunction, false);
    document.removeEventListener('mousedown', this.handleClickOutside);
    window.playAudio = null
    window.downloadFile = null
    window.showGallery = null
    window.getGallery = null
    window.openExternalLink = null

    let div = this.dropRef_Mess.current
    div.removeEventListener('dragenter', this.handleDragIn)
  }

  handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({displayDragAndDrop:true})
  }

  handleDragOut (e){
    this.setState({displayDragAndDrop:false})
  }

  findGroup(groupid) {
    let netaLastSeenMessObj = global.rxu.json(rxgetLocal('netaLastSeenMessObj'), '')
    let flagGroupId = false
    for (const groupId of Object.keys(netaLastSeenMessObj)) {
      if (groupId === groupid) {
        flagGroupId = true
      }
    }
    return flagGroupId
  }

  findSeen_uins(seen_uins, groupid) {
    let flag = false
    try {
      let netaLastSeenMessObj = global.rxu.json(rxgetLocal('netaLastSeenMessObj'), '')
      if (typeof netaLastSeenMessObj !== 'undefined') {
        let seen_uins_list = netaLastSeenMessObj[groupid].seen_uins_list
        for (let i = 0; i < seen_uins_list.length; i++) {
          if (seen_uins === seen_uins_list[i]) {
            flag = true
          }
        }
      }
    }
    catch (e) {

    }

    return flag
  }

  updatelastSeenMessObj(data) {
    let lastSeenMessObj = global.rxu.json(rxgetLocal('netaLastSeenMessObj'), '')
    let groupId = data.group_id
    let seen_uins_list = []
    let lastSeenMessId

    if (typeof lastSeenMessObj[groupId] !== 'undefined') {
      if (data.message_id === lastSeenMessObj[groupId].lastSeenMessIdTmp) {
        seen_uins_list = lastSeenMessObj[groupId].seen_uins_list
      } else {
        seen_uins_list.push(data.seen_uins[0])
      }

      if (typeof data.seen_uins[0] === 'undefined') {
        if (!this.findSeen_uins(data.sender_uin, groupId)) {
          seen_uins_list.push(data.sender_uin)
        }
      } else {
        if (!this.findSeen_uins(data.seen_uins[0], groupId)) {
          seen_uins_list.push(data.seen_uins[0])
        }
      }

      if (!this.findSeen_uins(String(this.userid), groupId)) {
        seen_uins_list.push(String(this.userid))
      }

      if (this.state.group.type === 3) {
        lastSeenMessId = data.message_id
      } else {
        if (seen_uins_list.length === this.state.group.occupants_uins.length) {
          lastSeenMessId = data.message_id
        } else {
          lastSeenMessId = lastSeenMessObj[groupId].lastSeenMessId
        }
      }

      lastSeenMessObj[groupId] = { lastSeenMessId: lastSeenMessId, lastSeenMessIdTmp: data.message_id, seen_uins_list: seen_uins_list }
      rxsetLocal('netaLastSeenMessObj', JSON.stringify(lastSeenMessObj))
      this.setState({ lastSeenMessObj: lastSeenMessObj })
      this.props.netaGroupsUpdateLastMess(data.group_id, data.message_id, data)
    } else {
      let seen_uins_list = []
      lastSeenMessId = ''

      //<check seen mess>
      lastSeenMessObj[groupId] = { lastSeenMessId: lastSeenMessId, seen_uins_list: seen_uins_list }
      rxsetLocal('netaLastSeenMessObj', JSON.stringify(lastSeenMessObj))
      this.updatelastSeenMessObj(data)

    }
  }

  loadHandleSocket() {
    rxio.getWaitConnect((data) => {
      if (data) {
        if (rxaget(this.props, 'rxgroup.group.group_id', '') !== '') {
          this.chooseGroup(this.state.group)
        }
        rxio.getWaitMessage((data) => {
          this.props.netaMessAdd(data.group_id, data)
          this.handleMessage(data, true)
          try {
            this.updatelastSeenMessObj(data)
          } catch (e) {}
        })


        rxio.getWaitLiveLocation((data) => {
          this.props.netaMessAdd(data.group_id, data)
          this.handleMessage(data, true)
          try {
            this.updatelastSeenMessObj(data)
          } catch (e) {}

        })

        rxio.getUpdateMessage((data) => {
          try {
            if (data.seen_uins.length > 0) {
              this.updatelastSeenMessObj(data)              
            }
          }
          catch (e) {
          }

        })
        rxio.getUpdateGroup((data) => {
          try {
            let groupObjSelected = this.state.group
            const arrGroupObj = rxaget(this.props, 'netaGroups.groups', {})

            // console.log("***data: ", data)
            let groupObj = arrGroupObj[data.group_id]
            if (groupObj) {
              if (data.avatar_url || data.name) {
                groupObj.avatar_url = data.avatar_url || groupObj.avatar_url
                groupObj.name = data.name || groupObj.name
                groupObj.group_name = data.group_name || data.name || groupObj.group_name
                groupObj.group_fullname = data.group_fullname || data.name || groupObj.group_fullname
                this.props.netaGroupsUpdate(data.group_id, groupObj)
                if (groupObjSelected.group_id === data.group_id) this.props.chooseGroupAction(groupObj)
              }
              if (data.owner_uin && Number(data.owner_uin) > 0) {
                groupObj.owner_uin = data.owner_uin
                this.props.netaGroupsUpdate(data.group_id, groupObj)
                if (groupObjSelected.group_id === data.group_id) this.props.chooseGroupAction(groupObj)
              }
              if (data.added_admin_all.length > 0) {
                // let groupObj = this.state.group
                let admin_uinsArr = groupObj.admin_uins
                for (let i = 0; i < data.added_admin_all.length; i++) {
                  let admin_uin = data.added_admin_all[i]
                  admin_uinsArr.push(admin_uin.toString())
                }
                groupObj.admin_uins = admin_uinsArr

                this.props.netaGroupsUpdate(data.group_id, groupObj)
                if (groupObjSelected.group_id.toString() === data.group_id.toString()) {
                  groupObjSelected.admin_uins = admin_uinsArr
                  this.props.chooseGroupAction(groupObjSelected)
                }
              }
              if (data.unblocked_all.length > 0 || data.blocked_all.length > 0) {
                groupObj.blocked_uins = data.blocked_all.length > 0 ? [...data.blocked_all] : []
                if (groupObjSelected.group_id.toString() === data.group_id.toString()) {
                  groupObjSelected.blocked_uins = [...data.blocked_all]
                  this.props.chooseGroupAction(groupObjSelected)
                }
                this.props.netaGroupsUpdate(data.group_id, groupObj)
              }
              if (data.pull_all.length > 0) {
                // let groupObj = this.state.group
                let groupObjMemberIdArr = JSON.parse(JSON.stringify(groupObj.occupants_uins))
                let memberLeaveGroup = Number(data.pull_all[0])
                let i = groupObjMemberIdArr.indexOf(memberLeaveGroup);
                if (i === -1) i = groupObjMemberIdArr.indexOf(memberLeaveGroup.toString());
                if (i !== -1) {
                  groupObjMemberIdArr.splice(i, 1)
                }
                groupObj.occupants_uins = groupObjMemberIdArr

                this.props.netaGroupsUpdate(data.group_id, groupObj)
                if (groupObjSelected.group_id.toString() === data.group_id.toString()) {
                  groupObjSelected.occupants_uins = groupObjMemberIdArr
                  // console.log("   groupObjSelected.occupants_uins ",   groupObjSelected.occupants_uins )
                  this.props.chooseGroupAction(groupObjSelected)
                }

                this.setState({ group: groupObjSelected })

                if (data.pull_all.indexOf(this.userid.toString()) >= 0) {
                  this.props.netaGroupsRemove(groupObj.group_id)
                  if (groupObjSelected.group_id.toString() === data.group_id.toString()) {
                    try {
                      let arrGroups = []
                      Object.keys(this.groups).forEach(keygroup => {
                        if (this.groups[keygroup].last_message) {
                          this.groups[keygroup].timestamp = (this.groups[keygroup].last_message.created_at
                            && Number(this.groups[keygroup].last_message.created_at)) || new Date().getTime() * 1000
                          arrGroups.push(this.groups[keygroup])

                        }
                      })
                      arrGroups = arrGroups.sort((a, b) => (a.timestamp > b.timestamp) ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0))
                      const i = arrGroups.findIndex(o => o.group_id.toString() === data.group_id.toString())
                      let curIndex = i ? 0 : 1
                      this.props.chooseGroupAction(arrGroups[curIndex])
                    } catch (error) { console.log("error", error) }
                  }
                }
              }

              if (data.push_all.length > 0) {
                if (groupObj) {
                  let groupObjMemberIdArr = JSON.parse(JSON.stringify(groupObj.occupants_uins))
                  let memberArrPush = data.push_all

                  for (let i = 0; i < memberArrPush.length; i++) {
                    groupObjMemberIdArr.push(String(memberArrPush[i]))
                  }
                  groupObj.occupants_uins = Array.from(new Set(groupObjMemberIdArr))
                  // console.log("groupObj++++", groupObj)
                  this.props.netaGroupsUpdate(data.group_id, groupObj)

                  if (rxaget(this.props, 'rxgroup.groupid', '') === data.group_id) {
                    this.props.chooseGroupAction(groupObj) 
                  }

                }
              }

              if (data.pinned_message && groupObjSelected.group_id === data.group_id) {
                try {
                  this.setState({ pinedMess: this.pushToObjMess(this.state.pinedMess, data.pinned_message, "pinned_at") }, () => {
                  })
                } catch (e) {
                  console.log(e)
                }
              }
              else if (data.unpinned_message_all && groupObjSelected.group_id === data.group_id) {
                try {
                  this.setState({ pinedMess: {} })
                } catch (e) {
                  console.log(e)
                }
              }
            }
          } catch (e) { console.log("e", e) }
        })
        rxio.getWaitMessDel((data) => {
          this.handleMessage(data, false)
        })
        rxio.getPinGroup((data) => {
          this.handleMessage(data, false)
        })
        rxio.getUnpinGroup((data) => {
          this.handleMessage(data, false)
        })
        // setTimeout(() => {
        //   rxio.getUser_status((data) => {
        //     this.updateOnlineStatus(data)
        //   })
        // }, 300)
      } else {
        setTimeout(() => {
          this.loadHandleSocket()
        }, 300)
      }
    })
  }

  loadDidMount() {
    document.addEventListener('keydown', this.keyClickFunction, false);
    document.addEventListener('mousedown', this.handleClickOutside);
    if (this.token && this.userid) {
      if (!rxio.connected && !rxio.init_connected) {
        rxio.login(this.token, this.userid, (data) => {
          if (rxaget(this.state.group, 'group_id', '') !== '') {
            this.chooseGroup(this.state.group)
          }
          rxio.getWaitMessage((data) => {
            this.handleMessage(data, true)
          })

          rxio.getWaitMessDel((data) => {
            this.handleMessage(data, false)
          })
        })
      } else {
        this.loadHandleSocket()
      }
    }

    if (window && window.ipcRenderer) {
      window.ipcRenderer.on('click_notification', (event, args) => {
        if (args && args.group_id && rxaget(this.groups, args.group_id, null)) {
          let groupNoti = rxaget(this.groups, args.group_id, {})
          this.chooseGroup(groupNoti)
        }
      })

      window.ipcRenderer.on('set_link_review', (event, args) => {
        let objlink = rxaget(this.props, 'netaLink.data.' + args.uid, {})
        if (args && args.uid) {
          if (!objlink.uid) {
            this.props.netaLinkAdd(args.uid, args)
          }
        }
      })
    }
    window.playAudio = this.playAudio
    window.downloadFile = this.downloadFile
    window.showGallery = this.showGallery
    window.getGallery = this.getGallery
    window.openExternalLink = this.openExternalLink
  }

  closeScreenUserInfo() {
    this.setState({ screenUserInfo: false })
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

  avatarClick(omess) {
    let usersinfo = zget(global.rxu.json(rxgetLocal('rxusers'), {}), 'users') || {}
    let userAvataClick = zget(usersinfo, [omess.sender_uin], {})
    this.setState({
      screenUserInfo: true,
      avatarClick_user: userAvataClick,
      avatarClick_omess: omess,
    })
  }

  convertOmessUser(omess) {
    let usersinfo = zget(global.rxu.json(rxgetLocal('rxusers'), {}), 'users') || {}
    let user = zget(usersinfo, [omess.sender_uin], {})
    return user
  }

  keyClickFunction(event) {
    if (event.keyCode === 27) {
      this.closeGallery()
    }
  }

  playAudio(audio_id) {
    let audio = this.state.audio
    audio[audio_id] = (!audio[audio_id]) ? true : false
    this.setState({ audio: audio }, () => {
      const iconAudioDiv = document.getElementById(audio_id)
      if (iconAudioDiv) {
        let idDivAudio = audio_id.replace('icon-', '')
        let audioDiv = document.getElementById(idDivAudio)
        if (audio[audio_id]) {
          iconAudioDiv.src = './images/default/static/icon-media-pause.svg'
          if (audioDiv) {
            audioDiv.play()
            audioDiv.ontimeupdate = () => {
              const processAudioDiv = document.getElementById('process-' + idDivAudio)
              if (processAudioDiv) {
                processAudioDiv.style.width = ((audioDiv.currentTime / audioDiv.duration) * 100) + '%'
              }
              if (audioDiv.currentTime === audioDiv.duration) {
                audioDiv.load()
                iconAudioDiv.src = './images/default/static/icon-media-play.svg'
                processAudioDiv.style.width = '0%'
              }
            }
          }
        } else {
          iconAudioDiv.src = './images/default/static/icon-media-play.svg'
          if (audioDiv) {
            audioDiv.pause()
          }
        }
      }
    })
  }

  showGallery(strimages, index) {
    this.setState({displaymodalpin:false, checkgallery: true, galleryImages: strimages, galleryPosition: Number(index) })
  }

  getGallery(strimages, index) {
    this.indexImageForward = index
    this.strImgForward = strimages
  }

  closeGallery() {
    this.setState({ checkgallery: false, galleryImages: '' })
  }

  downloadFile(file_id, file_name) {
    const src = global.rxu.config.get_static + '/' + file_id
    try {
      if (!this.blockDownload) {
        this.blockDownload = true
        // let downloadLink = document.createElement('a')
        // document.body.appendChild(downloadLink)
        // downloadLink.download = file_name
        // downloadLink.href = src
        // downloadLink.click()
        // document.body.removeChild(downloadLink)
        fetch(src)
        .then(resp => resp.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.download = file_name
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          this.blockDownload = false
        })
        .catch(() => console.log('Error'))  
      } else {
        alert(translate('Downloading your file please wait ...'))
      }
      
    } catch (e) { }
  }

  openExternalLink(url) {
    if (window && window.ipcRenderer && url) {
      window.ipcRenderer.send('open-external-link', { link: url })
    } else if (window && url) {
      window.open(url, '_blank') 
    }
  }

  scrollChatBox(e) {
    const chatListDiv = document.getElementById('zchat_list')
    let displayScrollDownBtn = false
    let scrollChatBoxStatus = true
    if (chatListDiv) {
      const scrollHeight = chatListDiv.scrollHeight
      const scrollTop = chatListDiv.scrollTop
      let screen = window.screen
      if (scrollHeight - scrollTop > screen.height/*511 + 150*/) {
        displayScrollDownBtn = true
      } else {
        scrollChatBoxStatus = false
      }
      if ((scrollHeight - scrollTop === scrollHeight) && this.state.scroll_mess) {
        this.pg_mess += 1
        this.loadMessages(scrollHeight)
      }
      this.setState({ displayScrollDownBtn: displayScrollDownBtn, scrollChatBoxStatus })
    }
  }

  onClickMouseRight(e, omess) {
    const menuDiv = document.getElementById('menu-message')
    const menuDivGroup = document.getElementById('context_menu-group')
    if(!([5,6,7,16].indexOf(omess.type) !== -1)){
      if (menuDiv && e.button === 2) {
        if (omess && omess.status !== 4 && rxaget(omess, 'deleted_uins', []).indexOf(this.userid.toString()) === -1) {
          document.oncontextmenu = function () {
            return false;
          }
          // document.getElementById('popup-group').style.display = 'none'
          menuDiv.style.top = e.clientY + 'px'
          menuDiv.style.left = (Number(e.clientX) - 140) + 'px'
          menuDiv.style.display = 'block'

          let newOmess = JSON.parse(JSON.stringify(omess))
          try {
            if ([2, 9].indexOf(newOmess.type) && this.indexImageForward !== -1 && this.strImgForward !== '') {
              let arrImgs = this.strImgForward.split('|')
              if (arrImgs && arrImgs.constructor === Array && arrImgs.length > 0) {
                let arrAttach = [{width: arrImgs[1], height: arrImgs[2], url: arrImgs[0]}]
                newOmess.attachments = JSON.stringify({ images: arrAttach }).replace(/\\"/g, '"')
                if (newOmess.type === 9) {
                  newOmess.type = 2
                }
              }
            } 
          } catch(e) {}

          this.setState({ mess_selected: newOmess, mess_id: omess.message_id.toString() }, () => {
            this.indexImageForward = -1
            this.strImgForward = ''
          })

          // hide context-menu on group
          if (menuDivGroup) {
            menuDivGroup.style.top = e.clientY + 'px'
            menuDivGroup.style.left = Number(e.clientX) + 'px'
            menuDivGroup.style.display = 'none'  
          }
        }
      }
    }
  }

  handleClickOutside(event) {
    if (this.state.mess_id && event.button === 0 && event.target.className !== 'menu-option') {
      this.setState({ 
        mess_selected: {}, 
        mess_id: '' 
      })  
    }
  }

  chooseOption(e, type) {
    let option = 0
    let popupGroup = false
    let isForwardAudio = false
    if (type === 'reply') {
      option = 1
    } else if (type === 'delete_all') {
      this.deleteMessage(true)
    } else if (type === 'delete_one') {
      this.deleteMessage(false)
    } else if (type === 'copy') {
      let messCopy = (rxaget(this.state, 'mess_selected.message', ''))
      if (messCopy.indexOf('@') !== -1) {
        let userstag = messCopy.match(/(@\d+\b)/ig)
        if (userstag && userstag.constructor === Array && userstag.length > 0) {
          userstag.forEach(o => {
            let useridtmp = o.replace('@', '') || ''
            if (this.users[useridtmp]) {
              messCopy = messCopy.replace(o, checkNameUser(rxaget(this.users, useridtmp, {})))
            }
          })
        }
      }
      this.copyTextToClipboard(messCopy)
    } else if (type === 'forward') {
      if((rxaget(this.state, 'mess_selected.type', '')) === 3){
        isForwardAudio = true
      }
      option = 2
      popupGroup = true
    } else if (type === 'share') {
      this.setState({ displayShareScreen: true })
    } else if (type === 'pin') {
      this.pinMessage(true)
    } else if (type === 'unpin') {
      this.unPin(false)
    }
    this.setState({ type_option: option, popupGroup: popupGroup, isForwardAudio:isForwardAudio })
  }

  closePopupGroup() {
    this.setState({ popupGroup: false, mess_selected: {}, mess_id: '' }, () => {
      this.indexImageForward = -1
      this.strImgForward = ''
    })
  }

  copyTextToClipboard(text) {
    let textArea = document.createElement('textarea')
    textArea.style.position = 'fixed'
    textArea.style.top = 0
    textArea.style.left = 0
    textArea.style.width = '2px'
    textArea.style.height = '2px'
    textArea.style.padding = 0
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    textArea.value = text.replace(/[\t\r\n]/g, '')
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.log('Oops, unable to copy')
    }
    document.body.removeChild(textArea)
  }

  deleteMessage(type) {
    const messages = this.state.messages
    const omess = rxaget(this.state, 'mess_selected', {})
    const created_at = convertSecondUnix(Number(rxaget(omess, 'created_at', 0)))
    let datetime = timesUnixToDate(created_at, Number(rxaget(omess, 'created_at', 0)))
    const group_id = this.state.group_id
    let groups = rxaget(this.props, 'netaGroups.groups', {})
    let groupObj = groups[group_id]

    if (groups[group_id].last_message_id === omess.message_id) {
      groupObj.last_message.status = 4
      this.props.netaGroupsUpdate(Number(group_id), groupObj)
    }
    if (omess.message_id && group_id) {
      const msg = {
        group_id: Number(group_id),
        message_id: omess.message_id.toString(),
        delete_all: type
      }
      type && this.unPin(false)
      if (rxio.connected) {
        rxio.socket.emit('delete_message', msg, (data) => {
          if (data && data.result === 0) {
            if (messages[datetime.toString()] && messages[datetime.toString()].data && messages[datetime.toString()].data.constructor === Array) {
              messages[datetime.toString()].data.forEach(mess => {
                if (mess.message_id === omess.message_id) {
                  mess.status = 4
                }
              })
              this.setState({ messages: messages })
            }
          }
        })
      }

    }
  }

  unPin(type) {
    const group_id = this.state.group_id
    var msg = {
      group_id: Number(group_id),

      unpin_all: type,
    }
    var username = checkNameUser(this.users[this.userid])
    if (rxio.connected) {
      var omess = rxaget(this.state, 'mess_selected', {}),
        unpinmess = username + translate(" unpin: ") + omess.message
      if (!type) {
        msg.message_id = omess.message_id.toString()
      }

      rxio.socket.emit("unpin_message", msg, (data) => {
        if (data && data.result === 0) {
          if (type) {
            this.setState({ pinedMess: {} })
            this.props.netaMessPin(group_id, {})
            unpinmess = translate("Group is unpin all message")
          }
          else {
            this.setState({ pinedMess: this.pullFromObjMess(this.state.pinedMess, omess) })
          }
          this.handleMessage({
            created_at: (Math.floor(Date.now()) * 1000).toString(),
            attachments: JSON.stringify({
              "mediaType": 0,
              "pin_message": { type: -1, content: unpinmess }
            }),
            deleted_uins: [], group_id, group_type: 3, is_encrypted: false, mentioned_all: false,
            mentioned_uins: [], message: "",
            message_id: (Math.floor(Date.now()) * 1000).toString(),
            sender_uin: this.userid,
            status: 0, type: 6, version: 0
          })
        }
      })
    }
  }

  checkPinMess() {
    var checkCode = 0
    try {
      const data = this.state.mess_selected
      if ([5, 6].indexOf(data.type) === -1) {
        checkCode = 1
        for (const key in this.state.pinedMess) {
          const messages = this.state.pinedMess[key]
          messages.data.some(o => o.message_id === data.message_id) && (checkCode = 2)
        }
        return checkCode
      } else return checkCode

    } catch (error) {
      console.log("error", error)
      return checkCode
    }
  }

  pullFromObjMess(messages, data) {
    try {
      for (const key in messages) {
        if (messages[key] && messages[key].data) {
          messages[key].data = messages[key].data.filter(o => o.message_id !== data.message_id)
          if (messages[key].data && messages[key].data.length === 0) {
            delete messages[key]
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
    return messages
  }

  pushToObjMess(messages, data, sortField = 'created_at') {
    try {
      const datetime = timeToDate(Math.floor(Number(rxaget(data, sortField, 0)) / 1000000))
      if (messages[datetime.toString()] && messages[datetime.toString()].data) {
        const arrMess = messages[datetime.toString()].data.filter(o => o.message_id !== data.message_id)
        arrMess.push(data)
        messages[datetime.toString()].data = arrMess.sort((a, b) => Number(a[sortField]) < Number(b[sortField]) ? -1 : 1)
      } else {
        if (!messages[datetime.toString()]) {
          messages[datetime.toString()] = { date: datetime, datestr: timeConverter(datetime, 'dateweek') }
        }
        if (messages[datetime.toString()] && !messages[datetime.toString()].data) {
          messages[datetime.toString()].data = [data]
        }
      }
    } catch (e) {
      console.log(e)
    }
    return messages
  }

  pinMessage(type) {
    let omess = rxaget(this.state, 'mess_selected', {})
    const group_id = this.state.group_id
    const msg = {
      group_id: Number(group_id),
      message_id: omess.message_id.toString(),
      "order_id": 1
    }
    omess.pinned_at = (Math.floor(Date.now()) * 1000).toString()
    if (rxio.connected) {
      rxio.socket.emit('pin_message', msg, (data) => {
        if (data && data.result === 0) {
          var ownerSend = this.users[omess.sender_uin],
            userSend = this.users[this.userid],
            paramsCreateMess = {
              "group_id": group_id, "nonce": (Math.floor(Date.now()) * 1000).toString(), "sender_name": checkNameUser(userSend),
              "type": 6, "version": 1, "is_encrypted": false, "mentioned_all": false,
              "sender_avatar": (userSend.profile_url) ? global.rxu.config.cdn_endpoint + userSend.profile_url : '',
              "attachments": JSON.stringify({
                "mediaType": 0,
                "pin_message": {
                  "id": omess.message_id.toString(),
                  "groupId": group_id, "type": omess.type, "content": omess.message,
                  "owner": {
                    "id": ownerSend.id, "username": omess.sender_name,
                    "avatar": omess.sender_avatar,
                    "phone": ownerSend.phone, "isonline": false, "email": ownerSend.email,
                    "coloringroup": 7,
                    "isregistered": false, "isblocked": false, "isdeleted": false
                  }, "created_at": omess.created_at,
                  "sendername": checkNameUser(userSend),
                  "senderavatar": (userSend.profile_url) ? global.rxu.config.cdn_endpoint + userSend.profile_url : '',
                  "updateat": 0, "status": 1,
                  "version": "1", "messageUpdate": "", "isEncrypted": false, "isMentionAll": false
                }
              }).replace(/"/g, '\\"')
            }
          rxio.socket.emit('create_message', paramsCreateMess, (dataMess) => {
            if (dataMess && dataMess.result === 0) {
              try {
                this.handleMessage({
                  created_at: (Math.floor(Date.now()) * 1000).toString(),
                  attachments: paramsCreateMess.attachments.replace(/\\"/g, "\""),
                  deleted_uins: [], group_id, group_type: 3, is_encrypted: false, mentioned_all: false,
                  mentioned_uins: [], message: "",
                  message_id: Number(omess.pinned_at),
                  sender_uin: this.userid,
                  status: 0, type: 6, version: 0
                })
                this.setState({ pinedMess: this.pushToObjMess(JSON.parse(JSON.stringify(this.state.pinedMess)), omess, "pinned_at") })
              } catch (e) {
                console.log(e)
              }
            }
          })
        }
      })
    }
  }

  handleMessage(data, scroll, cond) {
    const group_id = this.state.group_id
    const messages = JSON.parse(JSON.stringify(this.state.messages))
    const messid = rxaget(data, 'message_id', '')
    const created_at = convertSecondUnix(Number(rxaget(data, 'created_at', 0)))
    const datetime = timesUnixToDate(created_at, Number(rxaget(data, 'created_at', 0)))
    if (messid && datetime > 0 && data) {
      if (data.group_id.toString() === group_id.toString()) {
        try {
          if (messages[datetime.toString()] && messages[datetime.toString()].data) {
            const arrMess = messages[datetime.toString()].data.filter(o => o.message_id !== data.message_id)
            const lastmess = arrMess[arrMess.length - 1]

            if (data.sender_uin && lastmess.sender_uin && !lastmess.checked_ava) {
              if ((data.sender_uin === lastmess.sender_uin) && ((Number(lastmess.created_at) - Number(data.created_at)) < 60000000)) {
                data.checked_ava = true
              }
            }
            arrMess.push(data)
            messages[datetime.toString()].data = arrMess.sort((a, b) => Number(a.created_at) < Number(b.created_at) ? -1 : 1)
          } else {
            if (!messages[datetime.toString()]) {
              messages[datetime.toString()] = { date: datetime, datestr: timeConverter(datetime, 'dateweek') }
            }
            if (messages[datetime.toString()] && !messages[datetime.toString()].data) {
              messages[datetime.toString()].data = [data]
            }
          }

          let stateObj = { messages: messages }
          if (cond === 'footer') {
            stateObj['type_option'] = 0
            stateObj['mess_selected'] = {}
            stateObj['mess_id'] = {}
          }
          this.setState(stateObj, () => {
            if (scroll) {
              const chatDiv = document.getElementById('zchat_list')
              if (chatDiv) {
                if (this.state.displayScrollDownBtn === false || data.sender_uin === String(this.userid) || chatDiv.scrollHeight - chatDiv.scrollTop < window.screen.height/*511 + 150*/) {
                  chatDiv.scrollTop = chatDiv.scrollHeight
                }
              }  
            }

            
          })
        } catch (e) {
          // console.log(e)
        }
      }
    } 
    
    this.handleNoti(data)    
  }

  handleNoti(data) {
    if (data) {
      try {
        let netalo_noti = JSON.parse(window.sessionStorage.getItem("netalo_noti") || '{}')
        if (!netalo_noti[data.message_id] &&
          (!this.countNoti[data.group_id] || !this.countNoti[data.group_id][data.message_id])) {
          if (!(data.type === 10 && !data.attachments) && data.sender_uin.toString() !== this.userid.toString()) {
            let userSend = this.users[data.sender_uin]
            let objNoti = {
              group_id: data.group_id,
              current_group_id: this.state.group_id || '',
              message_id: data.message_id,
              message: subString(parseMessageDesc(data, this.users, this.userid), 50),
              sender_uin: data.sender_uin,
              sender_name: checkNameUser(userSend),
              sender_ava: (userSend.profile_url) ? global.rxu.config.cdn_endpoint + userSend.profile_url : ''
            }

            try {
              let groupObjTmp = this.groups[objNoti['group_id']] 
              if (groupObjTmp && groupObjTmp['type'] === 2) {
                objNoti['sender_name'] = checkNameGroup(groupObjTmp, this.users, this.userid)
                objNoti['sender_ava'] = (groupObjTmp.avatar_url) ? global.rxu.config.cdn_endpoint + groupObjTmp.avatar_url : ''
              }
            } catch(e2) {}

            let notificationStatus = rxgetLocal('netaNotificationStatus')
            let netaAuthSetting = JSON.parse(localStorage.getItem('netaAuthSetting') || `{"groups":{}}`)
            if (netaAuthSetting.groups[Number(data.group_id)]
              && netaAuthSetting.groups[Number(data.group_id)].disableNoti)
              notificationStatus = false
            if (objNoti.message && notificationStatus === JSON.stringify(true)) {
              // console.log("SEND NOTI", data, objNoti)             
              if (isElectron()) {
                window.ipcRenderer.send('notification', objNoti)
              } else {
                if (window.Notification && Notification.permission !== "denied"
                  && rxaget(data, 'sender_uin', '').toString() !== this.userid.toString()
                  && data.message_id
                  ) {
                  let notification = new Notification(objNoti.sender_name, {
                    body: objNoti.message,
                    icon: objNoti.sender_ava,
                    data: objNoti
                  });
                  notification.onclick = () => {
                    this.props.callBackRedirectChat()
                    let groupNoti = rxaget(this.groups, objNoti.group_id, {})
                    groupNoti.count_unread = 0
                    groupNoti.unread_cnt = 0
                    this.chooseGroup(groupNoti)
                    this.props.chooseGroupAction(groupNoti)
                    window.focus();
                  };
                }
              }
              netalo_noti[data.message_id] = true
              window.sessionStorage.setItem("netalo_noti", JSON.stringify(netalo_noti));
            }
          }
        }
      } catch (e) {
      }

      if (data && data.group_id && data.message_id) {
        let currentTime = (new Date()).getTime()
        let groupsStore = rxaget(this.props, 'netaGroups.groups', {})
        if (groupsStore[data.group_id] && !this.groups[data.group_id]) {
          this.groups = groupsStore
        }
        if (this.groups[String(data.group_id)]) {
          let groupnew = JSON.parse(JSON.stringify(this.groups[data.group_id]))

          if (groupnew && groupnew.last_message_id) {

            if (!this.countNoti[data.group_id]) {
              this.countNoti[groupnew.group_id] = {}
            }

            this.countNoti[groupnew.group_id][groupnew.last_message_id] = groupnew.unread_cnt

            if (rxaget(groupnew, 'last_message_id', '').toString() !== rxaget(data, 'message_id', '').toString()) {
              this.countNoti[groupnew.group_id][data.message_id] = 1
            }
          }

          let count = 0
          if (this.countNoti[groupnew.group_id]) {
            Object.keys(this.countNoti[groupnew.group_id]).forEach(key => {
              if (rxaget(this.countNoti[groupnew.group_id], key, 0) === 0) {
                count = 0
              }
              count += Number(rxaget(this.countNoti[groupnew.group_id], key, 0))
            })
          }
          if (groupnew.group_id === this.state.group_id || data.sender_uin === JSON.stringify(this.userid)) {
            groupnew.count_unread = 0
            groupnew.timestamp = currentTime * 1000
            groupnew.last_message = data
            groupnew.unread_cnt = 0
            groupnew.last_message_id = data.message_id
            this.checkReaded(groupnew.group_id, data.message_id)
          } else {

            groupnew.count_unread = count
            groupnew.timestamp = currentTime * 1000
            groupnew.last_message = data
          }
          try {
            this.props.netaGroupsUpdate(data.group_id, groupnew)
          } catch (e) {
            console.log(e)
          }

        } else {

          this.fetchGroupDetail(data.group_id)
          console.log('Don\'t have Group Current')
        }
      }
    }
  }

  parseMessage(objmsg, type) {
    // let t0 = performance.now();
    let message = ''
    let attachments = {}
    const userid = rxaget(this.props, 'netaauth.user.id', '').toString()
    if (objmsg) {
      if (!isNaN(objmsg.type)) {
        try {
          attachments = JSON.parse(rxaget(objmsg, 'attachments', '').replace(/[\t\r\n]/g, ''))
        } catch (e) {
          if (typeof (rxaget(objmsg, 'attachments', '')) === 'object') {
            attachments = rxaget(objmsg, 'attachments', '')
          }
        }
        if (objmsg.status !== 4) {
          if (objmsg.deleted_uins && objmsg.deleted_uins.constructor === Array && objmsg.deleted_uins.length > 0 && objmsg.deleted_uins.indexOf(userid) !== -1) {
            message = ''
          } else {
            let mess = ''
            switch (objmsg.type) {
              case 1:
                let call_name = ''
                let icon_call_name = ''
                if (attachments.media_type === 1) {
                  call_name = translate('Voice call')
                  icon_call_name = 'icon-phone'
                } else if (attachments.media_type === 2) {
                  call_name = translate('Video call')
                  icon_call_name = 'icon-camrecorder'
                }
                let iconcall = ''
                let stylecall = ''
                if (rxaget(attachments, 'caller_uin', '') === this.userid.toString()) {
                  iconcall = 'icon-call-out'
                  if (zget(this.props, 'themeValue') === 'blueColor') {
                    stylecall = '#d5f0ff'
                  } else {
                    if (rxconfig.theme === 'galo') {
                      stylecall = '#d4f5f1'
                    } else if (rxconfig.theme === 'default') {
                      stylecall = '#fde4d8'
                    }
                  }
                } else {
                  iconcall = 'icon-call-in'
                  if (zget(this.props, 'themeValue') === 'blueColor') {
                    stylecall = '#ebf8ff'
                  } else {
                    if (rxconfig.theme === 'galo') {
                      stylecall = '#d4f5f1'
                    } else if (rxconfig.theme === 'default') {
                      stylecall = '#fdf2ea'
                    }
                  }
                }
                message = `<div class='zchat-callmess' style='background: ${stylecall};'>
                  <div class='zchat-callname'>${call_name}</div>`
                if (attachments.accepted_at === '0') {
                  message += `<div class='zchat-calltime' style='color:#d5192d;'><i class='${iconcall}'></i>${translate('Canceled')}</div>`
                } else {
                  const time = Number(rxaget(attachments, 'stopped_at', 0)) - Number(rxaget(attachments, 'accepted_at', 0))
                  message += `<div class='zchat-calltime'><i class='${iconcall}' style='color:#2fb13e;'></i>${secondToTime(time)}</div>`
                }
                message += `<span class='zchat-callicon'><i class='${icon_call_name}'></i></span></div>`
                if (type === 'desc') {
                  mess = translate(' finished')
                  message = call_name + mess
                }
                break
              case 2:
                try {
                  if (attachments && attachments.images && attachments.images.constructor === Array && attachments.images.length > 0) {
                    let arrurlimgs = rxaget(attachments, 'images', []).map(o => o.url)
                    let strurlimgs = (arrurlimgs && arrurlimgs.constructor === Array && arrurlimgs.length > 0) ? arrurlimgs.join(',') : ''
                    message = `<div> <div></div> <div class="img-message-row" id=${objmsg.message_id}>`
                    let indeximg = 0
                    let imgHeight = 0
                    for (const img of attachments.images) {
                      if (!attachments.loading) {
                        if (img.height >= 360 && img.width >= 240) {
                          switch (img.height / img.width) {
                            case 1.5:
                              imgHeight += 360
                              break;
                            case 1:
                              imgHeight += 240
                              break;
                            default:
                              if (img.height / img.width > 1.5) {
                                imgHeight += 360
                              }
                              if (img.height / img.width < 1.5) {
                                let imgHeightTmp = 240 * (img.height / img.width)
                                if (imgHeightTmp >= 360) {
                                  imgHeight += 360
                                } else {
                                  imgHeight += imgHeightTmp
                                }
                              }
                          }
                        } else {
                          if (img.height >= 360) {
                            imgHeight += 360
                          } else {
                            if (img.width >= 240) {
                              imgHeight += 240 * (img.height / img.width)
                            } else {
                              imgHeight += img.height
                            }

                          }

                        }
                      }
                      if (attachments.loading)
                        message += '<div class="loading"></div>'                      
                      
                      let strImgForward = img.url + '|' + (img.width || 0) + '|' + (img.height || 0)
                      message += `<img src='${((!attachments.loading ? global.rxu.config.get_static : "") + img.url)}' alt='' class='img-message' onclick=window.showGallery('${strurlimgs}','${indeximg}') onmousedown="window.getGallery('${strImgForward}','${indeximg}')" />`
                      indeximg += 1
                    }
                    message += '</div></div>'
                    if (!(type === 'lastpin' || attachments.loading))
                      message = message.replace('class="img-message-row"', 'class="img-message-row"style="height:' + imgHeight + 'px;"')
                    if (type === 'desc') {
                      message = translate('Image')
                    }
                  }
                } catch (e) {
                  console.log(e)
                }
                break
              case 3:
                let audio = (attachments && attachments.audio) || objmsg.audio
                const url = rxaget(audio, 'url', '')
                const src = global.rxu.config.get_static + url
                message = `<div class='zchat-audiomess'>`
                let id = objmsg.message_id
                if (objmsg.rpId) id += objmsg.rpId
                message += `
                  <div class='zchat-audioicon filter_img_class' onclick=window.playAudio('icon-audio-${id}')>
                    <img id='icon-audio-${id}'  src='./images/default/static/icon-media-play.svg'/>
                  </div>`

                message +=
                  `
                  <div class='zchat-audiobar'>
                    <div class='zchat-audioprocess' id='process-audio-${id}'>
                    </div>
                  </div>
                  <div class='zchat-audiotime'>
                    ${secondToTime(rxaget(audio, 'duration', 0))}
                  </div>
                `
                message += `
                  <audio id='${'audio-' + id}' >
                    <source id='${'audio' + url}' src='${src}' type='audio/mpeg'/>
                  </audio>
                `
                message += `</div>`
                if (type === 'desc') {
                  message = 'Audio'
                }
                break
              case 4:
                try {                  
                  if (attachments && attachments.video && attachments.video.url) {
                    const url = attachments.video.url
                    let src 
                    // let videoControls = "controls='controls'"
                    let videoControls = 'controls'
                    let videoObj = attachments.video
                    let videoHeight = 241* (videoObj.height / videoObj.width)

                    message = '<div class="img-message-row">'
                    if (attachments.loading){
                      src = url
                      message += '<div class="loading"></div>'   
                      videoControls = ''                              
                    } else{
                      src = global.rxu.config.get_static + url
                    }                       
                    message += `
                        <video class ='zchat-mess-video' id='${'video' + objmsg.message_id}' height='${videoHeight}' width='320' ${videoControls} preload='metadata'>
                          <source id='${'video' + url}' src='${src}#t=0.1' />
                          Your browser does not support HTML5 video.
                        </video>
                      `
                    message += '</div>'
                    if (type === 'desc') {
                      message = 'Video'
                    }
                  }
                } catch (e) {
                  console.log(e)
                }
                break
              case 5:
                mess = translate(' created a group')
                message = checkNameUser(rxaget(this.users, objmsg.sender_uin.toString(), {})) + mess
                break
              case 6:
                const userins = []
                try {
                  if (attachments && attachments.added_uins && attachments.added_uins.constructor === Array && attachments.added_uins.length > 0) {
                    for (const uid of attachments.added_uins) {
                      const uname = checkNameUser(rxaget(this.users, uid.toString(), {}))
                      if (uname) {
                        userins.push(uname)
                      }
                    }
                  }
                  else if (attachments.removed_uins && attachments.removed_uins.constructor === Array && attachments.removed_uins.length > 0) {
                    let rmMem = []
                    for (const uid of attachments.removed_uins) {
                      const uname = checkNameUser(rxaget(this.users, uid.toString(), {}))
                      if (uname) {
                        rmMem.push(uname)
                      }
                    }
                    if (rmMem.length > 0) {
                      mess = translate(' removed ')
                      message = checkNameUser(rxaget(this.users, objmsg.sender_uin.toString(), {})) + mess + rmMem.join(', ')
                    }
                  }
                  else if (attachments.pin_message) {
                    mess = attachments.pin_message.type === -1 ? attachments.pin_message.content :
                      (checkNameUser(rxaget(this.users, objmsg.sender_uin.toString(), {})) + (attachments.pin_message.content ? (translate(' pinned') + ": " + attachments.pin_message.content) :
                        translate(' pinned one message')))
                    message = mess
                  }
                  else if (attachments && attachments.updated_group_avatar) {
                    message = (checkNameUser(rxaget(this.users, objmsg.sender_uin.toString(), {}))) + translate(' update avatar')
                  }
                  else if (attachments && attachments.updated_group_name) {
                    message = (checkNameUser(rxaget(this.users, objmsg.sender_uin.toString(), {}))) + translate(' update group name')
                  }
                  else if (attachments && attachments.type === 'update_group' && (attachments.owner_uin || attachments.admin_uins)) {
                    message = (checkNameUser(rxaget(this.users, objmsg.sender_uin.toString(), {}))) + translate(' change group admin to: ')
                      + (checkNameUser(rxaget(this.users, (attachments.owner_uin || attachments.admin_uins[0]).toString(), {})))
                  } else if (attachments && attachments.group_id && attachments.push_all && attachments.push_all.constructor === Array && attachments.push_all.length > 0 ) {
                    try {
                      const arrUserNameAdd = []
                      for (const uid of attachments.push_all) {
                        const unameNew = checkNameUser(rxaget(this.users, uid.toString(), {}))
                        if (unameNew) {
                          arrUserNameAdd.push(unameNew)
                        }
                      }
                      if (arrUserNameAdd.length > 0) {
                        message = arrUserNameAdd.join(', ') + translate(' joined group with link')  
                      }
                    } catch(e1) {}
                  }
                } catch (e) {
                  console.log(e)
                }
                if (userins.length > 0) {
                  mess = translate(' added ')
                  message = checkNameUser(rxaget(this.users, objmsg.sender_uin.toString(), {})) + mess + userins.join(', ')
                }
                break
              case 7:
                mess = translate(' has left the group')
                message = checkNameUser(rxaget(this.users, objmsg.sender_uin.toString(), {})) + mess
                break
              case 8:
                message = '<div class=\'row-reply\'>'
                message += `<div class='sender-reply'> <img class='filter_img_class' alt='icon-reply' src='./images/default/icons/reply-icon.svg'> ${translate('Answer for')} ${checkNameUser(rxaget(this.users, attachments.sender_uin, {})) || ''} </div>`


                if (attachments.type === 8 || attachments.type === 9) {
                  attachments.type = 0
                }
                attachments.rpId = objmsg.message_id
                const attachments_tmp = this.parseMessage(attachments)
                if (attachments_tmp !== '') {

                  let message_reply_content_class = ''
                  let file_reply_content_class = ''
                  if(attachments_tmp.indexOf('img-message-row')!== -1 || attachments_tmp.indexOf('zchat-filemess')!== -1 || attachments_tmp.indexOf('zchat-audiomess')!== -1){                      
                    file_reply_content_class = ' file-reply_content'

                  }
                  if (checkIsOwner(objmsg, this.userid)) {
                    message_reply_content_class = 'message-reply_content_right' + file_reply_content_class
                  } else {
                    message_reply_content_class = 'message-reply_content' + file_reply_content_class
                  }

                  message += `
                      <div class='clearfix message-reply'>
                        <div></div>
                        <div class='${message_reply_content_class}''>
                          ${attachments_tmp}
                        </div>
                      </div>`
                } else {
                  if (checkIsOwner(objmsg, this.userid)) {
                    message += `
                    <div class='message-reply'>
                      <div></div>
                      <div class='message-reply_content_right' >
                        &nbsp;
                      </div>
                    </div>`
                  }
                  else {
                    message += `
                    <div class='message-reply'>
                      <div></div>
                      <div class='message-reply_content'>
                        &nbsp;
                      </div>
                    </div>`
                  }
                }
                message += '</div>'
                if (this.userid.toString() === objmsg.sender_uin.toString()) {
                  message += '<div class=\'zmessage-reply-anwser my_message\'>' + objmsg.message + '<div class=\'zmessage_time\'> '+timeConverter(objmsg.created_at, 'minute')+' </div></div>' || ''
                } else {
                  if (objmsg.message.length === 0) {
                    message += '<div class=\'zmessage-reply-anwser another_message\'><div class=\'another_message_box\'>&#160<div class=\'zmessage_time\'> '+timeConverter(objmsg.created_at, 'minute')+' </div></div></div>' || ''
                  }
                  else {
                    message += '<div class=\'zmessage-reply-anwser another_message\'><div class=\'another_message_box\'>' + this.convertTagName(objmsg.message) + '<div class=\'zmessage_time\'> '+timeConverter(objmsg.created_at, 'minute')+' </div> </div></div>' || ''
                  }

                }
                if (type === 'desc') {
                  message = objmsg.message
                }
                break
              case 9:
                let sender_name
                let sender_name_mess = translate('You')
                sender_name = checkIsOwner(attachments, this.userid) ? sender_name_mess : checkNameUser(rxaget(this.users, objmsg.sender_uin, {}))
                message = '<div class=\'row-reply\'>'
                message += `<div class='sender-reply '> <img class='filter_img_class' alt='icon-reply' src='./images/default/icons/forward-icon.svg'/> ${sender_name || ''} ${translate('forwarded a message')} </div>`  
                
                attachments.rpId= objmsg.message_id
                if (attachments.type === 9 || attachments.type === 8) {
                  attachments.type = 0
                }
                const attachments_forward = this.parseMessage(attachments)
                if (attachments_forward !== '') {

                  let message_reply_content_class = ''
                  let file_reply_content_class = ''
                  if(attachments_forward.indexOf('img-message-row')!== -1 ||attachments_forward.indexOf('zchat-filemess')!== -1 ||attachments_forward.indexOf('zchat-audiomess')!== -1){                      
                    file_reply_content_class = ' file-reply_content'

                  }
                  if (checkIsOwner(objmsg, this.userid)) {
                    message_reply_content_class = 'message-reply_content_right' + file_reply_content_class
                  } else {
                    message_reply_content_class = 'message-reply_content' + file_reply_content_class
                  }

                  message += `
                      <div class='clearfix message-reply'>
                        <div></div>
                        <div class='${message_reply_content_class}''>
                          ${attachments_forward}
                        </div>
                      </div>`
                }
                message += '</div>'
                if (this.userid.toString() === objmsg.sender_uin.toString()) {
                  if (objmsg.message) {
                    message += '<div class=\'zmessage-reply-anwser my_message\'>' + objmsg.message + '<div class=\'zmessage_time\'> '+timeConverter(objmsg.created_at, 'minute')+' </div></div>' || ''  
                  }
                } else {
                  if (objmsg.message.length === 0) {
                    // message += '<div class=\'zmessage-reply-anwser another_message\'><div class=\'another_message_box\'>&nbsp;</div></div>' || ''
                  } else {
                    message += '<div class=\'zmessage-reply-anwser another_message\'><div class=\'another_message_box\'>' + objmsg.message + '<div class=\'zmessage_time\'> '+timeConverter(objmsg.created_at, 'minute')+' </div></div></div>' || ''
                  }


                }
                if (type === 'desc') {
                  message = objmsg.message
                }
                break
              case 10:
                try {
                  if (attachments && attachments.sticker) {
                    const namesticker = attachments.sticker || ''
                    if (namesticker && typeof (namesticker) === 'string') {
                      let indexPath = namesticker.indexOf('_')
                      let stickerStr = indexPath < 0 ? '' : namesticker.slice(0, indexPath)
                      let imgsticker = indexPath < 0 ? '' : namesticker.slice(indexPath + 1)
                      if (indexPath !== -1) {
                        if (this.checkSticker(stickerStr, imgsticker)) {
                          message = `<img src='${this.state.pathImg}/${stickerStr}/${imgsticker}' alt='sticker' class='img-sticker' />`
                        } else {
                          message = `<img src='./images/tabs/default.jpg' alt='sticker' class='img-sticker' />`
                        }

                      }

                      break
                    }
                  }
                } catch (e) {
                  console.log(e)
                }
                if (type === 'desc') {
                  message = 'Sticker'
                }
                break
              case 12:
                let file = (attachments && attachments.file) || objmsg.file
                if (file) {
                  let file_name = rxaget(file, 'file_name', '').toString()
                  let fileNameExt = rxaget(file, 'file_name', '') + '.'+ rxaget(file, 'file_extension', '')
                  file_name = file_name.replace(/[\s]/g, '-')
                  if (attachments.loading) {
                    message = `<div class="img-message-row" id=${objmsg.message_id}>`
                    message += '<div class="loading"></div>'     
                    message += `<div class='zchat-filemess'>
                    <div class='zchat-filename'>${rxaget(file, 'file_name', '')}</div>`
                    message += `<div class='zchat-calltime' style='color:#a6a6a7;'>${formatBytes(rxaget(file, 'size', 0))}</div>`
                    message += `<span class='zchat-docicon'><i class='icon-doc'></i></span></div>`
                    message += '</div>'                           
                  } else {
                    message = `<div class='zchat-filemess'>
                    <div class='zchat-filename'>${rxaget(file, 'file_name', '')}.${rxaget(file, 'file_extension', '')}</div>`
                    message += `<div class='zchat-calltime' style='color:#a6a6a7;'>${formatBytes(rxaget(file, 'size', 0))}</div>`
                    message += `<span class='zchat-docicon' onclick=window.downloadFile('${rxaget(file, 'url', '').toString()}','${fileNameExt}')><i class='icon-doc'></i></span></div>`                    
                  }

                  if (type === 'desc') {
                    message = translate('File')
                  }
                }
                break
              case 14:
                try {
                  if (attachments && attachments.location) {
                    message = `<div> <div></div> <div class="img-message-row" id=${objmsg.message_id}>`
                    let imgHeight = 240
                    
                    if (attachments.location && attachments.location.image_url) {
                      let linkMap = ''
                      if (rxaget(attachments, 'location.lat', 0) && rxaget(attachments, 'location.long', 0)) {
                        linkMap = `https://www.google.com/maps/search/?api=1&query=${rxaget(attachments, 'location.lat', 0)},${rxaget(attachments, 'location.long', 0)}`
                      }
                      message += `<img src='${(global.rxu.config.get_static + attachments.location.image_url)}' alt='' class='img-message' onclick=window.openExternalLink('${linkMap}') />`  
                    }
                    
                    
                    message += '</div></div>'
                    if (!(type === 'lastpin' || attachments.loading))
                      message = message.replace('class="img-message-row"', 'class="img-message-row" style="height:' + imgHeight + 'px;"')
                    if (type === 'desc') {
                      message = translate('Position')
                    }
                  }
                } catch (e) {
                  console.log(e)
                }
                break
              case 15:
                try {
                  if (attachments) {
                    message = `<div> <div></div> <div class="img-message-row" id=${objmsg.message_id}>`
                    let imgHeight = 240
                    
                    if (attachments.image_url) {
                      let linkMap = ''
                      if (rxaget(attachments, 'latitude', 0) && rxaget(attachments, 'longitude', 0)) {
                        linkMap = `https://www.google.com/maps/search/?api=1&query=${rxaget(attachments, 'latitude', 0)},${rxaget(attachments, 'longitude', 0)}`
                      }
                      
                      message += `<img src='${(global.rxu.config.get_static + attachments.image_url)}' alt='' class='img-message' onclick=window.openExternalLink('${linkMap}') />`  
                    }

                    let endTime = (attachments.ended_at) ? Number(attachments.ended_at) : 0
                    let currentTime = Math.floor(Date.now() / 1000)
                    let flagTime = endTime - currentTime

                    if (flagTime > 0) {
                      let strTime = ''
                      let percentTime = 0

                      if (flagTime < 60) {
                        strTime = flagTime+'s'
                      } else if (flagTime >= 60 && flagTime < 3600) {
                        strTime = Math.floor(flagTime/60)+'m'
                      } else if (flagTime > 3600) {
                        strTime = Math.floor(flagTime/3600)+'h'
                      }  
                      
                      if (attachments.duration && !isNaN(attachments.duration) && Number(attachments.duration) > flagTime) {
                        percentTime = parseFloat((100 - ((flagTime / Number(attachments.duration)) * 100)).toFixed(2))
                      }
                      let degCircle = Math.floor((360/100)*percentTime)
                      let rightTime = (percentTime < 50) ? degCircle : 180
                      let clipStr = (percentTime > 50) ? 'clip: rect(auto, auto, auto, auto);' : ''   
                      let leftTime = (percentTime > 50) ? 'transform:rotate('+degCircle+'deg);' : 'display:none'                 

                      message += `<div class='position-message-row'>
                        <span class='position-record-point'></span>
                        <div class='position-desc'>
                          <div>Đang chia sẻ hành trình</div>
                          <div class='zlocation_desc'>Cập nhật liên tục</div>
                        </div>
                        <div class='position-timer-process'>
                          <div class='position-pie-wrapper'>
                            <span class='position-label'>${strTime}</span>
                            <div class='position-pie' style='${clipStr}'>
                              <div class='position-half-circle' style='${leftTime}'></div>
                              <div class='position-half-circle' style='transform:rotate(${rightTime}deg);'></div>
                            </div>
                            <div class='position-shadow'></div>
                          </div>
                        </div>
                      </div>`
                    } else {
                      message += `<div class='position-message-row'>
                        <div>Hành trình trực tiếp</div>
                        <div class='zlocation_desc'>Đã kết thúc</div>
                      </div>`  
                    }
                    
                    message += '</div></div>'
                    if (!(type === 'lastpin' || attachments.loading))
                      message = message.replace('class="img-message-row"', 'class="img-message-row" style="height:' + imgHeight + 'px;"')
                    if (type === 'desc') {
                      message = translate('Current Position')
                    }
                  }
                } catch (e) {
                  console.log(e)
                }
                break

              case 16:
                let stylecallgroup = ''
                if (zget(this.props, 'themeValue') === 'blueColor') {
                  stylecallgroup = '#ebf8ff'
                } else {
                  if (rxconfig.theme === 'galo') {
                    stylecallgroup = '#d4f5f1'
                  } else if (rxconfig.theme === 'default') {
                    stylecallgroup = '#fdf2ea'
                  }
                }
                message = `<div class='zchat-callmess' style='background: ${stylecallgroup};'>
                  <div class='zchat-callname'>${translate('Call Group')}</div>`
                
                  const time = Number(rxaget(attachments, 'stopped_at', 0)) - Number(rxaget(attachments, 'accepted_at', 0))
                  message += `<div class='zchat-calltime'><i class='icon-call-in' style='color:#2fb13e;'></i>${secondToTime(0)}</div>`
                
                message += `<span class='zchat-callicon'><i class='icon-phone'></i></span></div>`
                if (type === 'desc') {
                  mess = translate(' finished')
                  message = call_name + mess
                }
                break

              default:
                let messagetmp = objmsg.message || ''
                if (messagetmp && messagetmp.length < 50) {
                  let resMess = messagetmp.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g)
                  if (resMess && resMess.constructor === Array && resMess.length > 0) {
                    let uniemoji = [...new Set(resMess)]
                    for (let emoji of uniemoji) {
                      let regEmoji = new RegExp(emoji, 'g')
                      messagetmp = messagetmp.replace(regEmoji, '<span>' + emoji + '</span>')
                    }
                  }
                }

                if (messagetmp.indexOf('http') !== -1 && type !== 'pin_model') {
                  try {
                    let urls = messagetmp.match(/(\b(https?|http|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig)
                    if (urls && urls.constructor && urls.length > 0) {
                      let objReview = {
                        uid: objmsg.group_id + '-' + objmsg.message_id,
                        url: urls[0]
                      }
                      let objLink = rxaget(this.props, 'netaLink.data.' + objReview.uid, {})
                      if (objLink && !objLink.uid) {
                        if (window && window.ipcRenderer && !this.checkLink[objReview.uid]) {
                          window.ipcRenderer.send('linkpreview', objReview)
                        }
                        this.checkLink[objReview.uid] = true
                      } else {
                        if (objLink.title !== '') {
                          const strmessagetmp = messagetmp
                          const strtitle = subString(rxaget(objLink, 'title', ''), 80)
                          const strdesc = subString(rxaget(objLink, 'description', ''), 100)

                          messagetmp = `<div class='media_review'>
                            <div>${strmessagetmp}</div>
                            <div class='media_review_box' onclick=window.openExternalLink('${rxaget(objLink, 'url', '')}')>
                              <div class='review_box-title'>${strtitle}</div>
                              <div class='review_box-image'><img src='${objLink.img}' alt='' class='review_box-img' /></div>              
                              <div class='review_box-desc'>${strdesc}</div>
                            </div>
                          </div>`
                        }
                      }

                    }
                  } catch (eurl) {
                    console.log(eurl)
                  }
                }

                message = `<div class='zchat-textmess'>${messagetmp}</div>`

                break
            }
          }
        } else {
          message = ''
        }
      } else {
        if (objmsg.status !== 4) {
          if (objmsg.deleted_uins && objmsg.deleted_uins.constructor === Array && objmsg.deleted_uins.length > 0 && objmsg.deleted_uins.indexOf(userid) !== -1) {
            message = ''
          } else {
            message = objmsg.message || ''
          }
        } else {
          message = ''
        }
      }
      if (message.indexOf('@') !== -1) {
        let userstag = message.match(/(@\d+\b)/ig)
        if (userstag && userstag.constructor === Array && userstag.length > 0) {
          userstag.forEach(o => {
            let useridtmp = o.replace('@', '') || ''
            if (this.users[useridtmp]) {              
              window[useridtmp] = this.users[useridtmp]
              window[this.userid] = rxaget(this.props, 'netaauth.user', {})
              let useridtmp_group = this.getGroupByUserId(useridtmp)
              let partnerIdTmp = ''
              if(useridtmp_group && useridtmp_group.group_id){
                partnerIdTmp = useridtmp_group.group_id
                window[partnerIdTmp] = useridtmp_group  
              }              

              message = objmsg.type === 6 ? message.replace(o, checkNameUser(rxaget(this.users, useridtmp, {})))
                : message.replace(o, `<b onClick="ClickInfoUser('${useridtmp}','${this.userid}','${partnerIdTmp}')">${checkNameUser(rxaget(this.users, useridtmp, {}))}</b>`)
            }
          })
        }
      }
      // let t1 = performance.now();
      // console.log("chat mess parsemess" + '(t1 - t0)' + " milliseconds.")
      return message
    } else {
      return ''
    }
  }

  checkSticker(sticker, imgsticker) {
    let arrTabsDisplay = this.state.arrTabsDisplay
    for (let i = 0; i < arrTabsDisplay.length; i++) {
      if (arrTabsDisplay[i].type === sticker && arrTabsDisplay[i].data.indexOf(imgsticker) === -1) {
        return false
      }
    }
    return true
  }

  convertTagName(message) {
    let userstag = message.match(/(@\d+\b)/ig)
    if (userstag && userstag.constructor === Array && userstag.length > 0) {
      userstag.forEach(o => {
        let useridtmp = o.replace('@', '') || ''
        if (this.users[useridtmp]) {
          let useridtmp_group = this.getGroupByUserId(useridtmp)
          if(useridtmp_group  && useridtmp_group .group_id){
            window[useridtmp_group.group_id] = useridtmp_group  
          }
          
          message = message.replace(o, '<b onClick="ClickInfoUser(' + useridtmp + ',' + this.userid + ',' + useridtmp_group.group_id +')">' + checkNameUser(rxaget(this.users, useridtmp, {})) + '</b>')
        }
      })
    }
    return message
  }

  fetchGroupDetail(group_id) {
    if (group_id && this.token) {
      const api_group_detail = global.rxu.config.get_groups + '/' + group_id
      fetch(api_group_detail, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'TC-Token': this.token,
          Connection: 'Keep-Alive',
          'Accept-Encoding': 'gzip'
        },
        body: null
      })
        .then(res => res.json())
        .then((json) => {
          if (json && json.users && json.users.constructor === Array && json.users.length > 0) {
            // console.log("**********", rxaget(json, 'Group', {}))
            this.props.netaGroupsUpdate(json.Id, rxaget(json, 'Group', {}))

          }
        }).catch(error => console.log(error))
    }
  }

  loadMessages(oldheight) {
    const msg = {
      group_id: this.state.group_id,
      pindex: this.pg_mess,
      psize: 30
    }
    this.checkImage = this.checkImage || {}
    const objDate = this.state.messages || {}
    if (this.state.scroll_mess) {
      if (rxio.connected) {
        rxio.socket.emit('list_message', msg, (data) => {
          if (data && data.last_message_id && data.messages && data.messages.constructor === Array && data.messages.length > 0) {
            const messages = data.messages.sort((a, b) => Number(a.created_at) > Number(b.created_at) ? -1 : 1)
            for (const imess in messages) {
              const omess = messages[imess]
              if ((imess < (messages.length - 2)) && [5, 6, 7].indexOf(omess.type) === -1) {
                const newomess = messages[Number(imess) + 1]
                if (omess.sender_uin && newomess.sender_uin && !newomess.checked_ava) {
                  if ((omess.sender_uin === newomess.sender_uin) && ((Number(newomess.created_at) - Number(omess.created_at)) < 60000000)) {
                    messages[Number(imess) + 1].checked_ava = true
                  }
                }
              }
              if (omess && omess.created_at) {
                const created_at = convertSecondUnix(Number(omess.created_at))
                const date = timesUnixToDate(created_at, Number(omess.created_at))
                if (!objDate[date]) { objDate[date] = { data: [], date: date, datestr: timeConverter(date, 'dateweek') } }
                const findMess = objDate[date].data.find(o => o.message_id === omess.message_id)
                if (!findMess) {
                  objDate[date].data.unshift(omess)
                }
              }
            }
            this.setState({ messages: objDate }, () => {
              const chatListDiv = document.getElementById('zchat_list')
              if (chatListDiv) {
                try {
                  if (chatListDiv.scrollHeight && (chatListDiv.scrollHeight - oldheight) > 0) {
                    chatListDiv.scrollTop = chatListDiv.scrollHeight - oldheight
                  }
                } catch (e) { }
              }
            })
          } else {
            this.setState({ scroll_mess: false })
          }
        })
      }

    }
  }

  chooseGroup(group) {
    let netaMess = this.props.netaMess
    let netaPinMess = this.props.netaPinMess
    const group_id = group.group_id
    let netaGroupsLastMess = global.rxu.json(rxgetLocal('netaGroupsLastMess'), {})
    let last_message_id_tmp
    if (typeof netaGroupsLastMess !== 'undefined' && typeof netaGroupsLastMess.groups !== 'undefined' && typeof netaGroupsLastMess.groups[group.group_id] !== 'undefined') {

      last_message_id_tmp = netaGroupsLastMess.groups[group.group_id].last_message_id

    } else {
      last_message_id_tmp = group.last_message_id
    }


    if (group && group.last_message_id) {
      this.checkReaded(group.group_id, last_message_id_tmp)
    }
    if (group.group_id !== this.state.group_id) {
      this.setState({ group_id: group_id, group: group }, () => {
        if (last_message_id_tmp) {
          this.checkReaded(group.group_id, last_message_id_tmp)
        }
      })
    }

    const msg = {
      group_id: group_id,
      pindex: 0,
      psize: 30
    }
    let objMessTmp = {}
    if (group_id && netaMess && netaMess['data'] && netaMess['data'][group_id.toString()] && netaMess['data'][group_id.toString()]['messages']) {
      for (let keyCreate of Object.keys(netaMess['data'][group_id.toString()]['messages'])) {
        const createdAt = convertSecondUnix(Number(keyCreate))
        const dateTmp = timesUnixToDate(createdAt, Number(keyCreate))
        if (!objMessTmp[dateTmp]) { objMessTmp[dateTmp] = { data: [], date: dateTmp, datestr: timeConverter(dateTmp, 'dateweek') } }
        objMessTmp[dateTmp]['data'].push(netaMess['data'][group_id.toString()]['messages'][keyCreate])
      }
    }
    let objMessPin = {}
    if (group_id && netaPinMess && netaPinMess['data'] && netaPinMess['data'][group_id.toString()] && netaPinMess['data'][group_id.toString()]['messages']) {
      for (let keyCreate of Object.keys(netaPinMess['data'][group_id.toString()]['messages'])) {
        const createdAt = convertSecondUnix(Number(keyCreate))
        const dateTmp = timesUnixToDate(createdAt, Number(keyCreate))
        if (!objMessPin[dateTmp]) { objMessPin[dateTmp] = { data: [], date: dateTmp, datestr: timeConverter(dateTmp, 'dateweek') } }
        objMessPin[dateTmp]['data'].push(netaPinMess['data'][group_id.toString()]['messages'][keyCreate])
      }
    }
    // console.log("netaPinMess",netaPinMess,objMessPin)
    this.checkImage = {}
    this.pg_mess = 0
    // this.setState({ popupGroup: false })
    this.setState({popupGroup: false, group_id: group_id, group: group, messages: objMessTmp, pinedMess: objMessPin, scroll_mess: false, mess: '' }, () => {
      const chatDiv = document.getElementById('zchat_list')
      if (chatDiv) {
        chatDiv.scrollTop = chatDiv.scrollHeight
      }
      if (rxio.connected) {
        const getObjMess = (data, sortField = 'created_at') => {
          const messages = data.messages.sort((a, b) => Number(a[sortField]) < Number(b[sortField]) ? -1 : 1)
          const objDate = {}
          let messArrProps = []
          for (const imess in messages) {
            const omess = messages[imess]
            if ((imess < (messages.length - 2)) && [5, 6, 7].indexOf(omess.type) === -1) {
              const newomess = messages[Number(imess) + 1]
              if (omess.sender_uin && newomess.sender_uin && !newomess.checked_ava) {
                if ((omess.sender_uin === newomess.sender_uin) && ((Number(newomess[sortField]) - Number(omess[sortField])) < 60000000)) {
                  messages[Number(imess) + 1].checked_ava = true
                }
              }
            }
            if (omess && omess[sortField]) {
              const created_at = convertSecondUnix(Number(omess[sortField]))
              const date = timesUnixToDate(created_at, Number(omess[sortField]))
              if (!objDate[date]) { objDate[date] = { data: [], date: date, datestr: timeConverter(date, 'dateweek') } }
              objDate[date].data.push(omess)
              messArrProps.push(omess)
            }
            // }
          }
          return { objDate, messArrProps }
        }
        rxio.socket.emit('list_message', msg, (data) => {
          if (group_id === this.state.group_id) {
            if (data && data.last_message_id && data.messages && data.messages.constructor === Array && data.messages.length > 0) {
              const { objDate, messArrProps } = getObjMess(data)
              this.setState({ messages: objDate, scroll_mess: true }, () => {
                this.props.netaMessAdd(group.group_id, messArrProps)
              })
              const chatDivTmp = document.getElementById('zchat_list')
              if (chatDivTmp) {
                chatDivTmp.scrollTop = chatDivTmp.scrollHeight
              }
            }
          }
        })
        rxio.socket.emit('list_pinned_message', { group_id }, (data) => {
          if (group_id === this.state.group_id) {
            if (data && data.result === 0) {
              const { objDate, messArrProps } = getObjMess(data, "pinned_at")
              this.setState({ pinedMess: objDate }, () => {
                this.props.netaMessPin(group.group_id, messArrProps)
              })
            }
          }
        })
      }

    })
  }

  checkReaded(group_id, mess_id) {

    let groups = this.state.groups
    const msg = {
      group_id: group_id,
      message_id: mess_id,
      message: '',
      status: 3
    }
    if (!groups) {
      try {
        const groupneta = rxaget(this.props, 'netaGroups', {})
        const arrGroups = []
        if (groupneta && groupneta.groups) {
          for (const idgroup of Object.keys(groupneta.groups)) {
            if (groupneta.groups[idgroup]) {
              let ogroup = groupneta.groups[idgroup]
              ogroup['group_fullname'] = checkNameGroup(ogroup, this.users, this.userid)
              if (ogroup && (ogroup.type === 3 || ogroup.type === 5) && !ogroup.avatar_url && rxaget(ogroup, 'occupants_uins', []).length === 2) {
                const arrUins = rxaget(ogroup, 'occupants_uins', [])
                ogroup['partner_id'] = (arrUins[0].toString() === this.userid.toString()) ? arrUins[1] : arrUins[0]
              }
              arrGroups.push(ogroup)
            }
          }
        }

        groups = sortArrObj(arrGroups, 'last_message.created_at', 'desc').slice(0, 20)
      } catch (e) { console.log(e) }
    }

    if (rxio.connected) {
      // if (groups && groups[group_id]) {
      //   let objGroup = groups[group_id]
      //   let cntNoti = rxaget(objGroup, 'count_unread', 0) + rxaget(objGroup, 'unread_cnt', 0)
      //   if (cntNoti > 0) {
          rxio.socket.emit('update_message', msg, (data) => {
            if (groups && groups.constructor === Array && groups.length > 0) {
              groups.forEach(group => {
                if (group.group_id === group_id) {
                  group.unread_cnt = 0
                  group.count_unread = 0
                  group.last_message_id = group.last_message.message_id
                  this.props.netaGroupsUpdate(group.group_id, group, true)
                }
              })
              this.setState(groups)
            }
          })    
      //   }
      // }      
    }
  }

  changeMessage(e) {
    const group_id = this.state.group_id
    if (this.userid && group_id) {
      const me_typing = this.state.me_typing
      if (e.currentTarget.textContent) {
        if (me_typing === false) {
          rxio.sendGroupEvent(group_id, this.userid, 9)
        }
        const value = e.currentTarget.textContent
        this.setState({ mess: value, me_typing: true }, () => {
          setTimeout(() => {
            if ((value === this.state.mess) && me_typing) {
              rxio.sendGroupEvent(group_id, this.userid, 10)
              this.setState({ me_typing: false })
            }
          }, 2000)
        })
      }
    }
  }

  checkTypeDelMess() {
    let result = 0
    let messSelectedType = rxaget(this.state, 'mess_selected.type', '')
    let exclude = [1,/* 5, 6, 7*/,10]
    if (rxaget(this.state, 'mess_selected.sender_uin', '').toString() === this.userid.toString()) {
      if (exclude.indexOf(messSelectedType) !== -1 ) {
        result = 1
      } else {
        if([5,6,7].indexOf(messSelectedType)  !== -1){
          result = 4        
        }else{
          result = 3
        }
      }
    }
    if (rxaget(this.state, 'mess_selected.status', 0) === 4) {
      result = 2
    }
    if (rxaget(this.state, 'mess_selected.deleted_uins', []).indexOf(this.userid.toString()) !== -1) {
      result = 2
    }
    if (result === 0 && rxaget(this.state, 'mess_selected.message', '') !== '') {
      result = 3
    }
    if (result === 0 && rxaget(this.state, 'mess_selected.message', '') === '') {
      if (exclude.indexOf(messSelectedType) >= 0) {
        result = 1
      } else {
        if([5,6,7].indexOf(messSelectedType)  !== -1){
          result = 4        
        }else{
          result = 3
        }
      }
    }

    // if (result === 3 && messSelectedType === 3) {
    //   result = 4
    // }
    return result
  }

  reloadStateWhenRepMess(data) {
    // this.setState({ type_option: 0, mess_selected: {}, mess_id: '' }, () => {
    //   // this.handleMessage(data.message, true)
    // })
  }

  resetSelectedMess() {
    this.setState({ type_option: 0, mess_selected: {}, mess_id: '' })
  }

  forwardAudio(group_id,audioAttachments){
    const arrUsers = this.users
    const user = rxaget(this.props, 'netaauth.user', {})
    const objUser = arrUsers[user.id.toString()]
    
    let msg = {}
    let audioAttachmentsTmp = audioAttachments
    let arrImg =[]

    audioAttachmentsTmp = audioAttachmentsTmp.replaceAll('\\"', '"')
    audioAttachmentsTmp = JSON.parse(audioAttachmentsTmp)    
    arrImg[0]=audioAttachmentsTmp.audio   

    if (arrImg && arrImg.constructor === Array && arrImg.length > 0 ) {
      msg = {
        group_id: Number(group_id),
        type: 3,
        version: 1,
        nonce: (Math.floor(Date.now()) * 1000).toString(),
        sender_name: rxaget(objUser, 'full_name', ''),
        attachments: JSON.stringify({ audio: arrImg[0] }).replace(/"/g, '\\"')
      }
    }

    if (msg && msg.group_id) {
      if (rxio.connected) {
        rxio.socket.emit('create_message', msg, (data) => {
          if (data && data.message) {
            try {
              let objMedia = {
                group_id: Number(group_id),
                media_type: msg.type,
                message_id: Number(data.message.message_id),
                msg_create_at: Number(data.message.created_at),
                url: rxaget(arrImg, '0.url', '')
              }

              this.props.netaMediaOneAdd(Number(group_id), objMedia)
            } catch(e) {
              console.log(e)
            }

            this.handleMessage(data.message, true)
          }
        })  
      }
      
    }
  }

  chooseGroupForward(groupfw) {
    let isForwardAudio = this.state.isForwardAudio
    let mess_selected = {}
    if(isForwardAudio === true){
      let audioAttachments = this.state.mess_selected.attachments
      this.forwardAudio(groupfw.group_id, audioAttachments)
      isForwardAudio = false
    }else{
      mess_selected = this.state.mess_selected
      mess_selected['groupfw'] = groupfw.group_id  
    }
    
    this.setState({ mess_selected: mess_selected, popupGroup: false, type_option: 2, isForwardAudio:isForwardAudio })
  }

  onClickAva(_id) {
    this.setState({ tabmore: !this.state.tabmore, id_userclick: _id })
  }

  onClose() {
    this.setState({ tabmore: false })
  }

  showGalleryCurrentUser({ index, type }) {
    this.setState({ checkgallery: true, galleryPosition: Number(index), type: type })
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
    this.setState({ tabActive: type, arrData: arrData })
  }

  onClickInfoUser(userInfo) {
    let userOwner = rxaget(this.props, 'netaauth.user', {})    
    let partner_id = userInfo.id
    let userClick_group =this.getGroupByUserId(partner_id)
    this.setState({ 
      infoUserScreen: true, 
      userInfo: userInfo,
      userClick_group:userClick_group
    })
  }

  onClickNameUser(userId) {
    let userInfo = rxaget(this.users, userId, {})
    let userOwner = rxaget(this.props, 'netaauth.user', {})    
    let partner_id = userInfo.id
    let userClick_group =this.getGroupByUserId(partner_id)
    this.setState({ 
      infoUserScreen: true, 
      userInfo: userInfo,
      userClick_group:userClick_group
    })
  }

  closePopupInfoUser() {
    this.setState({ 
      infoUserScreen: false 
    })
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

  scrollDownChatList(e) {
    const chatListDiv = document.getElementById('zchat_list')
    if (chatListDiv) {
      chatListDiv.scrollTop = chatListDiv.scrollHeight
    }
  }

  render() {
    // console.log('Render Messages')
    return (
      <Fragment>
        {this.renderComponent()}
      </Fragment>)
  }
}
const mapStateToProps = (state, ownProps) => ({
  themeValue: state.themeValue,
  langValue: state.langValue,
  rxgroup: state.rxgroup,
  user: state.user,
  netaauth: state.netaauth,
  netaMess: state.netaMess,
  netaPinMess: state.netaPinMess,
  tabmore: state.tabmore,
  group_id: state.group_id,
  netaGroups: state.netaGroups,
  netaLink: state.netaLink,
  loadmess: state.loadmess
})
const mapDispatchToProps = {
  netaBlobsUpdate,
  netaMessAdd,
  netaMessPin,
  chooseGroupAction,
  netaUserUpdate,
  netaGroupsUpdate,
  netaGroupsUpdateLastMess,
  changeStatusTabmore,
  netaLinkAdd,
  netaGroupsRemove,
  updateUserStatus,
  netaMediaOneAdd,
  userClickUpdate
}
const MessagesWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)
export default MessagesWrapped