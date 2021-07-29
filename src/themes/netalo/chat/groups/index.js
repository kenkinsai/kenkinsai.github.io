/*eslint-disable no-undef*/
/* global translate */

import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'

import * as Jsx from './index.jsx'

const RxComponent = global.rootRequire('components/shares/rxComponent').default

const { rxaget, rxChangeSlug, sortArrObj } = global.rootRequire('classes/ulti')

const { netaGroupsUpdate, netaGroupsUpdateArr, chooseGroupAction, userAdd, userAddArr, contactAdd, netaBlobsUpdate, 
      changeStatusTabmore, netaGroupsRemove, changeStatusLoadMess, netaAuthSettingUpdate, 
      netaGroupsPinUpdate, clearRxContact, netaGroupsUpdateUnpin, clickPopup, netaMessGet, netaMessAdd, netaUserSetGroupid, netaMessRemove } = global.rootRequire('redux')

const { fetchContact, checkNameGroup, checkNameUser } = global.rootRequire('classes/chat')

const { rxgetLocal } = global.rootRequire('classes/request')
const rxio = global.rootRequire('classes/socket').default

class Component_ extends RxComponent {
  constructor(props, context) {
    super(props, context, Jsx)
    this.state = {
      groups: [],      
      groupsDisplay:[],
      groups_origin: [],
      uids: rxaget(this.props, 'user.ids', []) || [],
      pg_group: 0,
      scroll_group: true,
      group_id: rxaget(this.props, 'rxgroup.groupid', ''),
      // group: rxaget(this.props, 'rxgroup', {}),
      group: rxaget(this.props, 'rxgroup.group', {}),
      rxgroup: rxaget(this.props, 'rxgroup', {}),
      // modalAddFriend: rxaget(this.props, 'tabmore', false),
      // tabmore : rxaget(this.props, 'tabmore', false),      
      statusInput: '',
      groupsTemp: [],
      groupsLocalStore: [],
      numGroupTeamChat: 0,
      flagCreateGroup: false,
      isShowPopupCreateGroup: false,
      isShowPopup_ManageGroup: false,
      displayGroupList: true,
      searchValue: '',
      groupsSearchArr: [],
      searchNchatValue: '',
      statusSeachNchatValue: false,
      groupsNChat: [],
      groupsNChatCreate: [],
      groupsChat: [],
      arrGroupsChatFull: [],
      groupsNChatOrigin: [],
      groupsNChatChecked: [],
      xPercent: 0,
      slickTrackLength: 0,
      clickCreateGroupBtn: false,
      themeColor: rxaget(this.props, 'themeValue'),
      admin_uins_index: rxaget(this.props, 'rxgroup.group.admin_uins', {}).length - 1,
      displayLeaveGroupScreen: false,
      displaySelectManagerScreen: false,
      lg_chooseLeader_groupsTemp: [],
      groupChooseItem_selected: {},
      notificationStatus: global.rxu.json(rxgetLocal('netaNotificationStatus'), {}) || {},
      groupsPin: {},
      flagRightMouse: false,
      groupRightMouse: {},
      groupsSearchBoxClickStatus: false,
      checkSearchValue_IsNumeber: false,
      position: 0,
      leaderMemberChecked: '',
      chooseContactAction: false,
    }
    this.compareContact = this.compareContact.bind(this)
    this.users = rxaget(this.props, 'user.users', {}) || {}
    this.token = rxaget(this.props, 'netaauth.user.token', '')
    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    this.netaContact = rxaget(this.props, 'netaContact', {})
    this.netaGroups = rxaget(this.props, 'netaGroups', {})
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

      let groupsTmp = sortArrObj(arrGroups, 'last_message.created_at', 'desc')//.slice(0, 20)
      let arrGroupsPin = groupsTmp.sort((a, b) => (this.checkGroupsPinned_uins(a.pinned_uins) === true && this.checkGroupsPinned_uins(b.pinned_uins) === false) ? -1 : ((this.checkGroupsPinned_uins(b.pinned_uins) === true && this.checkGroupsPinned_uins(a.pinned_uins) === false) ? 1 : 0))
      this.state.groups = arrGroupsPin
      this.state.groupsDisplay = arrGroupsPin.slice(0, 20)
      this.state.groups_origin = this.state.groups

    } catch (e) { console.log(e) }

    const contactsUsers = []
    if (this.users && Object.keys(this.users).length > 0) {
      for (const userid of Object.keys(this.users)) {
        if (userid !== this.userid) {
          contactsUsers.push(this.users[userid])
        }
      }

      this.state.groupsNChat = this.state.groupsNChatOrigin = contactsUsers
      this.state.groupsNChatCreate = this.state.groupsNChatOrigin = contactsUsers
      this.state.groupsChat = contactsUsers
      this.state.slickTrackLength = contactsUsers.length * 63
    }

