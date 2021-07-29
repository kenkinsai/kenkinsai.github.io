/* global navigator, RTCSessionDescription, RTCIceCandidate, RTCPeerConnection */
import { connect } from 'react-redux'
import * as Jsx from './rxCall.jsx'

const RxComponent = global.rootRequire('components/shares/rxComponent').default
const { rxaget, secondsToTime } = global.rootRequire('classes/ulti')

const { netaCallHistoryUpdate, changeStatusTabmore } = global.rootRequire('redux')
const rxio = global.rootRequire('classes/socket').default

const iceServers = {
  iceServers: [{
    urls: ['turn:turn1.netalo.vn:3478'],
    username: 'developer',
    credential: 'password'
  }, {
    urls: ['stun:stun1.netalo.vn:3478'],
    username: 'developer',
    credential: 'password'
  }]
}

let mediaConstraints = {
  audio: true,
  video: true,
}

class Component_ extends RxComponent {
  constructor(props, context) {
    super(props, context, Jsx)
    this.state = {
      group: rxaget(this.props, 'group', {}),

      flagCalling: false,
      ringtone: false,
      flagStartCall: false,
      isStarted: false,
      flagMic: true,
      flagCamera: false,

      seconds: 0,
      time: {h:'00',m:'00',s:'00'}
    }

    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    this.users = rxaget(this.props, 'user.users', {}) || {}
    this.type = rxaget(this.props, 'type', '')

    this.localStream = null
    this.remoteStream = null
    this.rtcPeerConnection = null
    this.timer = null
    this.timeoutCounter = null
    this.secondsCounter = 0
    
    this.isRoomCreator = false
    
    this.callObj = {}

    this.setRemoteStream = this.setRemoteStream.bind(this)
    this.sendIceCandidate = this.sendIceCandidate.bind(this)
  }

  componentDidMount() {
    this.loadHandleSocket()  
  }

  componentDidUpdate (prevProps, prevState) {
    if ((rxaget(this.props, 'netaCall.status', '') !== rxaget(prevProps, 'netaCall.status', '')) && ['voicecall', 'videocall'].indexOf(rxaget(this.props, 'netaCall.type_call', '')) !== -1) {
      let typecall = (rxaget(this.props, 'netaCall.type_call', '') === 'videocall') ? 2 : 1
      let grouptmp = rxaget(this.props, 'netaCall.payload', {})
      this.onClickStartCall(typecall, grouptmp)
    }
  }

