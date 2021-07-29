import { combineReducers, createStore } from 'redux'
import { } from './global'

const { rxsetLocal, rxgetLocal } = global.rootRequire('classes/request')

let initialState = {
  activeComponent: 'chat',
  user: { status: false, users: {}, ids: [] },
  auth: { status: false, user: {} },
  rxSearch: { params: {} },
  viewed: { status: false, products: {} },
  rxgroup: { status: false, group: {}, groupid: '' },
  tabmore: { status: false, data: false },
  loadmess: { status: false, data: false },
  groupMess: { status: false, data: {} },
  netaauth: { status: false, user: {} },
  netaRegisteredUsers: { status: false, data: [] },
  netaCallHistory: { status: false, data: [] },
  netaGroups: { status: false, groups: {}, group_id_change: '' },
  netaGroupsLastMess: { groups: {} },
  netaContact: { status: false, data: {} },
  netaBlobs: { status: false, data: {} },
  netaMess: { status: false, data: {} },
  netaPinMess: { status: false, data: {} },
  netaCalling: { status: false, data: {} },
  netaMedia: { status: false, data: {} },
  netaLink: { status: false, data: {} },
  netaCall: { status: false, type_call: '', payload: {} },
  netaAuthSetting: { groups: {} },
  recentSearchGroups: { groups: {} },
  recentContactGroups: { groups: {} },
  usersStatus: {},
  netaPopup: { status: false, type_popup: '', data: {} },
  userClickInfo:{}
}

const initialStateLate = {
  activeComponent: rxgetLocal('activeComponent') || 'chat',
  user: global.rxu.json(rxgetLocal('rxusers'), { status: false, users: {}, ids: [] }),
  auth: global.rxu.json(rxgetLocal('rxuser'), { status: false, user: {} }),
  rxSearch: global.rxu.json(rxgetLocal('rxsearch'), { params: {} }),
  viewed: global.rxu.json(rxgetLocal('rxviewed'), { status: false, products: {} }),
  rxgroup: global.rxu.json(rxgetLocal('rxgroup'), { status: false, group: {}, groupid: '' }),
  tabmore: global.rxu.json(rxgetLocal('rxtabmore'), { status: false, data: false }),
  loadmess: global.rxu.json(rxgetLocal('rxloadmess'), { status: false, data: false }),

  netaauth: global.rxu.json(rxgetLocal('rxuserneta'), { status: false, user: {} }),
  netaRegisteredUsers: global.rxu.json(rxgetLocal('netaRegisteredUsers'), { status: false, data: [] }),
  netaCallHistory: global.rxu.json(rxgetLocal('netaCallHistory'), { status: false, data: [] }),
  netaGroups: global.rxu.json(rxgetLocal('netaGroups'), { status: false, init: false, groups: {}, group_id_change: '' }),
  netaGroupsLastMess: global.rxu.json(rxgetLocal('netaGroupsLastMess'), { groups: {} }),
  netaContact: global.rxu.json(rxgetLocal('netaContacts'), { status: false, data: {} }),
  netaBlobs: global.rxu.json(rxgetLocal('rxnetaBlobs'), { status: false, data: {} }),
  netaMess: global.rxu.json(rxgetLocal('netaMess'), { status: false, data: {} }),
  netaPinMess: global.rxu.json(rxgetLocal('netaPinMess'), { status: false, data: {} }),
  netaCalling: global.rxu.json(rxgetLocal('netaCalling'), { status: false, data: {} }),
  netaMedia: global.rxu.json(rxgetLocal('netaMedia'), { status: false, data: {} }),
  netaLink: global.rxu.json(rxgetLocal('netaLink'), { status: false, data: {} }),
  langValue: global.rxu.json(rxgetLocal('netaLang'), 'vi'),
  pageValue: global.rxu.json(rxgetLocal('netaPage'), ''),
  themeValue: global.rxu.json(rxgetLocal('netaThemeColor'), ''),
  themeBackgroudValue: global.rxu.json(rxgetLocal('netaThemeBackGround'), ''),
  notificationStatusValue: global.rxu.json(rxgetLocal('netaNotificationStatus'), ''),
  netaAuthSetting: global.rxu.json(rxgetLocal('netaAuthSetting'), { groups: {} }),
  usersStatus: global.rxu.json(rxgetLocal('netaUsersStatus'), {}),
  recentSearchGroups: global.rxu.json(rxgetLocal('netaRecentSearchGroups'), {}),
  recentContactGroups: global.rxu.json(rxgetLocal('netaRecentContact'), {}),
}

export const setComp = comp => ({
  type: 'SET_COMP',
  comp
})

export const activateGeod = geod => ({
  type: 'ACTIVATE_GEOD',
  geod
})

export const closeGeod = () => ({
  type: 'CLOSE_GEOD'
})

export const loginAction = (user) => ({
  type: 'LOGIN',
  user: user
})

export const logoutAction = () => ({
  type: 'LOGOUT'
})

export const netaloginAction = (user) => {
  return ({
    type: 'NETALOGIN',
    user: user
  })
}

export const userClickUpdate = (user) => {
  return ({
    type: 'USER_CLICK_UPDATE',
    user: user
  })
}

export const netaUpdateProfileAction = (data) => {
  return ({
    type: 'NETA_UPDATE_PROFILE',
    data
  })
}

export const netaAuthSettingUpdate = (data) => ({
  type: 'NETA_AUTH_SETTING_UPDATE',
  data: data
})

export const netaAuthSettingSoundUpdate = (data) => ({
  type: 'NETA_AUTH_SETTING_SOUND_UPDATE',
  data: data
})

export const netalogoutAction = () => ({
  type: 'NETALOGOUT'
})

export const chooseGroupAction = (group) => ({
  type: 'CHOOSE_GROUP',
  group: group
})

