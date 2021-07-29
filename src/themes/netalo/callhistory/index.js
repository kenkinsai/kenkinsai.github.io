/*eslint-disable no-undef*/
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'

import * as Jsx from './index.jsx'
/* global translate*/
const rxio = global.rootRequire('classes/socket').default
const RxComponent = global.rootRequire('components/shares/rxComponent').default
const rxu = global.rxu
const { rxaget, rxChangeSlug,changeTheme } = global.rootRequire('classes/ulti')
const { rxnavToggle, rxnavClose, netaCallHistoryUpdate, setComp, clickCall } = global.rootRequire('redux')
const { rxgetLocal } = global.rootRequire('classes/request')
const dHeaders = { Accept: 'application/json', 'Content-Type': 'application/json; charset=utf-8' }
const themeData = global.rootRequire('classes/themeData.json')
const { checkNameUser } = global.rootRequire('classes/chat')

function fmtMSS (s) { return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s }
class Component_ extends RxComponent {
  constructor (props, context) {
    super(props, context, Jsx)
    this.state = global.rootContext(this.props.staticContext) || {
      listCallLog: [],
      flagCalling: 0,
      objsCalling: {},
      callType: 0, 
      flagTurnOffSoundCall: false,
      callHistorySearch: rxaget(this.props, 'netaCallHistory.data', []),
      callHistory: rxaget(this.props, 'netaCallHistory.data', []),      
      groupinfo: rxaget(global.rxu.json(rxgetLocal('netaGroups'), {}), 'groups') || {},
      usersinfo: rxaget(global.rxu.json(rxgetLocal('rxusers'), {}), 'users') || {},
      flagcall: false,
      flagindex: -1,
      flaggroup: {},
      callRightMouse: {}
    }
    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    this.peerConnection = {}
    this.localStream = {}
    this.call_id = 0
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
    const themeBackGround = global.rxu.json(rxgetLocal('netaThemeBackGround'), '')

    if (themeBackGround === 'darkTheme'){
      changeTheme(themeData.nightTheme)
    } else {
      changeTheme(themeData.defaultTheme) 
    }    

    this.fetchData()

  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onClickStartCallRender(e, ele, index) {
    let flaggroup = {
      group_id: ele.group_id,
      occupants_uins: ele.callee_uins,
      media_type: ele.media_type
    }

    this.setState({flagcall: true, flagindex: index, flaggroup: flaggroup}, () => {
      let typeCall = 'voicecall'
      if (ele.media_type === 2) {
        typeCall = 'videocall'
      }

      this.props.clickCall(typeCall, {
        group_id: rxaget(ele, 'group_id', '' ).toString(),
        type: rxaget(ele, 'type', 0 ),
        occupants_uins: rxaget(ele, 'callee_uins', [] )
      })
    })
  }

  onClickStopCallRender() {
    this.setState({flagcall: false, flagindex: -1})
  }

  localDescCreated (desc) {
    const callObj = this.state.objsCalling
    this.peerConnection.setLocalDescription(
      desc,
      () => rxio.sendIceSdp({
        group_id: callObj.group_id,
        call_id: callObj.call_id,
        sender_uin: callObj.caller_uin,
        receiver_uin: callObj.callee_uins.filter(ele => (ele !== callObj.caller_uin))[0],
        type: 1,
        sdp: this.peerConnection.localDescription.sdp
      }),
      () => { }
    )
  }

  onChangeSearch (e) {
    let value = e.target.value
    if(value.startsWith('0')){
      value = value.replace(value.charAt(0), '+84')
    }
    const _usersinfo = this.state.usersinfo
    const arrCallHistory = this.state.callHistorySearch.filter(o => {
      const callId = rxaget(o.callee_uins.filter((id) => (id !== rxaget(this.props, 'netaauth.user.id'))), [0] )
      const uname = checkNameUser(rxaget(_usersinfo, [callId],translate('Stranger')))
      const uname_info = rxaget(_usersinfo, [callId],translate('Stranger'))
      if (rxChangeSlug(uname).indexOf(rxChangeSlug(value)) !== -1 || rxChangeSlug(uname_info.phone).indexOf(rxChangeSlug(value)) !== -1) {
        return true
      } else { 
        return false
      }
    })
    this.setState({ callHistory: arrCallHistory })
  }

  helpTimeText (timestamp) {
    const a = new Date(timestamp * 1000)
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    const month = months[a.getMonth()]; const date = a.getDate(); const hour = a.getHours(); const min = a.getMinutes()
    const time = `${date}/${month} ${hour}:${min}`
    return time
  }

  helpCallType (ele, isClass) {
    let result = ''
    let mess = ''
    if (rxu.get(this.props, 'netaauth.user.id') === ele.caller_uin) {
      mess = translate('Call away')
      result = isClass ? 'icon-call-out' : `${mess} (${fmtMSS(ele.stopped_at - ele.started_at)})`
    } else {
      if (ele.accepted_at) {
        mess = translate('Incoming call')
        result = isClass ? 'icon-call-in' : `${mess} (${fmtMSS(ele.stopped_at - ele.started_at)})`
      } else {
        mess =  translate('Missed call')
        result = isClass ? 'icon-call-in icon-call-miss' : mess
      }
    }
    return result
  }

  helpCallName (ele) {
    let result = ''
    if (rxu.get(this.props, 'netaauth.user.id') === ele.caller_uin) {
      result = ''
    } else {
      if (ele.accepted_at) {
        result = ''
      } else {
        result = 'zname-miss'
      }
    }
    return result
  }
  disableDrop = event => {
    event.preventDefault();
  }  

  fetchData () {
    const headers = { 'TC-Token': rxu.get(this.props, 'netaauth.user.token'), ...dHeaders }
    fetch(rxu.config.base_api_neta + '/api/call_log.json', {
      method: 'GET',
      headers: headers
    })
    .then(response => response.text())
    .then(result => {
      try {
        let arrGroupCallId = result.match(/call_id":(.*?)\,/ig)
        if (arrGroupCallId && arrGroupCallId.constructor === Array && arrGroupCallId.length > 0) {
          for (let strRegexCall of arrGroupCallId) {
            let newStrCallReplace = strRegexCall.replace('":', '":"').replace(',', '",')
            result = result.replace(strRegexCall, newStrCallReplace)
          }  
        }
        const json = JSON.parse(result)
        if (json.calls) {
          this.props.netaCallHistoryUpdate(json.calls)
          this.setState({callHistory:rxaget(this.props, 'netaCallHistory.data', [])})
        }
      } catch (e) {}
    })
    .catch(error => console.log('error', error))
  
  }

  onRightClickGroup(e, group) {
    e.preventDefault();
    document.oncontextmenu = function (e) {
      return false;
    }

    try {
      const menuDiv = document.getElementById('context-menu-call-history')
      menuDiv.style.top = e.clientY + 'px'
      menuDiv.style.left = Number(e.clientX) + 'px'
      menuDiv.style.display = 'block'  
    } catch(e) {
      console.log(e)
    }

    this.setState({ callRightMouse: group })
  }

  handleClickOutside(event) {
    if (event.buttons === 1 && event.target.className !== 'group-item-info') {
      try {
        const menuDiv = document.getElementById('context-menu-call-history')
        menuDiv.style.display = 'none'  
      } catch(e) {}
    }
  }

  removeCallHistory() {
    try {
      const callClick = this.state.callRightMouse || {}
      const menuDiv = document.getElementById('context-menu-call-history')
      menuDiv.style.display = 'none'  
      const token = rxu.get(this.props, 'netaauth.user.token')
     
      if (token && callClick && callClick.call_id) {
        const headers = { 'TC-Token': token, ...dHeaders }
        const params = { 'call_id': callClick.call_id.toString() }
        fetch(rxu.config.base_api_neta + '/api/call_log/delete', {
          method: 'POST',
          body: JSON.stringify(params),
          headers: headers 
        }).then((res) => {
          this.fetchData()
        }).catch(er => console.log(er))
      }

    } catch(e) {}
  }

  render () {
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({
  themeValue: state.themeValue,
  themeBackgroudValue: state.themeBackgroudValue,
  langValue: state.langValue,
  auth: state.auth,
  favorite: state.favorite,
  netaauth: state.netaauth,
  netaCallHistory: state.netaCallHistory,
  user: state.user,  
  rxgroup: state.rxgroup,
})

const mapDispatchToProps = {
  rxnavClose,
  rxnavToggle,
  netaCallHistoryUpdate,
  setComp,
  clickCall
}

const ComponentWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default ComponentWrapped
