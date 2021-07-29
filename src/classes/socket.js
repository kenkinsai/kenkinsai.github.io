import io from 'socket.io-client'
import { rxsecret } from './../config/index'

const rxio = {}
const secret = rxsecret()

// const socketURL = endPoint + namespace
// const socketURL = 'http://127.0.0.1:2082/'
const socketURL = secret.socket_api + '/data'

rxio.token = ''
rxio.uin = ''
rxio.socket = null
rxio.connected = false
rxio.init_connected = false
rxio.groups = []
rxio.callbacks = {
}

rxio.login = function (token, uin, callback) {
  rxio.token = token
  rxio.uin = uin
  rxio.init_connected = true

  if (rxio.token) {
    const socket = io(socketURL, { transports: ['websocket'], query: `session=${rxio.token}` })
    rxio.socket = socket
    if (socket) {
      checkConnected(callback)
    }

    return true
  } else {
    console.log('Please Login')
    return false
  }
}

rxio.disconnect = function () {
  if (rxio.connected) {
    try {
      rxio.socket.disconnect()
    } catch (e) {}
    rxio.token = ''
    rxio.uin = ''
    rxio.socket = null
    rxio.connected = false
    rxio.groups = []
  }
}

const fireCallback = function (name, data) {
  const curCallback = rxio.callbacks[name]
  if (Array.isArray(curCallback) && curCallback.length) {
    curCallback.forEach(ele => { if (typeof ele === 'function') { ele(data) } })
  }
}

const checkConnected = function (callback) {
  // var onevent = rxio.socket.onevent;
  // rxio.socket.onevent = function (packet) {
  //   var args = packet.data || [];
  //   onevent.call(this, packet);    // original call
  //   packet.data = ["*"].concat(args);
  //   onevent.call(this, packet);      // additional call to catch-all
  // };
  // rxio.socket.on("*", function (event, data) {
  //   console.log("OnAllEven", event, data);
  // });
  rxio.socket.on('connect', () => {
    rxio.connected = true
    callback()
    addHandlers()
    rxio.init_connected = false
    // rxio.getListConversation()
  })

  rxio.socket.on('disconnect', function () {
    console.log('NetaloSDK - socket disconnected')
  })

  rxio.socket.on('reconnect', function (data) {
    console.log('Reconnect')
    // console.log(data)
  })

  rxio.socket.on('reconnect_error', function (data) {
    console.log('Reconnect Error')
    // console.log(data)
  })

  // C A L L //
  // rxio.socket.on('start_call', function (data) {
  //   console.log('Receive: Start Call')
  //   fireCallback('start_call', data)
  // })

  // rxio.socket.on('answer_call', function (data) {
  //   console.log('Receive: Answer Call')
  //   fireCallback('answer_call', data)
  // })

  // rxio.socket.on('stop_call', function (data) {
  //   console.log('Receive: Stop Call')
  //   fireCallback('stop_call', data)
  // })

  // // W E B R T C //
  // rxio.socket.on('ice_sdp', function (data) {
  //   console.log('Receive: Ice Sdp')
  //   fireCallback('ice_sdp', data)
  // })

  // rxio.socket.on('ice_candidate', function (data) {
  //   console.log('Receive: Ice Candidate')
  //   fireCallback('ice_candidate', data)
  // })

  // // C H E C K  E V E N T S //
  // rxio.socket.on('event', function (data) {
  //   // console.log('Receive: Event ', data)
  //   fireCallback('event', data)
  // })

  // rxio.socket.on('message', function (data) {
  //   // console.log('Messsage',data)
  //   fireCallback('message', data)
  // })
  // rxio.socket.on('update_message', function (data) {
  //   // console.log('Update_message',data)
  //   fireCallback('update_message', data)
  // })
  // rxio.socket.on('update_group', function (data) {
  //   // console.log('Update_group',data)
  //   fireCallback('update_group', data)
  // })
  // rxio.socket.on('user_status', function (data) {
  //   // console.log('User_status')
  //   fireCallback('user_status', data)
  // })
}
rxio.getUser_status = function (callback) {
  if (rxio.connected) {
    // rxio.socket.on('user_status', (data) => {

    //  // console.log('User_status')
    //   // console.log(data)
    //   callback(data)
    // })
  }
}
rxio.getWaitMessage = function (callback) {
  if (rxio.connected) {
    rxio.socket.on('message', (data) => {
      callback(data)
    })
  }
}
rxio.getUpdateMessage = function (callback) {
  if (rxio.connected) {
    rxio.socket.on('update_message', (data) => {
      // console.log('Update_message')
      callback(data)
    })
  }
}
rxio.getPinGroup = function (callback) {
  if (rxio.connected) {
    rxio.socket.on('pin_group', (data) => {
      console.log('Pin_group ')
      // console.log(data)
      callback(data)
    })
  }
}
rxio.getUnpinGroup = function (callback) {
  if (rxio.connected) {
    rxio.socket.on('unpin_group', (data) => {
      console.log('Unpin_group ')
      // console.log(data)
      callback(data)
    })
  }
}
rxio.getWaitLiveLocation = function (callback) {
  if (rxio.connected) {
    rxio.socket.on('live_location', (data) => {
      callback(data)
    })
  }
}
// rxio.getWaitLiveLocation = function (callback) {
//   if (rxio.connected) {
//     rxio.socket.on('message', (data) => {
//       callback(data)
//     })
//   }
// }