  loadHandleSocket() {
    rxio.getWaitConnect((data) => {
      if (rxio.connected) {
        rxio.socket.on('event', async (data) => {
          if (data.type === 5) {
            if (this.state.flagStartCall && this.callObj && this.callObj.media_type && this.callObj.media_type === 1) {
              this.setState({flagCamera: true}, () => {
                if (this.state.flagStartCall && this.callObj && this.callObj.media_type) {
                  const receiverUin = (this.userid.toString() === rxaget(data, 'sender_uin', "")) ? rxaget(data, 'receiver_uin', "") : this.userid.toString()
                  rxio.socket.emit('event', {
                    group_id: rxaget(data, 'group_id', ''),
                    sender_uin: this.userid,
                    receiver_uin: Number(receiverUin),
                    type: 7
                  }, (data1) => {})  
                }
              })
            }
          }

          if (data.type === 7) {
            if (this.state.flagStartCall && this.callObj && this.callObj.media_type && this.callObj.media_type === 1) {
              const receiverUin = (this.userid.toString() === rxaget(data, 'sender_uin', "")) ? rxaget(data, 'receiver_uin', "") : this.userid.toString()
              rxio.socket.emit('event', {
                group_id: rxaget(data, 'group_id', ''),
                sender_uin: this.userid,
                receiver_uin: Number(receiverUin),
                type: 7
              }, (data1) => {}) 
            }      
          }

          if (data.type === 8) {
            rxio.sendCallAvailableAnswer({
              group_id: rxaget(data, 'group_id', ""),
              sender_uid: rxaget(data, 'sender_uin', ""),
              receiver_uin: rxaget(data, 'receiver_uin', ""),
              type: 2
            })
          }

          if (data.type === 9) {
          }

          if (data.type === 10) {
            // if (this.call_id) {
            //   rxio.socket.emit('call_status', { group_id: data.group_id, call_id: this.call_id }, (data) => {
            //     if (data.status === 1 && data.result === 0) {
            //       this.setState({ call_answer: true })
            //       const receiverUin = global.rxu.get(global.rxu.array(this.state.objsCalling.callee_uins).filter(ele => (ele !== this.userid)), [0])
            //       rxio.socket.emit('event', {
            //         group_id: data.group_id,
            //         sender_uin: this.userid.toString(),
            //         receiver_uin: receiverUin,
            //         type: 4,
            //         data: ''
            //       }, (data1) => {})
            //       rxio.socket.emit('event', {
            //         group_id: data.group_id,
            //         sender_uin: this.userid.toString(),
            //         receiver_uin: receiverUin,
            //         type: 8,
            //         data: ''
            //       }, (data2) => {})
            //     }
            //   })
            // }
          }
        })

        // Nhận cuộc gọi
        rxio.socket.on('start_call', async (data) => {
          if (!this.state.flagCalling) {
            // Load local Stream First
            try {
              this.callObj = rxaget(data, 'call', {})
            
              this.setState({flagCalling: true, ringtone: true}, async () => {
                this.localVideoComponent = document.getElementById('local-video')
                this.remoteVideoComponent = document.getElementById('remote-video')

                await this.setLocalStream(mediaConstraints)
              })
            } catch(e) {}
          }
        })

        // Nhận offer
        rxio.socket.on('ice_sdp', async (event) => {
          // console.log('Socket event callback: offer')
          try {
            if (this.state.flagStartCall) {
              if (event.sdp) {
                if (!this.isRoomCreator) {
                  this.rtcPeerConnection = new RTCPeerConnection(iceServers)
                  this.addLocalTracks(this.rtcPeerConnection)
                  this.rtcPeerConnection.ontrack = this.setRemoteStream
                  this.rtcPeerConnection.onicecandidate = this.sendIceCandidate
                  this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({type: 'offer', sdp: event.sdp }))
                  await this.createAnswer(this.rtcPeerConnection)
                } else {
                  if (this.rtcPeerConnection) {
                    this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({type: 'answer', sdp: event.sdp }))  
                  } 
                }  
              }  
            } else {
              this.stopStream()
            }
            
          } catch(e) {}
        })

        // Nhận answer
        rxio.socket.on('answer_call', (event) => {
          // console.log('Socket event callback: webrtc_answer')
          try {
            this.setState({isStarted: true, ringtone: false, flagStartCall: true}, async () => {
              if (this.isRoomCreator) {
                this.rtcPeerConnection = new RTCPeerConnection(iceServers)
                this.addLocalTracks(this.rtcPeerConnection)
                this.rtcPeerConnection.ontrack = this.setRemoteStream
                this.rtcPeerConnection.onicecandidate = this.sendIceCandidate

                await this.createOffer(this.rtcPeerConnection)  
                this.startTimer()            
              }  
            })
          } catch(e) {}
        })

        // Nhận stop call
        rxio.socket.on('stop_call', (event) => {
          this.stopStream()  
        })

        // Nhan Candidate
        rxio.socket.on('ice_candidate', (event) => {
          // console.log('Socket event callback: webrtc_ice_candidate')
          // ICE candidate configuration.
          if (this.state.flagStartCall) {
            try {
              var candidate = new RTCIceCandidate({
                sdpMid: event.sdp_mid,
                sdpMLineIndex: event.sdp_mline_index,
                candidate: event.candidate,
              })
              if (this.rtcPeerConnection) {
                this.rtcPeerConnection.addIceCandidate(candidate)  
              }
            } catch(e) {}  
          } else {
            this.stopStream()
          }
        })    
      } else {
        setTimeout(() => {
          this.loadHandleSocket()  
        }, 300)
      }
    })
  }

  // Gọi đi
  async onClickStartCall(type, grouptmp) { 
    type = type || 2
    this.isRoomCreator = true
    let arrUser = rxaget(grouptmp, 'occupants_uins', [])
    if (arrUser.length === 2) {
      let remoteUser = arrUser.filter(uid => uid !== this.userid)[0]

      if(remoteUser !== '' && remoteUser !== this.userid){
        let ele = grouptmp || {}
        ele.callee_uins = arrUser.filter(uid => uid.toString() !== this.userid.toString())
        ele.caller_uin = this.userid
        ele.media_type = type

        rxio.createCall(ele, (data) => {
          // Load local Stream First
          this.callObj = rxaget(data, 'call', {})
          
          this.setState({flagCalling: true, ringtone: true}, async () => {
            this.localVideoComponent = document.getElementById('local-video')
            this.remoteVideoComponent = document.getElementById('remote-video')

            await this.setLocalStream(mediaConstraints)


            this.startTimeoutCounter()

            // setTimeout(() => { if (!this.state.isStarted) { this.onClickStopCall() } }, 30000)
          })
        })

      } else {
        console.log('Remote user not exist')
      }
    } 
  }

  // Chấp nhận cuộc gọi
  acceptCall() {
    if (this.callObj && this.callObj.callee_uins && this.callObj.callee_uins.constructor === Array && this.callObj.callee_uins.length === 2) {
      rxio.socket.emit('answer_call', {
        group_id: rxaget(this.callObj, 'group_id', ''),
        call_id: rxaget(this.callObj, 'call_id', ''),
        callee_uin: this.userid.toString(),
        answer: 1
      }, () => {})
            
      this.setState({ringtone: false, flagStartCall: true, isStarted: true}, () => {
        this.startTimer()
      })  
    }
  }

  stopStream() {
    try {
      clearInterval(this.timer)  
      this.timer = null
    } catch(e) {}

    try {
      if (this.localStream) {
        const tracks =  this.localStream.getTracks()
        tracks.forEach(function (track) { track.stop() })
        this.localStream = null  
      }
    } catch(e) {}

    try {
      if (this.remoteStream) {
        const remotetracks =  this.remoteStream.getTracks()
        remotetracks.forEach(function (track) { track.stop() })
        this.remoteStream = null  
      }
    } catch(e) {}
    
    if (this.rtcPeerConnection) {
      this.rtcPeerConnection.close() 
      this.rtcPeerConnection = null
    }

    this.isRoomCreator = false
    this.callObj = {}

    this.stopTimeoutCounter()

    this.setState({ringtone: false, flagCalling: false, flagStartCall: false, isStarted: false, seconds: 0, flagMic: true, flagCamera: false, time: {h:'00',m:'00',s:'00'} })
  }

  // Kết thục cuộc gọi
  onClickStopCall() {
    const params = {
      group_id: rxaget(this.callObj, 'group_id', ''),
      uin: this.userid,
      call_id: rxaget(this.callObj, 'call_id', ''),
    }
    
    rxio.stopCall(params, (data) => {})

    try {
      if (!this.state.flagStartCall) {
        // const receiverUin = global.rxu.array(rxaget(this.callObj, 'callee_uins', [])).filter(ele => (ele !== this.userid.toString()))[0]

        let paramsupdate = {
          group_id: rxaget(this.callObj, 'group_id', ''),
          message_id: rxaget(this.callObj, 'message_id', ''),
          message: '',
          status: 2
        }
        rxio.updateMessage(paramsupdate, (dataMsg1) => {       
        })

        paramsupdate['status'] = 3
        rxio.updateMessage(paramsupdate, (dataMsg2) => {})

        rxio.socket.emit('event', {
          group_id: rxaget(this.callObj, 'group_id', ''),
          sender_uin: this.userid,
          type: 9
        }, (data1) => {})
        rxio.socket.emit('event', {
          group_id: rxaget(this.callObj, 'group_id', ''),
          sender_uin: this.userid,
          type: 10
        }, (data1) => {})  
      }
    } catch(e) {}

    this.stopStream()

    
    


    try {
      if (this.type === 'callfunc') {
        this.props.stopCall()  
      } 
    } catch(e) {
      console.log(e)
    }
    
  }

  // Count time
  startTimer() {
    this.stopTimeoutCounter()
    setTimeout(() => {
      if (this.state.seconds === 0) {
        this.timer = setInterval(() => {this.countUp()}, 1000)
      }
    }, 1000)
  }

  countUp() {
    let seconds = this.state.seconds + 1;
    this.setState({
      time: secondsToTime(seconds),
      seconds: seconds,
    })
  }

  startTimeoutCounter() {
    setTimeout(() => {
      if (this.secondsCounter === 0) {
        this.timeoutCounter = setInterval(() => {
          this.secondsCounter += 1

          if (this.secondsCounter > 30) {
            this.onClickStopCall()
          }
        }, 1000)
      }
    }, 1000)
  }

  stopTimeoutCounter() {
    try {
      clearInterval(this.timeoutCounter)
      this.timeoutCounter = null
    } catch(e) {
      console.log(e)
    }  

    this.secondsCounter = 0
  }

  getAvatar(e, user) {
    if (user.profile_url) {
      e.target.src=global.rxu.config.get_static + user.profile_url  
    } else {
      e.target.src='./images/default/static/avadefault.svg'
    }
  }

  // Fuction Handle Stream
  async setLocalStream(mediaConstraints) {
    let stream
    try {
      navigator.permissions.query({name: 'microphone'}).then((permissionObj) => {
        if (permissionObj.state === 'denied') {
          alert('This app don\'t currently have permission to access your microphone. Allow this app to access your microphone.')
        }
      }).catch((error) => {})

      navigator.permissions.query({name: 'camera'}).then((permissionObj) => {
        if (permissionObj.state === 'denied') {
          alert('This app don\'t currently have permission to access your camera. Allow this app to access your camera.')
        }
      }).catch((error) => {})

      stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
    } catch (error) {
      console.error('Could not get user media', error)
    }

    try {
      this.localStream = stream
      this.localVideoComponent.srcObject = stream
    } catch(e) {}
  }

  addLocalTracks(rtcPeerConnection) {
    try {
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          rtcPeerConnection.addTrack(track, this.localStream)
        })  
      }
    } catch(e) {}
  }

  async createOffer(rtcPeerConnection) {
    let sessionDescription
    try {
      sessionDescription = await rtcPeerConnection.createOffer()
      rtcPeerConnection.setLocalDescription(sessionDescription)
    } catch (error) {
      console.error(error)
    }

    let sender_uin = this.userid.toString()
    rxio.sendIceSdp({
      group_id: rxaget(this.callObj, 'group_id', ''),
      call_id: rxaget(this.callObj, 'call_id', ''),
      sender_uin: sender_uin,
      receiver_uin: global.rxu.array(rxaget(this.callObj, 'callee_uins', [])).filter(ele => (ele !== sender_uin))[0],
      type: 1,
      sdp: sessionDescription.sdp
    })
  }

  async createAnswer(rtcPeerConnection) {
    let sessionDescription
    try {
      sessionDescription = await rtcPeerConnection.createAnswer()
      rtcPeerConnection.setLocalDescription(sessionDescription)
    } catch (error) {
      console.error(error)
    }

    let sender_uin = this.userid.toString()
    rxio.sendIceSdp({
      group_id: rxaget(this.callObj, 'group_id', ''),
      call_id: rxaget(this.callObj, 'call_id', ''),
      sender_uin: sender_uin,
      receiver_uin: global.rxu.array(rxaget(this.callObj, 'callee_uins', [])).filter(ele => (ele !== sender_uin))[0],
      type: 2,
      sdp: sessionDescription.sdp
    })

    rxio.socket.emit('call_event', {
      group_id: rxaget(this.callObj, 'group_id', ''),
      call_id: rxaget(this.callObj, 'call_id', ''),
      event: 2
    }, (data) => {})
  }

  setRemoteStream(event) {
    try {
      if (this.remoteVideoComponent) {
        this.remoteVideoComponent.srcObject = event.streams[0]
        this.remoteStream = event.stream    
      }
    } catch(e) {}
  }

  sendIceCandidate(event) {
    if (event.candidate) {
      let sender_uin = this.userid.toString()
      rxio.sendIceCandidate({
        call_id: rxaget(this.callObj, 'call_id', ''),
        group_id: rxaget(this.callObj, 'group_id', ''),
        receiver_uin: global.rxu.array(rxaget(this.callObj, 'callee_uins', [])).filter(ele => (ele !== sender_uin))[0],
        sdp_mline_index: event.candidate.sdpMLineIndex,
        sender_uin: sender_uin,
        candidate: event.candidate.candidate
      })
    }
  }

  changeFlagMic() {
    let flagMic = this.state.flagMic
    this.setState({flagMic: !flagMic}, () => {
      try {
        this.localStream.getAudioTracks()[0].enabled = !flagMic
      } catch(e) {}
    })
  }

  changeFlagCamera() {
    let flagCamera = this.state.flagCamera
    this.setState({flagCamera: !flagCamera}, () => {
      if (this.state.flagStartCall && this.callObj && this.callObj.media_type === 1) {
        try {
          const receiverUin = global.rxu.array(rxaget(this.callObj, 'callee_uins', [])).filter(ele => (ele !== this.userid.toString()))[0]
          if (flagCamera) {
            rxio.socket.emit('event', {
              group_id: rxaget(this.callObj, 'group_id', ''),
              sender_uin: this.userid,
              receiver_uin: Number(receiverUin),
              type: 6
            }, (data1) => {})  
          } else {
            rxio.socket.emit('event', {
              group_id: rxaget(this.callObj, 'group_id', ''),
              sender_uin: this.userid,
              receiver_uin: Number(receiverUin),
              type: 5
            }, (data1) => {})  
          }          
        } catch(e) {}
      }
    })
  }

  render() {
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({
  themeValue: state.themeValue,
  langValue: state.langValue,
  rxgroup: state.rxgroup,
  user: state.user,
  netaauth: state.netaauth,
  netaCallHistory: state.netaCallHistory,
  netaCall: state.netaCall
})

const mapDispatchToProps = {
  netaCallHistoryUpdate,  
  changeStatusTabmore
}

const ComponentWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default ComponentWrapped