export const netaRegisteredUsersUpdate = (data) => ({
  type: 'NETA_REGISTERED_USERS_UPDATE',
  data: data
})

export const netaAddRegisteredUser = (data) => ({
  type: 'NETA_ADD_REGISTERED_USER',
  data: data
})

export const netaCallHistoryUpdate = (data) => ({
  type: 'NETA_CALL_HISTORY_UPDATE',
  data: data
})

export const netaGroupsUpdate = (id, data, updateOnly) => ({
  type: 'NETA_GROUPS_UPDATE',
  id: id,
  data: data,
  updateOnly: updateOnly
})

export const updateRecentSearchGroups = (id, data, time) => ({
  type: 'UPDATE_RECENT_SEARCH_GROUPS',
  id: id,
  data: data,
  time: time
})

export const updateRecentContactGroups = (id, time) => ({
  type: 'UPDATE_RECENT_CONTACT_GROUPS',
  id: id,
  time: time
})

export const createRecentContactGroups = (data) => ({
  type: 'CREATE_RECENT_CONTACT_GROUPS',
  data: data
})

export const netaGroupsRemove = (id) => ({
  type: 'NETA_GROUPS_REMOVE',
  id: id
})

export const netaGroupsUpdateLastMess = (id, data_id, data) => ({
  type: 'NETA_GROUPS_UPDATE_LAST_MESS',
  id: id,
  data_id: data_id,
  data: data
})

export const netaUserUpdate = (data) => ({
  type: 'USER_UPDATE',
  data: data
})

export const netaUserSetGroupid = (userid,group_id) => ({
  type: 'USER_SET_GROUPID',
  userid:userid,
  group_id: group_id
})

export const netaGroupsUpdateArr = (data, init) => ({
  type: 'NETA_GROUPS_UPDATE_ARR',
  data: data,
  init: init
})

export const netaGroupsUpdateUnpin = (user_id, group_id) => ({
  type: 'NETA_GROUPS_UPDATE_UNPIN',
  user_id: user_id,
  group_id: group_id
})

export const netaBlobsUpdate = (id, data) => ({
  type: 'NETA_BLOBS_UPDATE',
  id: id,
  data: data
})

export const netaBlobsUpdateArr = (id, data) => ({
  type: 'NETA_BLOBS_UPDATE_ARR',
  id: id,
  data: data
})

export const netaMediaAdd = (id, data) => ({
  type: 'NETA_MEDIA_ADD',
  id: id,
  data: data
})

export const netaMediaOneAdd = (id, data) => ({
  type: 'NETA_MEDIA_ONE_ADD',
  id: id,
  data: data
})

export const netaLinkAdd = (id, data) => ({
  type: 'NETA_LINK_ADD',
  id: id,
  data: data
})

export const netaMessAdd = (groupid, mess) => ({
  type: 'NETA_MESS_ADD',
  id: groupid,
  mess: mess
})

export const netaMessRemove = (groupid, mess) => ({
  type: 'NETA_MESS_REMOVE',
  id: groupid
})

export const netaMessGet = (groupid, callback) => ({
  type: 'NETA_MESS_GET',
  id: groupid,
  callback: callback
})

export const netaMessClear = () => ({
  type: 'NETA_MESS_CLEAR'
})

export const netaMessPin = (groupid, mess) => ({
  type: 'NETA_MESS_PIN',
  id: groupid,
  mess: mess
})

export const netaMessPinClear = () => ({
  type: 'NETA_MESS_PIN_CLEAR'
})

export const netaCallingStart = (data) => ({
  type: 'NETA_CALLING_START',
  data: data
})

export const netaCallingStop = (data) => ({
  type: 'NETA_CALLING_STOP',
  data: data
})

export const rxsearchChange = (id, payload) => ({
  type: 'SEARCH_CHANGE',
  id: id,
  params: payload
})

export const rxsearchClear = () => ({
  type: 'SEARCH_CLEAR'
})

export const viewedAdd = (id, payload) => ({
  type: 'VIEWED_ADD',
  id: id,
  product: payload
})

export const userAdd = (id, payload) => ({
  type: 'USER_ADD',
  id: id,
  user: payload
})

export const userAddArr = (payload) => ({
  type: 'USER_ADD_ARR',
  users: payload
})

export const userSub = (id, payload) => ({
  type: 'USER_SUB',
  id: id,
  user: payload
})

export const userDelete = (id) => ({
  type: 'USER_DELETE',
  id: id
})

export const userClear = () => ({
  type: 'USER_CLEAR'
})

export const updateUserStatus = (data) => ({
  type: 'USER_STATUS_UPDATE',
  data
})

export const clickCall = (typecall, payload) => ({
  type: 'CLICK_CALL',
  type_call: typecall,
  payload: payload
})

export const closePopup = (typepopup) => ({
  type: 'CLOSE_POPUP',
  type_popup: typepopup
})

export const changeStatusTabmore = (data) => ({
  type: 'TABMORE_CHANGE',
  data: data
})

export const changeStatusLoadMess = () => ({
  type: 'LOADMESS_CHANGE'
})

export const saveLanguage = (data) => ({
  type: 'CHANGE_LANG',
  data: data
})

export const savePage = (data) => ({
  type: 'CHANGE_PAGE',
  data: data
})

export const saveTheme = (data) => ({
  type: 'CHANGE_THEME',
  data: data
})

export const saveThemeBackgroud = (data) => ({
  type: 'CHANGE_THEMEBACKGROUD',
  data: data
})

export const saveNotificationStatus = (data) => ({
  type: 'CHANGE_NOTIFICATION_STATUS',
  data: data
})

export const contactAdd = (payload) => ({
  type: 'CONTACT_ADD',
  contacts: payload
})

export const addNewMessAction = (data) => ({
  type: 'ADD_MESS_GROUP',
  mess: data
})