// rxio.blockUser = function ({ group_id, uni, type = "block_user" }, callback) {
//   if (rxio.connected, group_id, uni) {
//     const msg = {
//       group_id: Number(group_id),
//       blocked_uin: Number(uni)
//     }
//     rxio.socket.emit(type, msg, (data) => {
//       callback && callback(data)
//     })
//   }
// }
rxio.blockUser = function ({ group_id, uni}, callback) {
  if (rxio.connected, group_id, uni) {
    const msg = {
      group_id: Number(group_id),
      blocked_uin: Number(uni)
    }
    rxio.socket.emit('block_user', msg, (data) => {
      callback && callback(data)
    })
  }
}
rxio.unblockUser = function ({ group_id, uni}, callback) {
  if (rxio.connected, group_id, uni) {
    const msg = {
      group_id: Number(group_id),
      blocked_uin: Number(uni)
    }
    rxio.socket.emit('unblock_user', msg, (data) => {
      callback && callback(data)
    })
  }
}
rxio.getUpdateGroup = function (callback) {
  if (rxio.connected) {
    rxio.socket.on('update_group', (data) => {
      // console.log('Update_group ',data)
      // console.log(data)
      callback(data)
    })
  }
}
rxio.createLink = function (group_id, callback) {
  if (rxio.connected, group_id) {
    rxio.socket.emit('create_link', {
      group_id: Number(group_id)
    }, (data) => {
      callback(data)
    })

  }
}

rxio.revokeLink = function (token, callback) {
  if (rxio.connected, token) {
    rxio.socket.emit('disable_link', {
      token: token
    }, (data) => {
      callback(data)
    })

  }
}

rxio.listGroupLink = function (group_id, callback) {
  if (rxio.connected, group_id) {
    rxio.socket.emit('list_link', {
      group_id: Number(group_id),
      pindex: 0,
      psize: 10
    }, (data) => {
      callback(data)
    })

  }
}
rxio.getWaitConnect = function (callback) {
  if (rxio.connected) {
    callback(true)
  } else {
    callback(false)
  }
}

rxio.getWaitEvent = function (callback) {
  if (rxio.connected) {
    rxio.socket.on('event', (data) => {
      console.log('Event')
      // console.log(data)
      callback(data)
    })
  }
}

rxio.getWaitGroup = function (callback) {
  if (rxio.connected) {
    rxio.socket.on('group', (data) => {
      console.log('New Group')
      callback(data)
    })
  }
}

rxio.getWaitMessDel = function (callback) {
  if (rxio.connected) {
    rxio.socket.on('delete_message', (data) => {
      console.log('Delete Message')
      // console.log(data)
      callback(data)
    })
  }
}

rxio.sendGroupEvent = function (senderID, groupID, type) {
  if (rxio.connected && senderID && groupID && type) {
    const msg = {
      group_id: senderID,
      sender_uin: groupID,
      type: type,
      data: ''
    }
    rxio.socket.emit('event', msg, (data) => {
      console.log('Push Event')
      console.log(data)
    })
  }
}
rxio.getWaitExpired = function (callback) {
  try {
    if (rxio.socket) {
      rxio.socket.on('login', (data) => {
        if (data && data.result && data.result === 2) {
          callback()
        }
      })  
    }
  } catch(e) {
    console.log(e)
  }
}

// C A L L //
// ["create_call",{"group_id":285622781010304,"caller_uin":281474976981363,"callee_uins":[281474976981363,281474976710895],"media_type":1}]
rxio.createCall = function (group, callback) {
  if (rxio.connected && group.group_id && group.caller_uin && group.callee_uins) {
    rxio.socket.emit('create_call', {
      group_id: group.group_id,
      caller_uin: group.caller_uin,
      callee_uins: group.callee_uins,
      media_type: group.media_type
    }, (data) => {
      callback(data)
    })
  }
}

