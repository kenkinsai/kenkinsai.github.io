/*global translate*/
const { rxaget, rxChangeSlug } = global.rootRequire('classes/ulti')
const { rxgetLocal } = global.rootRequire('classes/request')

export function addContact({ arrContacts = [], udid = '', token, typeForce = 0 }, callback) {
  try {
    let address_book_link = global.rxu.config.base_api_neta + '/api/address_book.json'
    let params = { "force": typeForce, "contacts": arrContacts, "udid": "" }
    let headers = { 'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8', 'TC-Token': token }
    // console.log('addContact',arrContacts,udid,token)
    if (params.contacts && params.contacts.length > 0) {
      fetch(address_book_link, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: headers
      }).then((res) => { return res.json() })
        .then((json) => {
          callback && callback(json)
        }).catch(er => console.log(er))
    }
  } catch (error) { }
}
export async function fetchContact ({netaContact={},token=''},callback) {    
  if (token) {
    const api_address_book = global.rxu.config.address_book
    const max_size = 100
    let checkBreak = true, newContacts=[]
    for (let i=0; i < 1000; i ++) {
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
      // console.log("fetchContact params",params)
      let res = await fetch(api_address_book + '?' + tempBody, { method: 'GET', headers: { Accept: 'application/json', 'TC-Token': token, Connection: 'Keep-Alive', 'Accept-Encoding': 'gzip' }, body: null })
      try {
        let json = await res.json()
        if (res && [404,401].indexOf(res.status) !== -1) { checkBreak = true }
        else if (json && json.constructor === Array && json.length > 0) {
          for (let ocontact of json) {
            if (typeof(netaContact) === 'object' && typeof(netaContact[ocontact.phone]) === 'undefined') {
              checkBreak = false
              break
            }
          }
          newContacts=[...newContacts,...json]
          if (json.length < max_size) { checkBreak = true }
        }
      } catch(e) {
        checkBreak = true 
      }
      if (checkBreak === true) {
        // console.log("fetchContact end",newContacts.length)
        callback && callback(newContacts)
        break 
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
export function checkBlock(group, userid) {
  let isBlocked = 0
  try {
    if (group && group.type && group.type === 3 && group.blocked_uins) {
      group.blocked_uins.map(i => {
        let index = group.occupants_uins.indexOf(i.toString())
        if (index !== -1) {
          isBlocked = 1 // mình chặn ng ta
          if (userid && group.occupants_uins[index].toString() === userid.toString()) {
            isBlocked = 2 // mình bị chặn
          }
        }
        return isBlocked
      })
    }
  } catch (error) { console.log(error) }
  return isBlocked
}
export function checkNameUser(user, userid = '', netauser) {
  let result = ''
  let netaAuthSetting =  global.rxu.json(rxgetLocal('netaAuthSetting'), { groups:{} })
  if (user&&(!user.id && user.Id)) user.id = user.Id
  if (userid && user.id && user.id.toString() === userid.toString()) {
    result = translate('You')
    if(netauser && netauser.user && netauser.user.name){
      result = netauser.user.name + ' ('+ translate('You')+")"
    }
  } 
  else if(netaAuthSetting.groups && netaAuthSetting.groups[Number(user.id)]){
    result = rxaget(netaAuthSetting.groups[Number(user.id)], 'name', '')
  }
  else {
    let netaContact = global.rxu.json(rxgetLocal('netaContacts'), { status: false, data: {} })
    let objContact = rxaget(netaContact, 'data', {})
    if (user && user.phone) {
      if (objContact && objContact[user.phone]) {
        result = objContact[user.phone]
      } else if (user.full_name) {
        result = user.full_name
      } else {
        result = user.phone
      }
    }
  }

  return result
}
export function updateUsersOnline(occupants_uins, oldCountMemberOnl, usersStatus, oldUserStatus) {
  try {
    let status = { ...(oldUserStatus || usersStatus) }, isChange = false, countMemberOnl = 0
    let { id } = (rxgetLocal('rxuserneta') &&
      global.rxu.json(rxgetLocal('rxuserneta'), { user: {} }).user)||{}
    // console.log("updateUsersOnline",occupants_uins.length,  Object.keys(status).length)
    occupants_uins && occupants_uins.map(i => {
      if (!status[Number(i)]) {
        status[Number(i)] = {
          online_status: 2,
          message_status: "",
          last_seen_at: 0,
        }
        isChange = true
      }
      if (usersStatus[Number(i)] && usersStatus[Number(i)].online_status !== status[Number(i)].online_status) {
        delete usersStatus[Number(i)].uin
        status[Number(i)] = usersStatus[Number(i)]
        isChange = true
        // console.log("?", usersStatus[Number(i)] && usersStatus[Number(i)].online_status, status[Number(i)] && status[Number(i)].online_status)
      }
      if (Number(i) === Number(id)) {
        status[Number(i)] = {
          online_status: 1,
          message_status: "",
          last_seen_at: 0,
        }
      }
      return
    })
    Object.keys(status).map(i => {
      if (occupants_uins.indexOf(i.toString()) === -1) {
        // console.log(i,"--",status[Number(i)])
        delete status[i]
        isChange = true
      } else {
        if (status[Number(i)].online_status === 1) countMemberOnl += 1
      }
    })
    if (countMemberOnl !== oldCountMemberOnl) isChange = true
    // isChange && console.log("[updateUsersOnline]", status)
    return { isChange, usersStatus: { ...status }, countMemberOnl: countMemberOnl }
  } catch(e) {return{}} 
}
export function checkNameGroup (group, users, userid) { 
  let result = ''
  try {
    if (users) {
      if (group && group.type === 3) {
        let netaAuthSetting =  global.rxu.json(rxgetLocal('netaAuthSetting'), { groups:{} })
        if(netaAuthSetting.groups && netaAuthSetting.groups[Number(group.group_id)]){
          result = rxaget(netaAuthSetting.groups[Number(group.group_id)], 'name', '')

          if (!result) {
            let usertmp = users[group.owner_uin.toString()]
            const partnerUin = global.rxu.array(rxaget(group, 'occupants_uins', [])).filter(ele => (ele.toString() !== userid.toString()))
            if (partnerUin.length > 0) { usertmp = users[partnerUin[0].toString()] }
            result = checkNameUser(usertmp)
          }
        } else if (group && group.occupants_uins && group.occupants_uins.constructor === Array && group.occupants_uins.length === 2 && userid && group.occupants_uins.indexOf(userid.toString()) !== -1) {
          const arruserid = group.occupants_uins.filter(o => o !== userid.toString())
          if (arruserid && arruserid.constructor === Array) {
            const user = users[arruserid[0]]
            result = checkNameUser(user)
          }
        } else if (group && group.owner_uin) {
          let usertmp = users[group.owner_uin.toString()]
          const partnerUin = global.rxu.array(rxaget(group, 'occupants_uins', [])).filter(ele => (ele.toString() !== userid.toString()))
          
          if (partnerUin.length > 0) {
            usertmp = users[partnerUin[0].toString()]
          }
          result = checkNameUser(usertmp)

        } else {
          result = checkNameUser(users[group.owner_uin.toString()]) || group.name
        }
      } else {
        if (group && !group.name) {
          const occupants_uins = group.occupants_uins || []
          if (occupants_uins && occupants_uins.length > 0) {
            const groupname = []
            occupants_uins.forEach(uin => {
              const fullname = (users[uin.toString()]) ? checkNameUser(users[uin.toString()]) : ''
              if (fullname) {
                groupname.push(fullname)
              }
            })
            result = groupname.join(', ')
          }
        } else {
          result = rxaget(group, 'name', '')
        }
      }
    }
  } catch (e) {
    // console.log(e)
  }

  return result || translate('Stranger')
}
export function getGroupById (group, users, userid) { 
  let result = 0
  try {
    if (users) {
      if (group && group.type === 3) {
        if (group && group.occupants_uins && group.occupants_uins.constructor === Array && group.occupants_uins.length === 2 && userid && group.occupants_uins.indexOf(userid.toString()) !== -1) {
          const arruserid = group.occupants_uins.filter(o => o !== userid.toString())
          if (arruserid && arruserid.constructor === Array) {
            result = users[arruserid[0]]
          }
        } 
      } else {
        //console.log('CAN NOT CHECK ID FOR GROUP HAVE MANY MEMBER')
      }
    }
  } catch (e) {
    console.log(e)
  }

  return result 
}

export function checkAvatarGroup (group, users, userid) {
  let result = false
  try {
    if (group && group.avatar_url) {
      result = true
    } else if (group && group.type === 3 && !group.avatar_url) {
      if (group && group.occupants_uins && group.occupants_uins.constructor === Array && group.occupants_uins.length === 2 && userid && group.occupants_uins.indexOf(userid.toString()) !== -1) {
        const arruserid = group.occupants_uins.filter(o => o !== userid.toString())
        if (arruserid && arruserid.constructor === Array && arruserid[0] && users[arruserid[0]] && users[arruserid[0]].profile_url) {
          result = true
        }
      }
    }
  } catch (e) {}

  return result
}

export function checkName (uid, users, type) {
  if (uid) {
    const username = rxaget(users, uid + '', {})

    if (!type) {
      return (username.full_name) ? username.full_name : (username.name_contact) ? username.name_contact : ''
    } else {
      let fullname = username.name_contact || username.full_name
      if (fullname) {
        fullname = rxChangeSlug(fullname).slice(0, 2).toUpperCase()
        return fullname || ''
      } else {
        return ''
      }
    }
  } else {
    return ''
  }
}

export function checkNameContact (user) {
  let result = ''
  if (user) {
    if (user.name_contact) {
      result = user.name_contact
    } else if (user.full_name) {
      result = user.full_name
    } else if (user.phone) {
      result = user.phone
    } else {
      result = translate('Stranger')
    }
  }

  return result
}

export function checkAvatarSender (omess, users) {
  let result = false
  if (users && omess && omess.sender_uin && users[omess.sender_uin.toString()] && users[omess.sender_uin.toString()].profile_url) {
    result = true
  }
  return result
}

export function checkAvatarSenderTagName (users, userId) {
  if (users && users[userId] && users[userId].profile_url) return true
  return false
}

export function checkIsOwner (omess, userid) {
  if (userid && rxaget(omess, 'sender_uin', '').toString() === userid.toString()) {
    return true
  } else {
    return false
  }
}

export function parseMessageDesc (objmsg, users, userid) {
  let message = ''
  let attachments = {}
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
          message = translate('The message has been deleted')
        } else {
          let mess =''
          switch (objmsg.type) {
            case 1:
              let call_name = ''
              mess = translate(' finished')
              if (attachments.media_type === 1) {
                call_name = translate('Voice call')
              } else if (attachments.media_type === 2) {
                call_name = translate('Video call')
              }

              message = call_name + mess
              break
            case 2:
              message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid)+": "+ translate('Image')
              break
            case 3:
              message = 'Audio'
              break
            case 4:
              message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid)+": "+ 'Video'
              break
            case 5:
              if(typeof objmsg.sender_uin === 'number'){
                objmsg.sender_uin = String(objmsg.sender_uin)
              }
              mess = translate(' created a group')
              message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid) + mess
              break
            case 6:
              const userins = []
              if(typeof objmsg.sender_uin === 'number'){
                objmsg.sender_uin = String(objmsg.sender_uin)
              }
              try {
                if (attachments && attachments.added_uins && attachments.added_uins.constructor === Array && attachments.added_uins.length > 0) {
                  for (const uid of attachments.added_uins) {
                    const uname = checkNameUser(rxaget(users, uid.toString(), {}),userid)
                    if (uname) {
                      userins.push(uname)
                    }
                  }
                }
              } catch (e) {
                console.log(e)
              }
              if (userins.length > 0) {                

                mess = translate(' added ')
                message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid) + mess + userins.join(', ')
              }
              else if (attachments.removed_uins && attachments.removed_uins.constructor === Array && attachments.removed_uins.length > 0) {
                try {
                  let rmMem = []
                  for (const uid of attachments.removed_uins) {
                    const uname = checkNameUser(rxaget(users, uid.toString(), {}), userid)
                    if (uname) {
                      rmMem.push(uname)
                    }
                  }
                  if (rmMem.length > 0) {
                    mess = translate(' removed ')
                    message = checkNameUser(rxaget(users, objmsg.sender_uin, {}), userid) + mess + rmMem.join(', ')
                  }
                } catch (error) {console.log("prasemess",error) }
              }  
              else if(attachments.pin_message){
                if (attachments.pin_message.type === -1) {
                  message = attachments.pin_message.content
                }
                else
                  message = checkNameUser(rxaget(users, objmsg.sender_uin.toString(), {})) + translate(' pinned one message')
              } 
              else if (attachments && attachments.updated_group_avatar) {
                message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid) + translate(' update avatar')
              }
              else if (attachments && attachments.updated_group_name) {
                message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid) + translate(' update group name')
              }
              else if (attachments && attachments.type === 'update_group' && (attachments.owner_uin || attachments.admin_uins)) {
                message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid) + translate(' change group admin to: ')
                  + checkNameUser(rxaget(users, (attachments.owner_uin || attachments.admin_uins[0]), {}))
              } else if (attachments && attachments.group_id && attachments.push_all && attachments.push_all.constructor === Array && attachments.push_all.length > 0 ) {
                try {
                  const arrUserNameAdd = []
                  for (const uid of attachments.push_all) {
                    const unameNew = checkNameUser(rxaget(users, uid.toString(), {}))
                    if (unameNew) {
                      arrUserNameAdd.push(unameNew)
                    }
                  }
                  if (arrUserNameAdd.length > 0) {
                    message = arrUserNameAdd.join(', ') + translate(' joined group with link')  
                  }
                } catch(e1) {}
              }
              break
            case 7:
              if(typeof objmsg.sender_uin === 'number'){
                objmsg.sender_uin = String(objmsg.sender_uin)
              }
              mess = translate(' has left the group')
              message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid) + mess
              break
            case 8:
              message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid)+": "+ objmsg.message
              break
            case 9:
              message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid)+": "+objmsg.message
              break
            case 10:
              message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid)+": "+'Sticker'
              break
            case 12:
              message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid)+": "+translate('File')
              break
            case 14:
              message = translate('Current Location')
              break
            case 15:
              message = translate('Live Location')
              break
            case 16:
              message = 'Group Call'
              break
            default:
              message = checkNameUser(rxaget(users, objmsg.sender_uin, {}),userid)+": "+objmsg.message || ''
              break
          }
        }
      } else {
        message = translate('The message has been deleted')
      }
    } else {
      if (objmsg.status !== 4) {
        if (objmsg.deleted_uins && objmsg.deleted_uins.constructor === Array && objmsg.deleted_uins.length > 0 && objmsg.deleted_uins.indexOf(userid) !== -1) {
          message = translate('The message has been deleted')
        } else {
          message = objmsg.message || ''
        }
      } else {
        message = translate('The message has been deleted')
      }
    }

    if (message && message.indexOf('@') !== -1) {
      const userstag = message.match(/(@\d+\b)/ig)
      if (userstag && userstag.constructor === Array && userstag.length > 0) {
        userstag.forEach(o => {
          const useridtmp = o.replace('@', '') || ''
          if (users[useridtmp]) {
            message = message.replace(o, /*'<b>' +/*'@'+ */checkNameUser(rxaget(users, useridtmp, {})) /*+ '</b>'*/)
          }
        })
      }
    }

    return message || ''
  } else {
    return ''
  }
}