export const geod = (state = {}, action) => {
  switch (action.type) {
    case 'ACTIVATE_GEOD':
      return action.geod

    case 'CLOSE_GEOD':
      return {}

    default:
      return state
  }
}

export const user = (state = initialStateLate.user, action) => {
  switch (action.type) {
    case 'USER_ADD': {
      if (!state) { state = { status: false, users: {}, ids: [] } }
      if (typeof (state.users) === 'undefined') { state.users = {} }
      if (typeof (state.ids) === 'undefined') { state.ids = [] }

      if (state && state.users && action.id) {
        if (action && action.user && action.user.data) {
          state.users[action.id] = {
            id: action.id, email: action.user.data.email || '',
            full_name: action.user.data.full_name || '', profile_url: action.user.data.profile_url || '',
            name_contact: action.user.data.name || '', phone: action.user.data.phone || ''
          } || state.users[action.id]
        }

        const newState = { status: !state.status, users: state.users, ids: Object.keys(state.users) }
        rxsetLocal('rxusers', JSON.stringify(newState))

        return newState
      } else {
        return state
      }
    }

    case 'USER_ADD_ARR': {
      if (!state) { state = { status: false, users: {}, ids: [] } }
      if (typeof (state.users) === 'undefined') { state.users = {} }
      if (typeof (state.ids) === 'undefined') { state.ids = [] }

      let checkChange = false
      if (action && action.users && action.users.constructor === Array && action.users.length > 0) {
        for (let user of action.users) {
          if (state.users[user.id] && (state.users[user.id]['full_name'] === user['full_name'] && state.users[user.id]['profile_url'] === user['profile_url'])) {
            // checkChange = checkChange
          } else {
            checkChange = true
            state.users[user.id] = { id: user.id, email: user.email || '', full_name: user.full_name || '', profile_url: user.profile_url || '', name_contact: user.name || '', phone: user.phone || '' }
          }
        }
      }
      if (checkChange) {
        const newState = { status: !state.status, users: state.users, ids: Object.keys(state.users) }
        rxsetLocal('rxusers', JSON.stringify(newState))
        return newState
      } else {
        return state
      }


    }

    case 'USER_UPDATE': {
      if (!state) { state = { status: false, users: {}, ids: [] } }
      if (typeof (state.users) === 'undefined') { state.users = {} }
      if (typeof (state.ids) === 'undefined') { state.ids = [] }

      if (state && state.users) {
        if (action && action.data) {
          state.users[action.data.id] = action.data
        }

        const newState = { status: !state.status, users: state.users, ids: Object.keys(state.users) }
        rxsetLocal('rxusers', JSON.stringify(newState))

        return newState
      } else {
        return state
      }
    }
    case 'USER_SET_GROUPID': {
      if (!state) { state = { status: false, users: {}, ids: [] } }
      if (typeof (state.users) === 'undefined') { state.users = {} }
      if (typeof (state.ids) === 'undefined') { state.ids = [] }

      if (state && state.users) {
        if (action && action.userid && action.group_id) {
          if(state.users[action.userid]){
           if(action.userid==='281474977724903'){
           }
            state.users[action.userid].group_id = action.group_id  
          }          
        }
        const newState = { status: !state.status, users: state.users, ids: Object.keys(state.users) }
        rxsetLocal('rxusers', JSON.stringify(newState))

        return newState
      } else {
        return state
      }
    }

    default: {
      return state
    }
  }
}

export const netaCall = (state = initialState.netaCall, action) => {
  switch (action.type) {
    case 'CLICK_CALL': {
      if (!state) { state = { status: false, type_call: action.type_call || '', payload: action.payload || {} } }
      return { status: !state.status, type_call: action.type_call || '', payload: action.payload || {} }
    }

    default: {
      return state
    }
  }
}

export const clickPopup = (typepopup, data, callback) => ({
  type: 'CLICK_POPUP',
  type_popup: typepopup,
  data: data,
  callback: callback
})

export const netaPopup = (state = initialState.netaPopup, action) => {
  switch (action.type) {
    case 'CLICK_POPUP': {
      if (!state) { //nếu state null
        state = { status: true, type_popup: action.type_popup || '', data: action.data || {} } //khởi tạo state với 3 field 
      }
      let newState = { status: !state.status, type_popup: action.type_popup || '' } //phủ định lại field status
      if (action.data && action.data.data) { //action.data.data không null
        newState.data = action.data.data
      }
      if (['create_group', 'add_member', 'leave_group'].includes(action.type_popup)) {
        newState.callback = action.callback
      }
      return newState
    }

    case 'CLOSE_POPUP': {
      if (!state) { state = { status: false, type_popup: action.type_popup || '', data: action.data || {} } }
      let newState = { status: !state.status, type_popup: '', data: {} }

      return newState
    }

    default: {
      return state
    }
  }
}

export const netaContact = (state = initialStateLate.netaContact, action) => {
  switch (action.type) {
    case 'CONTACT_ADD': {
      if (!state) { state = { status: false, data: {} } }
      if (typeof (state.data) === 'undefined') { state.data = {} }
      let checkChange = false
      if (action && action.contacts && action.contacts.constructor === Array && action.contacts.length > 0) {
        for (let contact of action.contacts) {
          if (state.data[contact.phone] && state.data[contact.phone] === contact.name) {
            // checkChange = checkChange
          } else {
            if (contact && contact.phone) {
              checkChange = true
              state.data[contact.phone] = contact.name || ''
            }
          }
        }
      }
      // console.log("CONTACT_ADD",state.data)
      if (checkChange) {
        const newState = { status: !state.status, data: state.data }
        rxsetLocal('netaContacts', JSON.stringify(newState))
        return newState
      } else {
        return state
      }
    }

    default: {
      return state
    }
  }
}