// ["answer_call",{"group_id":285622781010304,"call_id":289533106833113088,"callee_uin":281474976710895,"answer":1}]
rxio.answerCall = function (group, callback) {
  if (rxio.connected && group.group_id && group.call_id && group.callee_uin) {
    rxio.socket.emit('answer_call', {
      group_id: group.group_id,
      call_id: group.call_id,
      callee_uin: group.callee_uin,
      answer: 1
    }, (data) => {
      callback(data)
    })
  }
}

// ["stop_call",{"group_id":285622781010304,"call_id":280137081500528640,"uin":281474976981363}]
rxio.stopCall = function (group, callback) {
  if (rxio.connected && group.group_id && group.uin && group.call_id) {
    rxio.socket.emit('stop_call', {
      call_id: group.call_id,
      group_id: group.group_id,
      uin: group.uin
    }, (data) => {
      callback(data)
    })
  }
}

rxio.updateMessage = function (mgs, callback) {
  if (rxio.connected && mgs.group_id && mgs.message_id && mgs.status) {
    rxio.socket.emit('update_message', {
      group_id: mgs.group_id,
      message_id: mgs.message_id,
      message: "",
      status: mgs.status
    }, (data) => {
      callback(data)
    })
  }
}

rxio.sendCallAvailable = function (group, callback) {
  if (rxio.connected) {
    rxio.socket.emit('event', {
      group_id: group.group_id,
      sender_uin: group.sender_uid,
      receiver_uin: group.receiver_uin,
      type: 8
    })
  }
}

rxio.sendCallAvailableAnswer = function (group, callback) {
  if (rxio.connected) {
    rxio.socket.emit('event', {
      group_id: group.group_id,
      sender_uin: group.sender_uid,
      receiver_uin: group.receiver_uin,
      type: 2
    })
  }
}

rxio.sendCallConnectedThisDevice = function (group, callback) {
  if (rxio.connected) {
    rxio.socket.emit('event', {
      group_id: group.group_id,
      sender_uin: group.sender_uid,
      receiver_uin: group.receiver_uin,
      type: 11
    })
  }
}

rxio.createNewGroup = function (group, callback) {
  if (rxio.connected && group && group.occupants_uins.constructor === Array && group.occupants_uins.length > 0) {
    rxio.socket.emit('create_group', {
      type: group.type,
      owner_uin: group.owner_uin,
      name: group.name,
      avatar_url: '',
      occupants_uins: group.occupants_uins,
      sender_name: group.sender_name
    }, (data) => {
      callback(data)
    })
  }
}
rxio.addAdmin = function (group, callback) {
  if (rxio.connected) {
    rxio.socket.emit('add_admin', {
      group_id: group.group_id,
      admin_uins: group.admin_uins
    }, (data) => {
      callback(data)
    })
  }
}
rxio.leaveGroup = function (group, callback) {
  if (rxio.connected) {
    rxio.socket.emit('leave_group', {
      group_id: group.group_id
    }, (data) => {
      callback(data)
    })
  }
}
rxio.deleteConversation = function (group, callback) {
  if (rxio.connected) {
    rxio.socket.emit('delete_conversation', {
      group_id: group.group_id
    }, (data) => {
      callback(data)
    })
  }
}
rxio.createMessage = function (mgs, callback) {
  if (rxio.connected) {
    rxio.socket.emit('create_message', {
      group_id: mgs.group_id,
      type: mgs.type,
      version: mgs.version,
      sender_name: mgs.sender_name,
      message: mgs.message,
      attachments: mgs.attachments
    }, (data) => {
      callback(data)
    })
  }
}
rxio.updateGroup = function (group, callback) {
  if (rxio.connected) {
    rxio.socket.emit('update_group', {
      group_id: group.group_id,
      name: group.name,
      avatar_url: group.avatar_url,
      push_all: group.push_all
    }, (data) => {
      callback(data)
    })
  }
}
rxio.pinGroup = function (group_id, callback) {
  if (rxio.connected) {
    rxio.socket.emit('pin_group', {
      group_id: group_id
    }, (data) => {
      callback(data)
    })
  }
}
rxio.unpinGroup = function (group_id, callback) {
  if (rxio.connected) {
    rxio.socket.emit('unpin_group', {
      group_id: group_id
    }, (data) => {
      callback(data)
    })
  }
}
rxio.joinLink = function (token, callback) {
  if (rxio.connected && token) {
    rxio.socket.emit('join_link', {
      token: token
    }, (data) => {
      callback(data)
    })
  }
}
// W E B R T C //
rxio.sendIceSdp = function (webrtcSdp, callback) {
  callback = callback || function () {}
  if (rxio.connected) {
    rxio.socket.emit('ice_sdp', webrtcSdp, (data) => {
      callback(data)
    })
  }
}