    this.checkImage = {}
    const timenow = Math.floor(Date.now() / 1000)
    let checkImageObj = rxaget(this.props, 'netaBlobs.data', {}) || {}
    if (checkImageObj && typeof (checkImageObj) === "object" && Object.keys(checkImageObj).length > 0) {
      for (let keyImg of Object.keys(checkImageObj)) {
        let created_at = rxaget(checkImageObj[keyImg], 'created_at', 0)
        if ((timenow - created_at) < 43200) {
          this.checkImage[keyImg] = checkImageObj[keyImg]
        }
      }
    }
    this.fetchGroups = this.fetchGroups.bind(this)
    this.reSortGroup = this.reSortGroup.bind(this)
    let netaAuthSetting = JSON.parse(localStorage.getItem('netaAuthSetting') || `{"groups":{}}`)
    if (this.state.group.group_id && netaAuthSetting.groups[Number(this.state.group.group_id)]
      && netaAuthSetting.groups[Number(this.state.group.group_id)].disableNoti) {
      this.state.disableNoti = true
    } else this.state.disableNoti = false

    this.fetchGroupDetail(this.state.group_id)
    this.scrollGroupsChat = this.scrollGroupsChat.bind(this);
  }

  componentDidMount() {

    document.addEventListener("click", this.mouseClickFunction, true);

    // document.addEventListener('scroll', this.scrollGroupsChat, true);
    // this.actionPer5s()

    let occupants_uins = this.state.group.occupants_uins
    this.loadGroupsTemp(occupants_uins, this.users)
    this.reSortGroup(this.props.netaGroups)
    if (this.token && this.userid) {
      if (!rxio.connected && !rxio.init_connected) {
        rxio.login(this.token, this.userid, (data) => {
          this.fetchGroups()

          rxio.getWaitGroup((data) => {
            this.fetchGroups()
          })
        })
      } else {
        this.loadHandleSocket()
      }
    }

    if (window && window.ipcRenderer) {
      const groupneta = rxaget(this.props, 'netaGroups', {})
      window.ipcRenderer.on('click_notification', (event, args) => {
        if (args && args.group_id && rxaget(groupneta, 'groups.' + args.group_id, null)) {
          let groupNoti = rxaget(groupneta, 'groups.' + args.group_id, {})
          this.chooseGroup(groupNoti)
        }
      })

      window.ipcRenderer.on('reload_page', (event, args) => {
        if (this.token && this.userid) {
          this.chooseGroup(this.state.group)
          this.setState({ pg_group: 0 }, () => {
            try {
              this.fetchGroups()
              this.fetchRegisteredUsers()
              let that = this
              fetchContact({ netaContact: rxaget(that.props, 'netaContact.data', {}), token: that.token }, (newContacts) => {
                that.props.contactAdd(newContacts)
              })
              this.fetchCacheImg()
              rxio.getWaitGroup((data) => {
                this.fetchGroups()
              })
            } catch (error) { }
          })
        }
      })

      window.ipcRenderer.on('open_deeplink', (event, deepLinkUrl) => {
        if (deepLinkUrl) {
          try {
            let arrRegexStr = deepLinkUrl.match(/\?token=([a-z0-9\-]+)\&?/i)
            if (arrRegexStr && arrRegexStr.length === 2 && arrRegexStr[1]) {
              let tokenStr = arrRegexStr[1]
              rxio.joinLink(tokenStr, (data) => {
                if (data && data.result === 1) {
                  alert(translate('Join Group Failed'))
                }
              })           
            } else {
              alert(translate('Join Group Failed'))
            }
          } catch (e) {
            alert(translate('Join Group Failed'))
          }
        } else {
          alert(translate('Join Group Failed'))
        }
      })
    }

    this.fetchRegisteredUsers()
    let that = this
    fetchContact({ netaContact: rxaget(that.props, 'netaContact.data', {}), token: that.token }, (newContacts) => {
      that.props.contactAdd(newContacts)    })
    this.fetchCacheImg()
  }

  componentWillUnmount() {

    clearInterval(this.interval);
    document.removeEventListener("click", this.mouseClickFunction, false);
    // document.removeEventListener('scroll', this.scrollGroupsChat, false);
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

  groupsSearchBoxClick(){
    this.setState({
      groupsSearchBoxClickStatus: true,
    })
  }

  getSearchBoxvalue(clickStatus, searchValue) {
    this.setState({
      groupsSearchBoxClickStatus: clickStatus,
      searchValue: searchValue,
    })
  }

  reSortGroup(netaGroups) {
    this.netaGroups = JSON.parse(JSON.stringify(netaGroups))
    if (netaGroups.groups) {
      let groupsTmp = (netaGroups && netaGroups.groups) ? JSON.parse(JSON.stringify(netaGroups.groups)) : {}
      let arrGroupsTmp = []

      Object.keys(groupsTmp).forEach(keygroup => {
        if (groupsTmp[keygroup].last_message) {
          try {
            groupsTmp[keygroup].timestamp = (groupsTmp[keygroup].last_message.created_at
              && Number(groupsTmp[keygroup].last_message.created_at)) || new Date().getTime() * 1000
            arrGroupsTmp.push(groupsTmp[keygroup])
          } catch (error) { }
        }
        if (typeof groupsTmp[keygroup].unread_cnt === 'undefined') {
          groupsTmp[keygroup].unread_cnt = 1
        }
      })

      let arrGroups = arrGroupsTmp.sort((a, b) => (a.timestamp > b.timestamp) ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0))
      let arrGroupsPin = arrGroups.sort((a, b) => (this.checkGroupsPinned_uins(a.pinned_uins) === true && this.checkGroupsPinned_uins(b.pinned_uins) === false) ? -1 : ((this.checkGroupsPinned_uins(b.pinned_uins) === true && this.checkGroupsPinned_uins(a.pinned_uins) === false) ? 1 : 0))

      arrGroups = arrGroupsPin
      arrGroups.forEach(ogroup => {
        ogroup.group_fullname = checkNameGroup(ogroup, this.users, this.userid)
        if (ogroup && (ogroup.type === 3 || ogroup.type === 5) && !ogroup.avatar_url && rxaget(ogroup, 'occupants_uins', []).length === 2) {
          const arrUins = rxaget(ogroup, 'occupants_uins', [])
          ogroup['partner_id'] = (arrUins[0].toString() === this.userid.toString()) ? arrUins[1] : arrUins[0]
          if(ogroup.type === 3){
            this.props.netaUserSetGroupid(ogroup.partner_id,ogroup.group_id)  
          }          
        }
      })
      let index = this.state.groupsDisplay.length
      if(index === 0){
        index = 20
      }
      let groupsDisplay = arrGroups.slice(0, index)
      this.setState({ groups: arrGroups, groups_origin: arrGroups ,groupsDisplay:groupsDisplay})
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // frst get contact 
    if (nextProps.user && nextProps.user.ids && nextProps.user.ids.length !== Object.keys(this.state.groupsNChat).length) {
      let users = rxaget(nextProps, 'user.users', {}) || {}
      this.users = users
      if (users && Object.keys(users).length > 0) {
        const contactsUsers = []
        let arrGroups = JSON.parse(JSON.stringify(this.state.groups))

        arrGroups.forEach(ogroup => {
          ogroup.group_fullname = checkNameGroup(ogroup, this.users, this.userid)
        })
        for (const userid of Object.keys(users)) {
          if (userid !== this.userid) {
            contactsUsers.push(users[userid])
          }
        }

        let index = this.state.groupsDisplay.length
        if(index === 0){
          index = 20
        }
        let groupsDisplay = arrGroups.slice(0, index)
        this.setState({
          groupsNChat: contactsUsers,
          groupsNChatOrigin: contactsUsers,
          groupsChat: contactsUsers,
          slickTrackLength: contactsUsers.length * 63,
          groups: arrGroups,
          groupsDisplay:groupsDisplay,
          groups_origin: arrGroups,
        })
        // console.log("contactsUsers", contactsUsers.length)
      }
    }
    if (nextProps.rxgroup.groupid !== this.state.group_id) {
      let groupidtmp = Number(rxaget(nextProps, 'rxgroup.groupid', 0))
      if (nextProps.netaGroups && nextProps.netaGroups.groups && nextProps.netaGroups.groups[groupidtmp]) {
        try {
          nextProps.netaGroups.groups[groupidtmp]['group_fullname'] = rxaget(nextProps, 'rxgroup.group.name', '')
        } catch (e1) { }
      }
      if (nextProps.rxgroup && nextProps.rxgroup.group && nextProps.rxgroup.groupid !== this.state.group_id) {
        let occupants_uins = nextProps.rxgroup.group.occupants_uins || []
        this.loadGroupsTemp(occupants_uins, this.users)
        this.fetchGroupDetail(nextProps.rxgroup.groupid)
      }
      this.setState({
        group_id: nextProps.rxgroup.groupid,
        group: rxaget(nextProps, 'rxgroup.group', {}) //neu khong .group, cai group nay se la rxgroup, ma rxgroup la obj 
      })
    }

    if (nextProps.netaGroups && nextProps.netaGroups.groups &&      
      nextProps.netaGroups.status !== this.netaGroups.status) {
      this.reSortGroup(nextProps.netaGroups)
    }

    if (this.netaContact.status !== nextProps.netaContact.status) {
      let groupstmp = this.state.groups
      groupstmp.forEach(ogroup => {
        ogroup.group_fullname = checkNameGroup(ogroup, this.users, this.userid)
        if (ogroup && (ogroup.type === 3 || ogroup.type === 5) && !ogroup.avatar_url && rxaget(ogroup, 'occupants_uins', []).length === 2) {
          const arrUins = rxaget(ogroup, 'occupants_uins', [])
          ogroup['partner_id'] = (arrUins[0].toString() === this.userid.toString()) ? arrUins[1] : arrUins[0]
        }
      })
      this.netaContact = this.props.netaContact   
      let index = this.state.groupsDisplay.length 
      if(index === 0){
        index = 20
      }
      let groupsDisplay = groupstmp.slice(0, index) 
      this.setState({ groups_origin: groupstmp, groups: groupstmp, groupsDisplay:groupsDisplay })
    }
  }

  scrollGroupsChat(event) {
    const container = document.getElementById('zgroup_list')
    if(container && (container.scrollTop + container.offsetHeight >= container.scrollHeight - 360)){
      let groupsDisplay = this.state.groupsDisplay      
      let index = groupsDisplay.length
      let groupsArr = this.state.groups.slice(index,index + 20)
      groupsDisplay= [...groupsDisplay, ...groupsArr]
      this.setState({groupsDisplay:groupsDisplay})      
    }
  }

  checkGroupsPinned_uins(pinned_uins) {
    let flag = false
    if (pinned_uins && pinned_uins.constructor === Array && pinned_uins.indexOf(String(this.userid)) !== -1) {
      flag = true
    }
    return flag
  }

  loadHandleSocket() {
    rxio.getWaitConnect((data) => {
      if (data) {
        this.fetchGroups()
        rxio.getWaitGroup((data) => {
          this.fetchGroups()
        })
        rxio.getUpdateMessage((data) => {
          try {
            if (typeof (window) !== 'undefined') {
              window.ipcRenderer.send('remove_badge', data.group_id)
            }
          } catch (e) { }
        })
      } else {
        setTimeout(() => {
          this.loadHandleSocket()
        }, 300)
      }
    })
  }

  async fetchRegisteredUsers() {
    if (this.token) {
      const api_registered_users = global.rxu.config.registered_users
      const netaUserReg = rxaget(this.props, 'user.users', {})

      const max_size = 100
      let arrUser = []

      for (let i = 0; i < 100; i++) {
        let checkBreak = true
        let offset = i
        const params = {
          offset: offset,
          limit: max_size,
          compact: 0
        }
        let tempBody = ''
        for (const property in params) {
          if (params.hasOwnProperty(property)) {
            tempBody += `${property}=${params[property]}&`
          }
        }

        let res = await fetch(api_registered_users + '?' + tempBody, { method: 'GET', headers: { Accept: 'application/json', 'TC-Token': this.token, Connection: 'Keep-Alive', 'Accept-Encoding': 'gzip' }, body: null })
        try {
          let json = await res.json()
          if (res && [404, 401].indexOf(res.status) !== -1) {
            break
          }

          if (json && json.items && json.items.constructor === Array && json.items.length > 0) {
            for (const itemreg of json.items) {
              const objreg = {
                id: rxaget(itemreg, 'Id', ''),
                email: rxaget(itemreg, 'email', ''),
                phone: rxaget(itemreg, 'phone', ''),
                full_name: rxaget(itemreg, 'full_name', ''),
                profile_url: rxaget(itemreg, 'profile_url', ''),
                name_contact: rxaget(itemreg, 'name_contact', '')
              }

              arrUser.push(objreg)

              if (typeof (netaUserReg) === 'object' && typeof (netaUserReg[objreg.id]) === 'undefined') {
                if (checkBreak === true) {
                  checkBreak = false
                }
              }
            }

            if (json.items.length < max_size) { break }
            if (checkBreak === true) { break }
          }

        } catch (e) {
          break
        }

        await new Promise(r => setTimeout(r, 1000));
      }

      if (arrUser.length > 0) { this.props.userAddArr(arrUser) }
    }
  }

  fetchCacheImg() {
    const images = document.getElementsByClassName('ava-usergroup')
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
  }

  // onClickAddFriend() {
  //   const modalAddFriend = this.state.modalAddFriend
  //   this.setState({
  //     modalAddFriend: !modalAddFriend
  //   })
  // }

  createNewChatGroup() {
    let tabmore = rxaget(this.props, 'tabmore', false)
    if( tabmore.data === true){
      tabmore.data = false
      this.setState({ flagShowDropDown: false }, () => {
        this.props.changeStatusTabmore('false')
        const user = rxaget(this.props, 'netaauth.user', {})
        this.props.clickPopup('create_group', { data: { groups: this.state.groupsNChatOrigin, user: user } }, (data) => {
          this.fetchGroups()
        })
      })
    }else{
      this.setState({ flagShowDropDown: false }, () => {
        const user = rxaget(this.props, 'netaauth.user', {})
        this.props.clickPopup('create_group', { data: { groups: this.state.groupsNChatOrigin, user: user } }, (data) => {
          this.fetchGroups()
        })
      })
    }
  }

  fetchGroupDetail(group_id, resolve, reject) {
    if (group_id && this.token) {
      let that = this
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
      }).then(res => res.json()).then((json) => {
        let objUsers = []
        if (json && json.users && json.users.constructor === Array && json.users.length > 0) {
          for (const user of json.users) {
            objUsers.push({ id: user.Id, ...user })
          }
        }
        if (json && json.removed_users && json.removed_users.constructor === Array && json.removed_users.length > 0) {
          for (const user of json.removed_users) {
            objUsers.push({ id: user.Id, ...user })
          }
        }
        if (that.state.group_id && json.Group && json.Group.group_id.toString() === group_id.toString()) {
          let index = that.state.groups.findIndex(o => o.group_id.toString() === that.state.group_id.toString())
          if (!objUsers.length) {
            that.props.netaGroupsRemove(that.state.group_id)
            index = index === 0 ? 1 : 0
            that.props.chooseGroupAction(that.state.groups[index])
          }
          if (that.state.group && that.state.group.type === 3) {
            let old_blocked_uins = JSON.parse(JSON.stringify(that.state.group.blocked_uins || []))
            let blocked_uins = (json.Group.blocked_uins || []).map(i => i.toString())
            if (JSON.stringify(blocked_uins) !== JSON.stringify(old_blocked_uins)) {
              that.state.groups[index].blocked_uins = blocked_uins
              that.props.chooseGroupAction(that.state.groups[index])
            }
          }
        }
        resolve ? resolve(objUsers) : that.props.userAddArr(objUsers)
      }).catch(error => {
        console.log("fetchGroupDetail error:", error)
        resolve && reject(error)
      })
    }
  }

  fetchGroups() {
    const objCount = {}
    if (this.userid) {
      var psize = 20
      let that = this
      excefletch(this.state.pg_group)

      function excefletch(pageIndex) {
        if (rxio.connected) {
          const msg = {
            uin: that.userid,
            sort_by: 1,
            pindex: pageIndex,
            psize: psize
          }
          rxio.socket.emit('list_group', msg, (data) => {
            if (data && data.groups && data.groups.constructor === Array && data.groups.length > 0) {
              var arrGroups = [...that.state.groups], newGroup = []
              const groups = JSON.parse(JSON.stringify(data.groups))
              for (const ogroup of groups) {
                if (ogroup && ogroup.last_message) {
                  ogroup.timestamp = (ogroup.last_message.created_at
                    && Number(ogroup.last_message.created_at)) || new Date().getTime() * 1000
                  ogroup.group_name = checkNameGroup(ogroup, that.users, that.userid)
                  const findgroup = arrGroups.findIndex(o => o.group_id && ogroup.group_id &&
                    (o.group_id.toString() === ogroup.group_id.toString()))
                  if (findgroup !== -1) {
                    arrGroups.splice(findgroup, 1)
                    arrGroups.push(ogroup)
                  } else {
                    arrGroups.push(ogroup)
                  }
                  newGroup.push(ogroup.group_id)
                  if (rxaget(ogroup, 'unread_cnt', 0) > 0) {
                    if (!objCount[ogroup.group_id]) {
                      objCount[ogroup.group_id] = 1
                    }
                  }
                }
              }
              let pa = [], objUsers = []
              for (const group_id of newGroup) {
                if (/*!msg.pindex &&*/ !(that.props.netaGroups && that.props.netaGroups.groups && that.props.netaGroups.groups[Number(group_id)])) {
                  pa.push(new Promise((resolve, reject) => {
                    that.fetchGroupDetail(group_id, resolve, reject)
                  }))
                }
              }
              Promise.all(pa).then(values => {
                values.map(i => {
                  i.map(u => {
                    objUsers.push(u)
                  })
                })
                that.props.userAddArr(objUsers)
              }, reason => { console.log(reason) });
              arrGroups = arrGroups.sort((a, b) => (a.timestamp > b.timestamp) ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0))
              arrGroups = arrGroups.sort((a, b) => (that.checkGroupsPinned_uins(a.pinned_uins) === true && that.checkGroupsPinned_uins(b.pinned_uins) === false) ? -1 : ((that.checkGroupsPinned_uins(b.pinned_uins) === true && that.checkGroupsPinned_uins(a.pinned_uins) === false) ? 1 : 0))
              let isStop = !(data.groups.length >= psize)
              arrGroups.map((eg, i) => {
                if (eg.occupants_uins && eg.occupants_uins.indexOf(that.userid.toString()) === -1) {
                  eg.isDelete = true
                }
              })

              that.props.netaGroupsUpdateArr(arrGroups, isStop)

              that.setState({
                pindex: pageIndex + 1,
              }, () => {
                if (that.state.group_id === '') {
                  that.chooseGroup(data.groups[0])
                }
                if (!(that.props.netaGroups.init || isStop)) {
                  setTimeout(function () {
                    // console.log("excefletch", that.props.netaGroups.init, isStop ,pageIndex,data.groups.length)
                    excefletch(pageIndex + 1)
                  }, 1000);
                }
                if (msg.pindex === 0 && objCount && Object.keys(objCount).length >= 0 && typeof (window) !== 'undefined') {
                  try {
                    window.ipcRenderer.send('count_badge', objCount)
                  } catch (e) { }
                }
              })
            }
          })
        }
      }
    }
  }

  checkGroupSeen(group) {
    const unread = Number(rxaget(group, 'unread_cnt', 0))
    if (unread > 0) {
      return true
    } else {
      if (rxaget(group, 'count_unread', 0) > 0) {
        return true
      } else {
        return false
      }
    }
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

  searchBox_chooseGroup(group) {
   
    this.chooseGroup(group)
    let timeSeach = Date.now()
    // this.props.updateRecentSearchGroups(group.group_id, group, timeSeach)
  }

  chooseGroup(group) {
    const group_id = group.group_id
    let netaGroupsLastMess = global.rxu.json(rxgetLocal('netaGroupsLastMess'), {})
    let last_message_id_tmp
    if(group.group_id !== this.state.group_id){
      if (typeof netaGroupsLastMess !== 'undefined' && typeof netaGroupsLastMess.groups !== 'undefined' && typeof netaGroupsLastMess.groups[group.group_id] !== 'undefined') {

        last_message_id_tmp = netaGroupsLastMess.groups[group.group_id].last_message_id

      } else {
        last_message_id_tmp = group.last_message_id
      }
      if (group && group.last_message_id) {
        this.checkReaded(group.group_id, last_message_id_tmp)
      }
      if (group.group_id) {
        if (group.type === 3 && typeof (group.partner_id) === 'undefined') {
          for (let i = 0; i < group.occupants_uins.length; i++) {
            if (group.occupants_uins[i] !== String(this.userid)) {
              group.partner_id = group.occupants_uins[i]
            }
          }
        }
        this.props.chooseGroupAction(group)

        this.setState({
          group_id: group_id,
          group: group
        }, () => {
          if (last_message_id_tmp) {
            this.checkReaded(group.group_id, last_message_id_tmp)
          }
        })

        try {
          if (typeof (window) !== 'undefined') {
            window.ipcRenderer.send('remove_badge', group.group_id)
          }
        } catch (e) { }
      }
      
    }
  }

  chooseContact() {
    this.setState({ chooseContactAction: true })
  }
  
  disableDrop = event => {
    event.preventDefault();
  }

  checkReaded(group_id, mess_id) {
    const groups = this.state.groups
    const msg = {
      group_id: group_id,
      message_id: mess_id,
      message: '',
      status: 3
    }

    let findGroup = groups.find(o => o.group_id === group_id.toString())
    if (findGroup && findGroup.last_message_id && findGroup.last_message_id.toString() !== mess_id.toString()) {
      msg['message_id'] = findGroup.last_message_id
    }

    if (rxio.connected) {
      let objGroup = groups.find(g => g.group_id === group_id)
      if (objGroup) {
        let cntNoti = rxaget(objGroup, 'count_unread', 0) + rxaget(objGroup, 'unread_cnt', 0)
        if (cntNoti > 0) {
          rxio.socket.emit('update_message', msg, (data) => {
            if (groups && groups.constructor === Array && groups.length > 0) {
              let checkchange = false
              groups.forEach(group => {
                if (group.group_id === group_id) {

                  group.unread_cnt = 0
                  group.count_unread = 0
                  checkchange = true
                  group.last_message_id = group.last_message.message_id
                  this.props.netaGroupsUpdate(group.group_id, group, true)
                }
              })
              if (checkchange) {
                let index = this.state.groupsDisplay.length
                if(index === 0){
                  index = 20
                }
                let groupsDisplay = groups.slice(0, index)
                this.setState({ groups:groups, groupsDisplay:groupsDisplay })
              }
            }
          })
        }
      }
    }
  }

  checkReadedOne(resolve, group_id, mess_id) {
    const msg = {
      group_id: group_id,
      message_id: mess_id,
      message: '',
      status: 3
    }

    if (rxio.connected) {
      rxio.socket.emit('update_message', msg, (data) => {
        if (data && data.message && data.message.message_id) {
          resolve(data.message.message_id)
        }
      })
    }
  }

  loadMessTmp(group_id, callback) {
    const msg = {
      group_id: group_id,
      pindex: 0,
      psize: 30
    }

    if (rxio.connected) {
      rxio.socket.emit('list_message', msg, (data) => {
        if (data && data.last_message_id && data.messages && data.messages.constructor === Array && data.messages.length > 0) {
          this.props.netaMessAdd(group_id, data.messages)
          callback()
        }
      })
    }
  }

  getNetaMessChecked(objGroup, cntNoti) {
    let groupid = objGroup.group_id
    this.props.netaMessGet(groupid, (objMess) => {
      if (objMess) {
        try {
          let arrPromise = []
          if (objMess && objMess.constructor === Object && Object.keys(objMess).length > 0) {
            let arrMessTmp = Object.keys(objMess)
            let amountMessNoti = ((arrMessTmp.length - cntNoti) > 0) ? cntNoti : arrMessTmp.length
            objGroup.last_message_id = objMess[arrMessTmp[arrMessTmp.length - 1]]['message_id']
            for (let i = (arrMessTmp.length - 1); i > (arrMessTmp.length - amountMessNoti - 1); i--) {
              let omess = objMess[arrMessTmp[i]]['message_id']
              arrPromise.push(new Promise((resolve, reject) => {
                this.checkReadedOne(resolve, groupid, omess)
              }))
            }
          }
          if (arrPromise.length > 0) {
            Promise.all(arrPromise).then((values) => {
              if (values && values.constructor === Array && values.length > 0) {
                objGroup.unread_cnt = 0
                objGroup.count_unread = 0
                this.props.netaGroupsUpdate(groupid, objGroup, true)
              }
            });
          }
        } catch (e) { }
      } else {
        this.loadMessTmp(groupid, () => {
          setTimeout(() => {
            this.getNetaMessChecked(objGroup, cntNoti)
          }, 200)
        })
      }
    })
  }

  checkedAllReaded(groupid) {
    let groups = this.state.groups
    let cntNoti = 0
    let objGroup = groups.find(o => o.group_id === groupid)
    if (objGroup) {
      cntNoti = (rxaget(objGroup, 'count_unread', 0) > 0) ? rxaget(objGroup, 'count_unread', 0) : rxaget(objGroup, 'unread_cnt', 0)
    }
    if (cntNoti > 0) {
      this.getNetaMessChecked(objGroup, cntNoti)
    }
  }

  // check popup menu message group 
  onRightClickGroup(e, group) {
    e.preventDefault();
    document.oncontextmenu = function (e) {
      return false;
    }
    // document.getElementById('menu-message').style.display = 'none'
    const menuDiv = document.getElementById('context_menu-group')
    // if(group.type === 2) {
    if (menuDiv) {
      menuDiv.style.top = e.clientY + 'px'
      menuDiv.style.left = Number(e.clientX) + 'px'
      menuDiv.style.display = 'block'
    }
    this.setState({ groupChooseItem_selected: group, group: group, flagRightMouse: true, groupRightMouse: group })
    // } else {
    //   menuDiv.style.display = 'none'
    // }
    // hide context-menu on message
    const menuDivMessage = document.getElementById('menu-message')
    if (menuDivMessage) {
      menuDivMessage.style.top = e.clientY + 'px'
      menuDivMessage.style.left = Number(e.clientX) + 'px'
      menuDivMessage.style.display = 'none'
    }
  }

  // checkTypeChooseGroup() {
  //   let result = 0
  //   let messSelectedType = rxaget(this.state, 'mess_selected.type', '')
  //   if (rxaget(this.state, 'mess_selected.sender_uin', '').toString() === this.userid.toString()) {
  //     if (messSelectedType === 12 || messSelectedType === 1 || messSelectedType === 6 || messSelectedType === 3 || messSelectedType === 4 || messSelectedType === 10) {
  //       result = 1
  //     } else {
  //       result = 3
  //     }
  //   }
  //   if (rxaget(this.state, 'mess_selected.status', 0) === 4) {
  //     result = 2
  //   }
  //   if (rxaget(this.state, 'mess_selected.deleted_uins', []).indexOf(this.userid.toString()) !== -1) {
  //     result = 2
  //   }
  //   if (result === 0 && rxaget(this.state, 'mess_selected.message', '') !== '') {
  //     result = 3
  //   }
  //   if (result === 0 && rxaget(this.state, 'mess_selected.message', '') === '') {
  //     if (messSelectedType === 12 || messSelectedType === 1 || messSelectedType === 6 || messSelectedType === 3 || messSelectedType === 4 || messSelectedType === 10) {
  //       result = 1
  //     } else {
  //       result = 3
  //     }
  //   }
  //   return result
  // }

  leaveGroupBtnClick() {
    let tabmore = rxaget(this.props, 'tabmore', false)
    if( tabmore.data === true){
      tabmore.data = false
      this.props.changeStatusTabmore('false')
    }

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
        if (groupObj.type === 3) {
          groupObj['delete_conversation'] = true  
        }
        
        this.props.clickPopup('leave_group', { data: { groups: contactsUsers, user: user, group: groupObj } }, (data) => {
          if (data) {
            this.funcChooseLeader(groupObj, data)
          } else {
            if (groupObj.type === 3) {
              this.deleteGroup(groupObj)
            } else {
              this.leaveGroup(groupObj)
            }
          }
        })
      }
    }
  }

  funcChooseLeader(groupObjTmp, leaderChecked) {
    let groupObj = groupObjTmp
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
              let groupObjNew = JSON.parse(JSON.stringify(groupObj))
              groupObjNew.admin_uins = groupObjNew.admin_uins[index]
              groupObjNew.last_message = dataMess.message
              groupObjNew.last_message_id = dataMess.last_message_id
              this.props.changeStatusLoadMess()
              this.props.chooseGroupAction(groupObjNew)
              this.props.netaGroupsUpdate(Number(groupObjNew.group_id), groupObjNew)
              this.leaveGroup(groupObjNew)
            }
          })
        } catch (error) { console.log("addAdmin", error) }
      }
    })

    this.setState({ displayLeaveGroupScreen: false })
  }

  leaveGroup(groupObjTmp=null) {
    let groupObj = groupObjTmp
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
                if (arrGroups.constructor === Array && arrGroups.length > 1) {
                  arrGroups = arrGroups.filter(groupid => groupid !== groupObj.group_id.toString())
                  if (groupsStore.groups && groupsStore.groups[arrGroups[0]]) {
                    this.props.chooseGroupAction(groupsStore.groups[arrGroups[0]])
                  }
                }
                if ([0,1].indexOf(arrGroups.length) !== -1)  {
                  this.props.chooseGroupAction({group_id: ''})
                }
              } else {
                this.props.chooseGroupAction({group_id: ''})
              }
            })
          }
        })

      }
    }
  }

  deleteGroup(groupObjTmp=null) {
    let groupObj = groupObjTmp
    if (groupObj && groupObj.group_id) {
      if (rxio.connected) {
        const msgUpGroup = {
          group_id: Number(groupObj.group_id)
        }
        let groupsStore = this.props.netaGroups

        rxio.deleteConversation(msgUpGroup, (data) => {
          if (data && [0, 1].indexOf(data.result) !== -1) {
            this.setState({ displayLeaveGroupScreen: false }, () => {
              this.props.netaGroupsRemove(groupObj.group_id)
              this.props.netaMessRemove(groupObj.group_id)
              if (groupsStore && groupsStore.groups) {
                let arrGroups = Object.keys(groupsStore.groups)
                if (arrGroups.constructor === Array && arrGroups.length > 1) {
                  arrGroups = arrGroups.filter(groupid => groupid !== groupObj.group_id.toString())
                  if (groupsStore.groups && groupsStore.groups[arrGroups[0]]) {
                    this.props.chooseGroupAction(groupsStore.groups[arrGroups[0]])
                  }
                } 

                if ([0,1].indexOf(arrGroups.length) !== -1)  {
                  this.props.chooseGroupAction({group_id: ''})
                }
              } else {
                this.props.chooseGroupAction({group_id: ''})
              }
            })
          }
        })

      }
    }
  }

  checkDisableNoti(group_id) {
    let netaAuthSetting = JSON.parse(localStorage.getItem('netaAuthSetting') || `{"groups":{}}`)
    let notificationStatus = this.state.notificationStatus
    if (notificationStatus === true && netaAuthSetting && netaAuthSetting.groups && netaAuthSetting.groups[Number(group_id)]) {
      let groupDisableNoti = netaAuthSetting.groups[Number(group_id)].disableNoti
      return groupDisableNoti
    } else {
      return false
    }

  }

  onChangeNotiGroup(group_id) {
    try {
      let disableNoti = !this.checkDisableNoti(group_id)
      let netaAuthSetting = JSON.parse(localStorage.getItem('netaAuthSetting') || `{"groups":{}}`)
      !netaAuthSetting.groups[Number(group_id)]
        && (netaAuthSetting.groups[Number(group_id)] = {})
      netaAuthSetting.groups[Number(group_id)].disableNoti = disableNoti
      this.props.netaAuthSettingUpdate(netaAuthSetting)
      this.props.changeStatusLoadMess()
      this.setState({ disableNoti: disableNoti })
    } catch (error) { console.log("onChangeNotiGroup", error) }
  }

  groupChooseItem(e, value) {
    let group_id_selected = this.state.groupChooseItem_selected.group_id
    switch (value) {
      case 'Mark as read':
        console.log('Mark as read')
        this.checkedAllReaded(group_id_selected)
        break
      case 'Turn off notifications':


        this.onChangeNotiGroup(group_id_selected)
        if (group_id_selected === this.state.group_id) {
          this.props.chooseGroupAction(this.state.groupChooseItem_selected)
        }

        break
      case 'Pin a conversation':
        let groups = this.state.groups

        for (let i = 0; i < groups.length; i++) {
          if (groups[i].group_id === group_id_selected) {
            if (this.checkGroupsPinned_uins(groups[i].pinned_uins) === true) {
              rxio.unpinGroup(group_id_selected, (data) => {
                if (data) {
                  this.props.netaGroupsUpdateUnpin(String(this.userid), group_id_selected)
                  this.setState({ pg_group: 0 }, () => {
                    this.fetchGroups()
                  })
                }
              })
            } else {
              rxio.pinGroup(group_id_selected, (data) => {
                if (data) {
                  this.setState({ pg_group: 0 }, () => {
                    this.fetchGroups()
                  })
                }
              })
            }
          }
        }
        break
      case 'Hide a conversation':
        console.log('Hide a conversation')
        break
      case 'Delete':
        console.log('Delete')
        break
      default:
        break

    }
  }

  onClickShowPopup_ManageGroup() {
    let tabmore = rxaget(this.props, 'tabmore', false)
    if( tabmore.data === true){
      tabmore.data = false
      this.props.changeStatusTabmore('false')
    }
    this.setState({ isShowPopup_ManageGroup: true})
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


  // fixbug list member
  loadGroupsTemp(occupants_uins, users) {
    let groupId = occupants_uins//this.state.group.occupants_uins
    let groups = users//this.users
    let groupsTemp = []
    let countMemberOnl = 0
    if (groupId) {
      for (const useridkey of Object.keys(groups)) {
        for (let i = 0; i < groupId.length; i++) {
          if (String(groupId[i]) === String(groups[(useridkey)].id)) {
            groupsTemp.push(groups[(useridkey)])

            if (groups[(useridkey)].online_status === 1) {
              countMemberOnl++
            }
          }
        }
      }
      this.setState({
        groupsTemp: groupsTemp,
        chooseLeader_groupsTemp: groupsTemp,
        lg_chooseLeader_groupsTemp: groupsTemp,
        countMemberOnl: countMemberOnl
      })
    }
  }

  closePopup() {
    this.setState({ isShowPopup_ManageGroup: false })
  }
  // end choose leader

  render() {
    // console.log('Render Groups')
    // console.log("group: Rerender")
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({
  themeValue: state.themeValue,
  themeBackgroudValue: state.themeBackgroudValue,
  langValue: state.langValue,
  user: state.user,
  netaauth: state.netaauth,
  rxgroup: state.rxgroup,
  netaGroups: state.netaGroups,
  netaGroupsPin: state.netaGroupsPin,
  netaContact: state.netaContact,
  netaBlobs: state.netaBlobs,
  tabmore: state.tabmore
})

const mapDispatchToProps = {
  userAdd,
  userAddArr,
  contactAdd,
  netaGroupsUpdate,
  netaGroupsUpdateArr,
  netaBlobsUpdate,
  chooseGroupAction,
  changeStatusTabmore,
  changeStatusLoadMess,
  netaAuthSettingUpdate,
  netaGroupsPinUpdate,
  netaGroupsRemove,
  netaGroupsUpdateUnpin,
  clearRxContact,
  clickPopup,
  netaMessGet,
  netaMessAdd,
  netaUserSetGroupid,
  netaMessRemove
}

const GroupsWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default GroupsWrapped