export const auth = (state = initialState.auth, action) => {
  switch (action.type) {
    case 'LOGIN': {
      if (!state) { state = { status: false, user: {} } }
      if (typeof (state.user) === 'undefined') { state.user = {} }

      if (typeof (action.user) !== 'undefined') {
        state.user = action.user
      }

      const newState = { status: !state.status, user: state.user }
      rxsetLocal('rxuser', JSON.stringify(newState))
      return newState
    }

    case 'LOGOUT': {
      const newState = { status: !state.status, user: {} }
      rxsetLocal('rxuser', JSON.stringify(newState))
      return newState
    }

    default: {
      return state
    }
  }
}

export const netaauth = (state = initialState.netaauth, action) => {
  switch (action.type) {
    case 'NETALOGIN': {
      if (!state) { state = { status: false, user: {} } }
      if (typeof (state.user) === 'undefined') { state.user = {} }

      if (typeof (action.user) !== 'undefined') {
        state.user = action.user
      }

      const newState = { status: !state.status, user: state.user }
      rxsetLocal('rxuserneta', JSON.stringify(newState))

      if (!rxgetLocal('rxusers')) {
        const rxusers = { status: false, users: {}, ids: [] }
        rxsetLocal('rxusers', JSON.stringify(rxusers))
      }
      if (!rxgetLocal('netaGroups')) {
        const groupsNeta = { status: false, groups: {}, group_id_change: '' }
        rxsetLocal('netaGroups', JSON.stringify(groupsNeta))
      }

      return newState
    }
    case 'NETA_UPDATE_PROFILE': {
      if (!state) { state = { status: false, user: {} } }

      if (action.data) {
        state.user = { ...state.user, ...action.data }
      }
      const newState = { status: !state.status, user: state.user }
      rxsetLocal('rxuserneta', JSON.stringify(newState))

      return newState
    }
    case 'NETALOGOUT': {
      const newState = { status: !state.status, user: {} }
      rxsetLocal('rxuserneta', JSON.stringify(newState))

      const netaBlobs = { status: false, data: {} }
      rxsetLocal('rxnetaBlobs', JSON.stringify(netaBlobs))

      const groupsNeta = { status: false, init: false, groups: {}, group_id_change: '' }
      rxsetLocal('netaGroups', JSON.stringify(groupsNeta))

      const rxusers = { status: false, users: {}, ids: [] }
      rxsetLocal('rxusers', JSON.stringify(rxusers))

      const netaMess = { status: false, data: {} }
      rxsetLocal('netaMess', JSON.stringify(netaMess))
      rxsetLocal('netaGroupsLastMess', JSON.stringify({ groups: {} }))

      const netaMedia = { status: false, data: {} }
      rxsetLocal('netaMedia', JSON.stringify(netaMedia))
      rxsetLocal('netaLink', JSON.stringify(netaMedia))
      rxsetLocal('netaContacts', JSON.stringify(netaMedia))

      const netaCallHistory = { status: false, data: [] }
      rxsetLocal('netaCallHistory', JSON.stringify(netaCallHistory))
      rxsetLocal('netaRegisteredUsers', JSON.stringify(netaCallHistory))

      const newGroupOne = { status: false, group: {}, groupid: '' }
      rxsetLocal('rxgroup', JSON.stringify(newGroupOne))

      const rxgroupsneta = { status: false, groups: {} }
      rxsetLocal('rxgroupsneta', JSON.stringify(rxgroupsneta))

      rxsetLocal('groupsTemp', JSON.stringify({}))
      rxsetLocal('netaUserStatus', JSON.stringify({}))
      rxsetLocal('rxemoji', JSON.stringify({}))
      rxsetLocal('rxsticker', JSON.stringify({}))

      rxsetLocal('netaThemeBackGround', 'defaultTheme')
      rxsetLocal('netaThemeColor', 'orangeColor')
      rxsetLocal('netaNotificationStatus', true)
      rxsetLocal('netaLastSeenMessObj', JSON.stringify({}))

      rxsetLocal('netaPinMess', JSON.stringify({ status: false, data: {} }))
      rxsetLocal('netaAuthSetting', JSON.stringify({ groups: {} }))
      rxsetLocal('netaRecentContact', JSON.stringify({ groups: {} }))
      rxsetLocal('netaRecentSearchGroups', JSON.stringify({ groups: {} }))
      rxsetLocal('netaUsersStatus', JSON.stringify({}))
      rxsetLocal('netaPage', '')
      return newState
    }

    default: {
      return state
    }
  }
}

export const netaCalling = (state = initialState.netaCalling, action) => {
  switch (action.type) {
    case 'NETA_CALLING_START': {
      state.data = action.data
      state.data.calling = true
      const newState = { status: !state.status, data: state.data }
      return newState
    }

    case 'NETA_CALLING_STOP': {
      state.data = action.data
      state.data.calling = false
      const newState = { status: !state.status, data: state.data }
      return newState
    }

    default: {
      return state
    }
  }
}

export const netaBlobs = (state = initialState.netaBlobs, action) => {
  switch (action.type) {
    case 'NETA_BLOBS_UPDATE': {
      if (!state) { state = { status: false, data: {} } }
      if (typeof (state.data) === 'undefined') { state.data = {} }
      const created_at = Math.floor(Date.now() / 1000)
      if (action && action.id && action.data) {
        const key = action.id.replace(global.rxu.config.get_blobs + '/', '')
        if (!state.data[key] || (state.data[key] && (created_at - state.data[key].created_at) > 43200)) {
          state.data[key] = { link: action.data, created_at: created_at }
        }
      }

      const newState = { status: state.status, data: state.data }
      rxsetLocal('rxnetaBlobs', JSON.stringify(newState))
      return newState
    }

    case 'NETA_BLOBS_UPDATE_ARR': {
      if (!state) { state = { status: false, groups: {} } }
      if (typeof (state.data) === 'undefined') { state.data = {} }

      if (action && action.data && action.data.constructor === Array && action.data.length > 0) {
        const created_at = Math.floor(Date.now() / 1000)
        for (const obj of action.data) {
          if (obj && obj.id && obj.link) {
            const key = obj.id.replace(global.rxu.config.get_blobs + '/', '')
            if (!state.data[key] || (state.data[key] && (created_at - state.data[key].created_at) > 43200)) {
              state.data[key] = { link: obj.link, created_at: created_at }
            }
          }
        }
      }

      const newState = { status: !state.status, data: state.data }
      rxsetLocal('rxnetaBlobs', JSON.stringify(newState))

      return newState
    }

    default: {
      return state
    }
  }
}