rxio.sendIceCandidate = function (webrtcSdp, callback) {
  callback = callback || function () {}
  if (rxio.connected) {
    rxio.socket.emit('ice_candidate', webrtcSdp, (data) => {
      callback(data)
    })
  }
}

rxio.sendCallEvent = function (event, eventCall, callback) {
  if (rxio.connected) {
    rxio.socket.emit('event', event)
    rxio.socket.emit('call_event', eventCall)
  }
}

rxio.sendContacts = function (arrContacts, callback) {
  try {
    let checkArray = false
    if (rxio && rxio.token) {
      for (let objkey of arrContacts) {
        let arrkeys = Object.keys(objkey) 
        if (arrkeys.indexOf('phone') === -1 && arrkeys.indexOf('name') === -1) {
          checkArray = true
          break
        }
      }

      if (checkArray) {
        callback(null, 'err')  
        return
      } else {
        let params = { "force":0, "contacts": arrContacts, "udid":""}
        let headers = { 'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8',  'TC-Token': rxio.token }
        if (params.contacts && params.contacts.length > 0 ) {
          fetch(global.rxu.config.address_book, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: headers }).then((res) => { return res.json() })
            .then((json) => {
              callback(json, null) 
            }).catch(er => console.log(er))
        } else {
          callback(null, 'err: Contacts Empty')  
          return
        }  
      }      
    }
  } catch(e) {
    callback(null, 'err: '+ e.message) 
  }
}

const addHandlers = function () {
  // System events
  // rxio.socket.on('message', function(data) {
  //   console.log('Messsage')
  //   console.log(data)
  // });

  // rxio.socket.on('update_message', function(data) {
  //   console.log('Update Messsage')
  //   console.log(data)
  // });

  // rxio.socket.on('user_status', function(data) {
  //   console.log('User Status')
  //   console.log(data)
  // });

  // rxio.socket.on('group', function(data) {
  //   console.log('Group')
  //   console.log(data)
  // });

  // rxio.socket.on('error', function(data) {
  //   console.log('Error')
  //   console.log(data)
  // });

  // rxio.socket.on('event', function(data) {
  //   console.log('Event')
  //   console.log(data)
  // });

  // socket?.on("delete_group") { [weak self] (data, ack) in
  //     guard let self = self else { return }
  //     if let _data = data[0] as? [String: Any], let groupID = _data["group_id"] as? String {
  //         self.delegates.forEach({ $0?.didDeleteGroup(groupID) })
  //     }
  // }
  // socket?.on("update_group") { [weak self] (data, ack) in
  //     guard let self = self else { return }
  //     if let data = self.getDataFromAck(data), let groupUpdate = try? self.decoder.decode(NTGroupUpdate.self, from: data) {
  //         self.delegates.forEach({ $0?.didUpdateGroup(NTConversation(groupUpdate: groupUpdate)) })
  //     }
  // }
  // // MARK: - Call Events
  // socket?.on("start_call") { [weak self] (data, ack) in
  //     guard let self = self else { return }
  //     if let data = self.getDataFromAck(data),
  //         let res = try? self.decoder.decode(NTCallResponse.self, from: data) {
  //         self.delegates.forEach { $0?.didReceiveCall(event: NTCallEvent.startCall(res.call)) }
  //     }
  // }
  // socket?.on("answer_call") { (data, ack) in
  //     if let data = self.getDataFromAck(data),
  //         let res = try? self.decoder.decode(NTAnswerCall.self, from: data) {
  //         self.delegates.forEach { $0?.didReceiveCall(event: NTCallEvent.answerCall(res)) }
  //     }
  // }
  // socket?.on("stop_call") { (data, ack) in
  //     if let data = self.getDataFromAck(data),
  //         let res = try? self.decoder.decode(NTStopCall.self, from: data) {
  //         self.delegates.forEach { $0?.didReceiveCall(event: NTCallEvent.stopCall(res)) }
  //     }
  // }
  // socket?.on("ice_sdp") { (data, ack) in
  //     if let data = self.getDataFromAck(data),
  //         let res = try? self.decoder.decode(NTIceSdp.self, from: data) {
  //         self.delegates.forEach { $0?.didReceiveCall(event: NTCallEvent.iceSdp(res)) }
  //     }
  // }
  // socket?.on("ice_candidate") { (data, ack) in
  //     if let data = self.getDataFromAck(data),
  //         let res = try? self.decoder.decode(NTIceCandidate.self, from: data) {
  //         self.delegates.forEach { $0?.didReceiveCall(event: NTCallEvent.iceCandidate(res)) }
  //     }
  // }
  // socket?.on("delete_conversation") { (data, ack) in
  //     if let _ = self.getDataFromAck(data) {
  //         print("delete_conversation")
  //     }
  // }
}