export const netaMedia = (state = initialState.netaMedia, action) => {
  switch (action.type) {
    case 'NETA_MEDIA_ADD': {
      if (!state) { state = { status: false, data: {} } }
      if (typeof (state.data) === 'undefined') { state.data = {} }

      if (action && action.id && action.data) {
        if (state.data && !state.data[action.id]) { state.data[action.id] = { images: {}, videos: {}, files: {} } }
        if (action.data) {
          state.data[action.id] = action.data
        }
      }

      const newState = { status: !state.status, data: state.data }
      rxsetLocal('netaMedia', JSON.stringify(newState))

      return newState
    }

    case 'NETA_MEDIA_ONE_ADD': {
      if (!state) { state = { status: false, data: {} } }
      if (typeof (state.data) === 'undefined') { state.data = {} }
      let type = ''
      if (action && action.id && action.data) {
        if (state.data && !state.data[action.id]) { state.data[action.id] = { images: {}, videos: {}, files: {} } }
        type = (action.data.media_type === 2) ? 'images' : (action.data.media_type === 12) ? 'files' : (action.data.media_type === 4) ? 'videos' : ''
        if (action.data && action.data.url && type) {
          try {
            state.data[action.id][type][action.data.url] = action.data
          } catch (e) { }
        }
      }

      const newState = { status: !state.status, data: state.data, change: action.data.url }
      rxsetLocal('netaMedia', JSON.stringify(newState))

      return newState
    }

    default: {
      return state
    }
  }
}

export const netaLink = (state = initialState.netaLink, action) => {
  switch (action.type) {
    case 'NETA_LINK_ADD': {
      if (!state) { state = { status: false, data: {} } }
      if (typeof (state.data) === 'undefined') { state.data = {} }

      if (action && action.id && action.data) {
        if (state.data && !state.data[action.id]) { state.data[action.id] = action.data }
      }

      const newState = { status: !state.status, data: state.data }
      rxsetLocal('netaLink', JSON.stringify(newState))

      return newState
    }

    default: {
      return state
    }
  }
}

export const netaRegisteredUsers = (state = initialState.netaRegisteredUsers, action) => {
  switch (action.type) {
    case 'NETA_ADD_REGISTERED_USER': {
      let newState = { ...state }
      if (action.data) {
        const index = newState.data.findIndex(i => Number(i.Id) === Number(action.data.Id))
        if (index === -1)
          newState.data.push(action.data)
        else newState.data[index] = { ...action.data }
      }
      return newState
    }
    case 'NETA_REGISTERED_USERS_UPDATE': {
      const newState = { status: !state.status, data: action.data }
      rxsetLocal('netaRegisteredUsers', JSON.stringify(newState))
      return newState
    }

    default: { return state }
  }
}

export const netaCallHistory = (state = initialState.netaCallHistory, action) => {
  switch (action.type) {
    case 'NETA_CALL_HISTORY_UPDATE': {
      const newState = { status: !state.status, data: action.data }
      rxsetLocal('netaCallHistory', JSON.stringify(newState))
      return newState
    }

    default: { return state }
  }
}

export const netaGroups = (state = initialState.netaGroups, action) => {
  if (!(state && state.groups)) { state = { status: false, groups: {}, group_id_change: '' } }
  state.init = state.init || (Object.keys(state.groups).length >= 1000)
  switch (action.type) {
    case 'NETA_GROUPS_UPDATE': {
      try {
        if (typeof (state.groups) === 'undefined') { state.groups = {} }

        if (!state.groups[action.id.toString()] && !action.updateOnly) {
          if (action && action.id && action.data) {
            state.groups[action.id] = action.data
          }
        } else if (action.id && state.groups[action.id]) {
          Object.keys(action.data).forEach(key => {
            state.groups[action.id][key] = action.data[key]
          })
        }
        if (state.groups[action.id] && state.groups[action.id].group_id)
          state.groups[action.id].group_id = state.groups[action.id].group_id.toString()
        if (state.groups[action.id].admin_uins) state.groups[action.id].admin_uins = state.groups[action.id].admin_uins.map(i => { return i.toString() })

        if (state.groups[action.id].occupants_uins) state.groups[action.id].occupants_uins = state.groups[action.id].occupants_uins.map(i => { return i.toString() })

        if (state.groups[action.id].owner_uin) state.groups[action.id].owner_uin = state.groups[action.id].owner_uin.toString()
      } catch (error) { }

      const newState = { status: !state.status, init: state.init, groups: state.groups, group_id_change: action.id + '' }
      rxsetLocal('netaGroups', JSON.stringify(newState))
      return newState
    }
    case 'NETA_GROUPS_UPDATE_UNPIN': {
      try {
        if (typeof (state.groups) === 'undefined') { state.groups = {} }
        let pinned_uinsArr = state.groups[action.group_id].pinned_uins
        for (let i = 0; i < pinned_uinsArr.length; i++) {
          if (String(pinned_uinsArr[i]) === action.user_id) {
            pinned_uinsArr.splice(i, 1);
          }
        }
        state.groups[action.group_id].pinned_uins = pinned_uinsArr
      } catch (error) { }
      const newState = { status: !state.status, init: state.init, groups: state.groups, group_id_change: action.id + '' }
      rxsetLocal('netaGroups', JSON.stringify(newState))
      return newState
    }
    case 'NETA_GROUPS_UPDATE_ARR': {
      if (action && action.data && action.data.constructor === Array && action.data.length > 0) {
        for (const obj of [...action.data]) {
          if (obj.group_id) {
            if (obj.isDelete) {
              delete state.groups[obj.group_id.toString()]
            } else {
              state.groups[obj.group_id] = obj
            }
          }
        }
      }
      // if init=== true => stop
      const newState = { status: !state.status, init: (state.init || action.init), groups: state.groups, group_id_change: '' }
      rxsetLocal('netaGroups', JSON.stringify(newState))
      return newState
    }

    case 'NETA_GROUPS_REMOVE': {
      if (typeof (state.groups) === 'undefined') { state.groups = {} }

      if (action && action.id && state.groups[action.id]) {
        delete state.groups[action.id]
      }
      // console.log("NETA_GROUPS_REMOVE")
      const newState = { status: !state.status, init: state.init, groups: { ...state.groups }, group_id_change: action.id + '' }

      rxsetLocal('netaGroups', JSON.stringify(newState))
      return newState
    }

    default: { return state }
  }
}

export const rxgroup = (state = initialState.rxgroup, action) => {
  switch (action.type) {
    case 'CHOOSE_GROUP': {
      if (action && action.group && action.group.group_id) {
        if (!state) { state = { status: false, group: {}, groupid: '' } }
        if (typeof (state.group) === 'undefined') { state.group = {} }
        if (typeof (state.groupid) === 'undefined') { state.groupid = '' }
        if (state.group && Object.keys(state.group).length > 0) { state.group = {} }

        try {
          if (action.group.admin_uins) {
            action.group.admin_uins = action.group.admin_uins.map(i => { return i.toString() })
          }
          if (action.group.occupants_uins) {
            let occupants_uins = action.group.occupants_uins.map(i => { return i.toString() })
            action.group.occupants_uins = Array.from(new Set(occupants_uins))
          }
          if (action.group.owner_uin) {
            action.group.owner_uin = action.group.owner_uin.toString()
          }
        } catch (error) {

        }

        state.group = action.group
        state.groupid = action.group.group_id.toString()

        const newState = {
          status: !state.status,
          group: state.group,
          groupid: state.groupid
        }

        rxsetLocal('rxgroup', JSON.stringify(newState))
        return newState
      } else if (action && action.group && action.group.group_id === '') {
        const newGroupOne = { status: !state.status, group: {}, groupid: '' }
        rxsetLocal('rxgroup', JSON.stringify(newGroupOne))
        return newGroupOne
      } else {
        return state
      }
    }

    default: {
      return state
    }
  }
}

export const tabmore = (state = initialState.tabmore, action) => {
  switch (action.type) {
    case 'TABMORE_CHANGE': {
      if (!state) { state = { status: false, data: false } }
      state.data = !state.data
      const newState = { status: !state.status, data: action.data }
      return newState
    }

    default: {
      return state
    }
  }
}

export const loadmess = (state = initialState.loadmess, action) => {
  switch (action.type) {
    case 'LOADMESS_CHANGE': {
      if (!state) { state = { status: false, data: false } }
      const newState = { status: !state.status, data: !state.status }
      return newState
    }

    default: {
      return state
    }
  }
}

export const rxSearch = (state = initialState.rxSearch, action) => {
  switch (action.type) {
    case 'SEARCH_CHANGE': {
      const newState = { params: action.params }
      rxsetLocal('rxsearch', JSON.stringify(newState))
      return newState
    }

    case 'SEARCH_CLEAR': {
      const newState = { params: { st_full: 'created_at:desc', st_col: 'created_at', st_type: -1, pg_page: 1, pg_size: 12, price: { min: 100, max: 10000 } } }
      rxsetLocal('rxsearch', JSON.stringify(newState))
      return newState
    }

    default: {
      return state
    }
  }
}