// rxio.initReconnectTimer = function() {
// }

// rxio.getListConversation = function(uid, page, pageSize, sort_by) {
// rxio.getListConversation = function(callback) {
//   if (rxio.connected) {
//     let msg = {
//       "uin": 281474976981363,
//       "sort_by": 1,
//       "pindex": 0, // index from 0
//       "psize": 10
//     }

//     // rxio.socket.emit('list_group', msg, function(data){
//       let data = {"result":0,"groups":[{"group_id":"285622781010304","avatar_url":"","name":"","type":3,"owner_uin":"281474976981363","creator_uin":"281474976981363","occupants_uins":["281474976981363","281474976710895"],"created_at":"1599642348","updated_at":"0","last_message_id":"273644758776201233","blocked_uins":[],"removed_uins":[],"muted_uins":[],"last_active_messages":[],"pinned_uins":[],"last_message":{"message_id":"273644758776201233","group_id":"285622781010304","message":"hello3","sender_uin":"281474976710895","created_at":"1600074900841990","updated_at":"0","status":0,"recipient_uins":["281474976981363","281474976710895"],"received_uins":[],"seen_uins":["281474976710895"],"deleted_uins":[],"type":0,"attachments":"","group_name":"","group_avatar":"","sender_name":"Long","sender_avatar":"GpANDOdb8XFsKO7v0pXTam8f7gsM2nLPDiSyn7FX1Sztc-2p2D9W3lM3sMjP4rv4","group_type":3,"nonce":"","version":0},"received_list":[{"uin":"281474976981363","message_id":"273644758776201233"},{"uin":"281474976710895","message_id":"273644758776201233"}],"seen_list":[{"uin":"281474976981363","message_id":"273644758776201233"},{"uin":"281474976710895","message_id":"273644758776201233"}],"status_list":[{"uin":"281474976981363","online_status":1,"message_status":"","last_seen_at":0},{"uin":"281474976710895","online_status":2,"message_status":"","last_seen_at":1600078113}],"last_messages":[],"unread_cnt":0}]}
//       if (data && data.groups && data.groups.constructor === Array && data.groups.length > 0) {
//         // rxio.groups =
//         callback(data.groups)
//       }
//     // });
//   }
// }

//     // MARK: - LOGIN
//     public func login(token: String, uin: Int) {
//         self.token = token
//         self.uin = uin
//         self.manager = SocketManager(socketURL: baseURL, config: [.forceWebsockets(true), .log(false), .compress, .connectParams(["session": token])])
//         self.manager.reconnects = false
//         self.socket = manager.socket(forNamespace: "/data")
//         self.socket?.connect()
//         self.addHandlers()
//         self.initReconnectTimer()
//     }

//     public func setBaseUrl(_ url: URL) {
//         self.baseURL = url
//     }

//     public func runNowOrWhenSDKReady(task: @escaping NTTask) {
//         if isReady {
//             task(true)
//         } else {
//             self.listTasks.append(task)
//         }
//     }

//     private func completeUndoneTasks() {
//         for task in listTasks {
//             task(true)
//         }
//         self.listTasks = []
//     }

//     private func initReconnectTimer() {
//         self.reconnectTimer?.invalidate()
//         self.reconnectTimer = Timer.scheduledTimer(timeInterval: reconnectInterval, target: self, selector: #selector(self.reconnectFired), userInfo: nil, repeats: true)
//     }

//     @objc func reconnectFired() {
//         self.reconnectIfNeed()
//     }

//     // MARK: - LOGOUT
//     public func logout() {
//         self.disconnect()
//         self.delegates.removeAll()
//         self.socket = nil
//     }

//     public func reconnectIfNeed() {
//         guard self.socket !== nil else { return }
//         if
//             self.socket?.status !== .connected &&
//             self.socket?.status !== .connecting {

//             self.socket?.connect()
//         }
//     }

//     public func disconnect() {
//         self.isReady = false
//         guard self.socket !== nil else { return }
//         self.socket?.disconnect()

// //        self.reconnectTimer?.invalidate()
// //        self.reconnectTimer = nil
//     }

//     public func connectChat(channelID: String) {
//         self.reconnectIfNeed()
//     }

//     public var isConnected: Bool {
//         return socket?.status === .connected
//     }

//     // MARK: - Send Call Events
//     public func createCall(event: NTCallEvent, completion: NTCompletion<NTCallEvent>?) {

//         let msg = event.toDictionary()

//         socket?.emitWithAck(event.type(), msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - create_message failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion?(.failure(NTError.parsingFailed))
//                 return
//             }

//             if let result = data.toJsonString {
//                 print("NetaloSDK - create_message result: \(result)")
//             }

//             if case NTCallEvent.createCall = event,
//                 let res = try? self.decoder.decode(NTCallResponse.self, from: data)
//             {
//                 completion?(.success(NTCallEvent.createCall(res.call)))
//             }
//         }
//     }

//     public func send(event: NTCallEvent, for callId: String, senderUin: String, receiverUin: String, completion: NTCompletion<NTCallEvent>? = nil) {
// //        guard case IMCallEvent.iceCandindate = event else { return }

//         var msg: [String: Any] = [:]

//         if case NTCallEvent.stopCall = event {
//             msg["call_id"] = callId
//             msg["uin"] = senderUin
//         }

//         if case NTCallEvent.iceSdp(let data) = event {
//             msg = [
//                 "call_id": callId,
//                 "sender_uin": senderUin,
//                 "receiver_uin": receiverUin,
//                 "type": data.type,
//                 "sdp": data.sdp,
//             ]
//         }

//         if case NTCallEvent.iceCandidate(let data) = event {
//             msg = [
//                 "call_id": callId,
//                 "sender_uin": senderUin,
//                 "receiver_uin": receiverUin,
//                 "candidate": data.candidate,
//                 "sdp_mid": data.sdpMid,
//                 "sdp_mline_index": data.sdpMlineIndex,
//             ]
//         }

//         if case NTCallEvent.answerCall(let data) = event {
//             msg = [
//                 "call_id": callId,
//                 "callee_uin": Int(data.calleeUin) ?? 0,
//                 "answer": data.type,
//             ]
//         }

//         if case NTCallEvent.customEvent(let data) = event {
//             msg = [
//                 "sender_uin": senderUin,
//                 "receiver_uin": receiverUin,
//                 "type": data.type,
//                 "data": data.data,
//             ]
//         }

//         socket?.emit(event.type(), msg)
//     }

//     // MARK: - DELEGATES
//     public func addDelegate(_ delegate: NetaloDelegate) {
//         self.delegates.append(delegate)
//     }

//     public func removeDelegate(_ delegate: NetaloDelegate) {
//         self.delegates.removeAll(where: { $0 === delegate })
//     }

//     // MARK: - REGISTER FCM TOKEN
//     public func registerFCMToken(uin: Int, token: String, type: NTDefines.TokenType, completion: NTCompletion<String>?) {
//         let msg: [String: Any] = [
//             "uin": uin,
//             "type": type.rawValue,
//             "token": token
//         ]

//         print("NetaloSDK - register_profile_token: \(token)")

//         socket?.emitWithAck("register_profile_token", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 completion?(NTResult.failure(.parsingFailed))
//                 return
//             }

//             if let result = data.toJsonString {
//                 print("NetaloSDK - register_profile_token result: \(result)")
//                 completion?(.success(result))
//             } else {
//                 completion?(.failure(NTError.parsingFailed))
//             }

//         }
//     }

//     public func unregisterFCMToken(uin: Int, token: String, type: NTDefines.TokenType, completion: NTCompletion<String>?) {
//         let msg: [String: Any] = [
//             "uin": String(uin),
// //            "type": type.rawValue,
//             "token": token
//         ]

//         print("NetaloSDK - unregister_profile_token: \(token)")

//         socket?.emitWithAck("unregister_profile_token", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 completion?(NTResult.failure(.parsingFailed))
//                 return
//             }

//             if let result = data.toJsonString {
//                 print("NetaloSDK - register_profile_token result: \(result)")
//                 completion?(.success(result))
//             } else {
//                 completion?(.failure(NTError.parsingFailed))
//             }

//         }
//     }