const getMessState = (state, action, sortField = 'created_at') => {
  if (!state) { state = { status: false, data: {} } }
  if (typeof (state.data) === 'undefined') { state.data = {} }
  state.data[action.id] = state.data[action.id] || { time: [], messages: {} }
  if (!state.data[action.id].time) { state.data[action.id].time = [] }
  if (!state.data[action.id].messages) { state.data[action.id].messages = {} }
  if (action.mess && action.mess.constructor === Array && action.mess.length > 0) {
    for (const omess of action.mess) {
      if (omess && omess[sortField]) {
        const arrTime = state.data[action.id].time.sort((a, b) => { return a - b })
        const objMess = JSON.parse(JSON.stringify(state.data[action.id].messages))
        objMess[omess[sortField].toString()] = omess

        if (arrTime.indexOf(Number(omess[sortField])) === -1) {
          arrTime.push(Number(omess[sortField]))
          if (arrTime.length > 30) {
            arrTime.shift()
            delete state.data[action.id].messages[omess[sortField].toString()]
          }
        }

        state.data[action.id].time = arrTime
        const messages_tmp = {}

        for (const created_at of arrTime) {
          messages_tmp[created_at.toString()] = objMess[created_at.toString()]
        }
        state.data[action.id].messages = messages_tmp
      }
    }
  }

  if (action && action.mess && action.mess.constructor === Object && action.mess.message_id) {
    let groupid = global.rxu.get(action, 'mess.group_id', '')
    let messtime = global.rxu.get(action, 'mess.created_at', '')
    if (state.data && state.data[groupid] && state.data[groupid]['time'] && state.data[groupid]['time'].constructor === Array && state.data[groupid]['time'].indexOf(Number(messtime)) === -1) {
      state.data[groupid]['messages'][Number(messtime)] = action.mess
      state.data[groupid]['time'].push(Number(messtime))

      try {
        let arrTimeMess = state.data[groupid]['time'].sort((a, b) => { return a - b })
        if (arrTimeMess.length > 30) {
          for (let i = 0; i < (arrTimeMess.length - 29); i++) {
            delete state.data[groupid]['messages'][Number(arrTimeMess[i])]
            state.data[groupid]['time'].splice(i, 1)
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  return state
}

export const netaMess = (state = initialStateLate.netaMess, action) => {
  switch (action.type) {
    case 'NETA_MESS_ADD': {
      const { status, data } = getMessState(state, action)
      const newState = { status: !status, data: data }
      rxsetLocal('netaMess', JSON.stringify(newState))
      return newState
    }

    // case 'NETA_MESS_REMOVE': {
    //   const { status, data } = getMessState(state, action)
    //   const newState = { status: !status, data: data }
    //   rxsetLocal('netaMess', JSON.stringify(newState))
    //   return newState
    // }

    case 'NETA_MESS_REMOVE': {
      if (typeof (state.data) === 'undefined') { state.data = {} }

      if (action && action.id && state.data[action.id]) {
        delete state.data[action.id]
      }
      const newState = { status: !state.status, data: { ...state.data }}

      rxsetLocal('netaMess', JSON.stringify(newState))
      return newState
    }

    case 'NETA_MESS_GET': {
      let getMess = action.callback
      try {
        if (state.data && state.data[action.id] && state.data[action.id]) {
          getMess(state.data[action.id]['messages'])
        } else {
          getMess(null)
        }
      } catch (e) {
        console.log(e)
      }

      return {}
    }

    case 'NETA_MESS_CLEAR': {
      const newState = { status: !state.status, data: {} }
      rxsetLocal('netaMess', JSON.stringify(newState))

      return newState
    }

    default: {
      return state
    }
  }
}

export const netaPinMess = (state = initialStateLate.netaPinMess, action) => {
  switch (action.type) {
    case 'NETA_MESS_PIN': {
      const { status, data } = getMessState({ status: false, data: {} }, action, "pinned_at")
      const newState = { status: !status, data: data }
      rxsetLocal('netaPinMess', JSON.stringify(newState))

      return newState
    }

    case 'NETA_MESS_PIN_CLEAR': {
      const newState = { status: !state.status, data: {} }
      rxsetLocal('netaPinMess', JSON.stringify(newState))
      return newState
    }

    default: {
      return state
    }
  }
}

export const viewed = (state = initialState.viewed, action) => {
  switch (action.type) {
    case 'VIEWED_ADD': {
      if (!state) { state = { status: false, products: {} } }
      if (typeof (state.products) === 'undefined') { state.products = {} }
      state.products[action.id] = state.products[action.id] || { id: action.id }

      if (typeof (action.product) !== 'undefined' && typeof (action.product.data) !== 'undefined' && action.product.data.img_landscape) {
        state.products[action.id].data = action.product.data
      }

      const newState = { status: !state.status, products: state.products }
      if (Object.keys(newState.products).length > 10) {
        delete (newState.products[Object.keys(newState.products)[0]])
      }

      rxsetLocal('rxviewed', JSON.stringify(newState))
      return newState
    }

    default: {
      return state
    }
  }
}

export const groupMess = (state = initialState.groupMess, action) => {
  switch (action.type) {
    case 'ADD_MESS_GROUP': {
      if (!state) { state = { status: false, data: {} } }
      if (action && action.mess && action.mess.message_id && action.mess.group_id) {
        if (!state.data[action.mess.group_id]) {
          state.data[action.mess.group_id] = action.mess
          state.status = !state.status
        } else if (state.data[action.mess.group_id]['message_id'] !== action.mess.message_id) {
          state.data[action.mess.group_id] = action.mess
          state.status = !state.status
        }
      }
      const newState = { status: state.status, data: state.data }
      return newState
    }

    default: {
      return state
    }
  }
}

export const reset = (state = initialState, action) => {
  switch (action.type) {
    case 'LOG_OUT': {
      const newState = initialState
      return newState
    }

    case 'RESET_STORE': {
      const newState = initialStateLate
      return newState
    }

    default: {
      return state
    }
  }
}

export const netaGroupsLastMess = (state = initialStateLate.netaGroupsLastMess, action) => {
  switch (action.type) {
    case 'NETA_GROUPS_UPDATE_LAST_MESS': {
      if (!state) { state = { groups: {} } }
      if (typeof (state.groups) === 'undefined') { state.groups = {} }

      if (action && action.id && action.data) {
        state.groups[action.id] = { last_message_id: action.data_id, last_message: action.data }
      }

      const newState = { groups: state.groups }
      rxsetLocal('netaGroupsLastMess', JSON.stringify(newState))
      return newState
    }
    default: {
      return state
    }
  }
}

export const recentSearchGroups = (state = initialState.recentSearchGroups, action) => {
  switch (action.type) {
    case 'UPDATE_RECENT_SEARCH_GROUPS': {
      if (!state) {
        state = { group: {} }
      }
      if (typeof state.groups === 'undefined') {
        state.groups = {}
      }
      if (action && action.data && action.id) {
        state.groups[action.id] = action.data
        state.groups[action.id].timeSearch = action.time
        const newState = { groups: state.groups }
        rxsetLocal('netaRecentSearchGroups', JSON.stringify(newState))
        return newState
      } else {
        return state
      }
    }
    default: {
      return state
    }
  }
}

export const recentContactGroups = (state = initialState.recentContactGroups, action) => {
  switch (action.type) {
    case 'UPDATE_RECENT_CONTACT_GROUPS': {
      if (!state) {
        state = { group: {} }
      }
      if (typeof state.groups === 'undefined') {
        state.groups = {}
      }
      if (action && action.id) {
        if (!state.groups[action.id]) { state.groups[action.id] = {} }
        state.groups[action.id].timeContact = action.time
        const newState = { groups: state.groups }
        rxsetLocal('netaRecentContact', JSON.stringify(newState))
        return newState
      } else {
        return state
      }
    }
    case 'CREATE_RECENT_CONTACT_GROUPS': {
      if (!state) {
        state = { group: {} }
      }
      if (typeof state.groups === 'undefined') {
        state.groups = {}
      }
      if (action && action.data && Object.keys(state.groups).length === 0) {
        state.groups = action.data
        const newState = { groups: state.groups }
        rxsetLocal('netaRecentContact', JSON.stringify(newState))
        return newState
      } else {
        return state
      }
    }
    default: {
      return state
    }
  }
}

export const userClickInfo = (state = initialState.userClickInfo, action) => {
  switch (action.type) {
    case 'USER_CLICK_UPDATE': {
      if (action && action.user) {
        let group = action.user
        console.log(action.user,'action dien')
        const newState ={group:group}
        console.log(newState,'xin chao')
        // rxsetLocal('netaLang', JSON.stringify(lang))
        return newState
      } else {
        return state
      }
    }
    default: {
      return state
    }
  }
}

export const langValue = (state = initialStateLate.langValue, action) => {
  switch (action.type) {
    case 'CHANGE_LANG': {
      if (action && action.data) {
        let lang = action.data
        rxsetLocal('netaLang', JSON.stringify(lang))
        return lang
      } else {
        return state
      }
    }
    default: {
      return state
    }
  }
}

export const pageValue = (state = initialStateLate.pageValue, action) => {
  switch (action.type) {
    case 'CHANGE_PAGE': {
      if (action && action.data) {
        let page = action.data
        rxsetLocal('netaPage', JSON.stringify(page))
        return page
      } else {
        return state
      }
    }
    default: {
      return state
    }
  }
}

export const themeValue = (state = initialStateLate.themeValue, action) => {
  switch (action.type) {
    case 'CHANGE_THEME': {
      if (action && action.data) {
        let page = action.data
        rxsetLocal('netaThemeColor', JSON.stringify(page))
        return page
      } else {
        return state
      }
    }
    default: {
      return state
    }
  }
}

export const themeBackgroudValue = (state = initialStateLate.themeBackgroudValue, action) => {
  switch (action.type) {
    case 'CHANGE_THEMEBACKGROUD': {
      if (action && action.data) {
        let page = action.data
        rxsetLocal('netaThemeBackGround', JSON.stringify(page))
        return page
      } else {
        return state
      }
    }
    default: {
      return state
    }
  }
}

export const notificationStatusValue = (state = initialStateLate.notificationStatusValue, action) => {
  switch (action.type) {
    case 'CHANGE_NOTIFICATION_STATUS': {
      if (action && action.data) {
        let notificationStatus = action.data
        rxsetLocal('netaNotificationStatus', notificationStatus)
        return notificationStatus
      } else {
        return state
      }
    }
    default: {
      return state
    }
  }
}

export const usersStatus = (state = initialState.usersStatus, action) => {
  switch (action.type) {
    case 'USER_STATUS_UPDATE': {
      if (!state) state = initialState.usersStatus
      let netaUsersStatus = { ...state }
      if (action.data && action.data.uin) {
        netaUsersStatus[Number(action.data.uin)] = action.data.user_status
        delete netaUsersStatus[Number(action.data.uin)].uin
        // console.log("USER_STATUS_UPDATE", action.data)
        rxsetLocal('netaUsersStatus', JSON.stringify(netaUsersStatus))
      }
      return netaUsersStatus
    }
    default: {
      return state
    }
  }
}

export const netaAuthSetting = (state = initialState.netaAuthSetting, action) => {
  switch (action.type) {
    case 'NETA_AUTH_SETTING_UPDATE': {
      if (action && action.data) {
        let netaAuthSetting = action.data
        rxsetLocal('netaAuthSetting', JSON.stringify(netaAuthSetting))
        return netaAuthSetting
      } else {
        return state
      }
    }
    case 'NETA_AUTH_SETTING_SOUND_UPDATE': {
      if (action && action.data) {
        let netaAuthSetting = action.data
        rxsetLocal('netaAuthSetting', JSON.stringify(netaAuthSetting))
        return netaAuthSetting
      } else {
        return state
      }
    }    
    default: {
      return state
    }
  }
}

export const activeComponent = (state = initialStateLate.activeComponent, action) => {
  switch (action.type) {
    case 'SET_COMP': {
      if (action && action.comp) {
        rxsetLocal('activeComponent', action.comp)
        return action.comp
      } else {
        return state
      }
    }
    default: {
      return state
    }
  }
}

export const reducers = combineReducers({
  geod, auth, rxgroup, rxSearch, viewed, user, netaauth, netaRegisteredUsers, netaCallHistory, netaGroups, netaBlobs, 
  netaMess, netaCalling, tabmore, loadmess, netaMedia, langValue, recentSearchGroups, recentContactGroups, pageValue, themeValue, 
  themeBackgroudValue, notificationStatusValue, netaAuthSetting, netaContact, netaLink, netaGroupsLastMess, netaPinMess, activeComponent, 
  netaCall, usersStatus, netaPopup, userClickInfo, groupMess
})

export const rootReducer = (state, action) => {
  if (action.type === 'RESET_STORE') {
    return reducers(initialStateLate, action)
  } else if (action.type === 'NETALOGOUT') {
    return reducers(initialState, action)
  } else {
    return reducers(state, action)
  }
}

export function configureStore(initialState = {}) {
  const store = createStore(rootReducer, initialState)
  store.subscribe(() => { })

  if (typeof window !== 'undefined') {
    window.store = store
  }

  initialState = initialStateLate
  store.dispatch({ type: 'RESET_STORE' })
  return store
}

if (typeof window !== 'undefined') {
  window.storeReset = () => {
    initialState = initialStateLate
    window.store.dispatch({ type: 'RESET_STORE' })
  }
}

export const store = configureStore()