//     // MARK: - CREATE GROUP
//     public func createGroup(group: NTConversation, completion: NTCompletion<NTConversation>?) {
//         var _occupantUins = group.occupantsUins
//         _occupantUins.append(group.ownerUin)

//         let msg: [String: Any] = [
//             "type": group.type,
//             "owner_uin": group.ownerUin,
//             "occupants_uins": _occupantUins,
//             "name": group.name,
//             "avatar_url": group.avatarUrl,
//         ]

//         socket?.emitWithAck("create_group", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - create_group failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion?(NTResult.failure(.parsingFailed))
//                 return
//             }

//             do {
//                 let response = try self.decoder.decode(NTConversationResponse.self, from: data)

//                 if response.codeCheck() {
//                     completion?(.success(response.conversation))
//                 } else {
//                     completion?(NTResult.failure(.failed))
//                 }

//             } catch {
//                 completion?(NTResult.failure(.failed))
//             }

//         }
//     }

//     // MARK: - UPDATE GROUP
//     public func updateGroup(group: NTConversation,
//                             addedUins: [String]? = nil,
//                             removedUins: [String]? = nil,
//                             completion: NTCompletion<NTConversation>?) {
//         var msg: [String: Any] = [
//             "group_id": group.groupID,
//             "push_all": addedUins ?? [],
//             "pull_all": removedUins ?? [],
//         ]

//         if group.name.count > 0 {
//             msg["name"] = group.name
//         }

//         if group.avatarUrl.count > 0 {
//             msg["avatar_url"] = group.avatarUrl
//         }

//         if group.ownerUin.count > 0 {
//             msg["owner_uin"] = group.ownerUin
//         }

//         socket?.emitWithAck("update_group", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - update_group failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion?(NTResult.failure(.parsingFailed))
//                 return
//             }

//             do {
//                 let response = try self.decoder.decode(NTConversationResponse.self, from: data)

//                 if response.codeCheck() {
//                     completion?(.success(response.conversation))
//                 } else {
//                     completion?(NTResult.failure(.failed))
//                 }

//             } catch {
//                 completion?(NTResult.failure(.failed))
//             }
//         }
//     }

//     // MARK: - DELETE GROUP
//     public func deleteGroup(groupID: String, completion: NTCompletion<String>?) {
//         let msg: [String: Any] = [
//             "group_id": groupID
//         ]

//         socket?.emitWithAck("delete_group", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - delete_group failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion?(NTResult.failure(.parsingFailed))
//                 return
//             }

//             if let dict = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any], let code = dict?["result"] as? Int {
//                 if code === 0 {
//                     completion?(.success("Success"))
//                 } else {
//                     completion?(NTResult.failure(NTError(code: code)))
//                 }
//             }
//         }
//     }

//     // MARK: - DELETE GROUP
//     public func deleteConversation(conversationId: String, completion: NTCompletion<String>?) {
//         let msg: [String: Any] = [
//             "group_id": conversationId
//         ]

//         socket?.emitWithAck("delete_conversation", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - delete_group failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion?(NTResult.failure(.parsingFailed))
//                 return
//             }

//             if let dict = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any], let code = dict?["result"] as? Int {
//                 if code === 0 {
//                     completion?(.success("Success"))
//                 } else {
//                     completion?(NTResult.failure(NTError(code: code)))
//                 }
//             }
//         }
//     }

//     // MARK: - LEAVE GROUP
//     public func leaveGroup(groupID: String, completion: NTCompletion<String>?) {
//         let msg: [String: Any] = [
//             "group_id": groupID
//         ]

//         socket?.emitWithAck("leave_group", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - leave_group failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion?(NTResult.failure(.parsingFailed))
//                 return
//             }

//             if let dict = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any], let code = dict?["result"] as? Int {
//                 if code === 0 {
//                     completion?(.success("Success"))
//                 } else {
//                     completion?(NTResult.failure(NTError(code: code)))
//                 }
//             }
//         }
//     }

//     // MARK: - GET LIST MESSAGE
//     public func getListMessage(groupID: String, lastMessageID: String, page: Int, pageSize: Int, completion: @escaping NTCompletion<NTMessageList>) {
//         var msg: [String: Any] = [
//             "group_id": groupID,
//             "pindex": page,
//             "psize": pageSize
//         ]

//         if lastMessageID.count > 0 {
//             msg["last_message_id"] = lastMessageID
//         }

//         socket?.emitWithAck("list_message", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - list_message failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion(NTResult.failure(.parsingFailed))
//                 return
//             }

//             do {
//                 let response = try self.decoder.decode(NTMessageList.self, from: data)
//                 if response.codeCheck() {
//                     completion(.success(response))
//                 } else {
//                     completion(NTResult.failure(.failed))
//                 }

//             } catch {
//                 completion(NTResult.failure(.failed))
//             }

//         }
//     }

//     // MARK: - SEND MESSAGE
//     public func sendMessage(_ message: NTMessage, completion: @escaping NTCompletion<NTMessage>) {
//         var msg: [String: Any] = [
//             "group_id": message.groupID,
//             "message": message.message,
//             "sender_name": message.senderName,
//             "sender_avatar": message.senderAvatar,
//             "nonce": message.messageID
//         ]

//         if message.messageType !== .text {
//             msg["type"] = message.type
//             msg["attachments"] = message.attachments.escapedString
//                 .replacingOccurrences(of: "\\\\", with: "\\\\\\")
//         }

//         socket?.emitWithAck("create_message", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - create_message failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion(.failure(NTError.parsingFailed))
//                 return
//             }

//             do {
//                 let response = try self.decoder.decode(NTMessageResponse.self, from: data)

//                 if response.codeCheck(), let message = response.message {
//                     completion(.success(message))
//                 } else {
//                     if response.duplicateCode() {
//                         completion(NTResult.failure(.duplicate))
//                     } else {
//                         completion(NTResult.failure(.failed))
//                     }
//                 }

//             } catch {
//                 completion(NTResult.failure(.failed))
//             }

//         }
//     }

//     // MARK: - UPDATE MESSAGE
//     public func updateMessage(message: NTMessage,
//                               status: Int,
//                               completion: @escaping NTCompletion<NTMessage>) {
//         let msg: [String: Any] = [
//             "group_id": message.groupID,
//             "message_id": message.messageID,
//             "message": message.message,
//             "status": status
//         ]

//         socket?.emitWithAck("update_message", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - update_message failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion(.failure(NTError.parsingFailed))
//                 return
//             }

//             do {
//                 let response = try self.decoder.decode(NTMessageResponse.self, from: data)

//                 if response.codeCheck(), let message = response.message {
//                     completion(.success(message))
//                 } else {
//                     completion(NTResult.failure(.failed))
//                 }

//             } catch {
//                 completion(NTResult.failure(.parsingFailed))
//             }

//         }
//     }

//     // MARK: - DELETE MESSAGE
//     public func deleteMessage(_ messageID: String, completion: @escaping NTCompletion<String>) {
//         let msg: [String: Any] = [
//             "message_id": messageID
//         ]

//         socket?.emitWithAck("delete_message", msg).timingOut(after: defaultTimeout) { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - delete_message failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion(.failure(NTError.parsingFailed))
//                 return
//             }

//             if let result = data.toJsonString {
// //                print("NetaloSDK - delete_message result: \(result)")
//                 completion(.success(result))
//             } else {
//                 completion(.failure(NTError.parsingFailed))
//             }

//         }
//     }

//     // MARK: - SEND GROUP EVENT
//     public func sendGroupEvent(senderID: String, event: NTGroupEvent) {
//         let msg: [String: Any] = [
//             "group_id": event.groupID,
//             "sender_uin": senderID,
//             "type": event.kind.type(),
//         ]
//         self.socket?.emit("event", msg)
//     }

//     // MARK: - MUTE/UNMUTE group
//     public func muteGroup(groupID: String, isMute: Bool, completion: @escaping NTCompletion<Bool>) {
//         let msg: [String: Any] = [
//             "group_id": groupID
//         ]
//         let eventName = isMute ? "mute_group" : "unmute_group"
//         print("NetaloSDK - \(eventName), group_id: \(groupID)")

//         self.socket?.emitWithAck(eventName, msg).timingOut(after: defaultTimeout, callback: { [weak self] (ack) in
//             guard let self = self else { return }
//             guard let data = self.getDataFromAck(ack) else {
//                 print("NetaloSDK - \(eventName) failed with error: \(NTError.parsingFailed.localizedDescription)")
//                 completion(.failure(NTError.parsingFailed))
//                 return
//             }

//             do {
//                 if let dictionary = try JSONSerialization.jsonObject(with: data, options: .fragmentsAllowed) as? [String: Any], let code = dictionary["result"] as? Int {
//                     completion(.success(code === 0))
//                 } else {
//                     completion(.failure(NTError.parsingFailed))
//                 }
//             } catch {
//                 completion(.failure(NTError.parsingFailed))
//             }
//         })
//     }

export default rxio
