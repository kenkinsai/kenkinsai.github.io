import fetch from 'isomorphic-fetch'
import { connect } from 'react-redux'

import * as Jsx from './index.jsx'
const RxComponent = global.rootRequire('components/shares/rxComponent').default

const { rxsetLocal, rxgetLocal } = global.rootRequire('classes/request')
const { setComp, rxnavToggle, rxnavClose, netaloginAction } = global.rootRequire('redux')
const dHeaders = { 'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8' }

class Component_ extends RxComponent {
  constructor (props, context) {
    super(props, context, Jsx)
    this.keyClickFunction = this.keyClickFunction.bind(this);
    this.token = ''
    this.tokenLogin = ''
    this.state = global.rootContext(this.props.staticContext) || {
      flagStep: 0,
      flagLoginPhone: 0,
      inputPhone: '',
      inputPhoneOTP: '',
      errMess: '',
      countryCode: '84',
      listCountryCode: []
    }
  }

  componentDidMount () {
    document.addEventListener("keydown", this.keyClickFunction, false);   
    this.fetchSession()
    this.checkAuth()
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyClickFunction, false);
  }

  fetchCountryCode(){    
    fetch(global.rxu.config.base_api_neta + '/api/v1/list_country_code', {
      method: 'GET',
      headers: dHeaders })
    .then((res) => {        
      return res.json() })
    .then((jsonData) => {
      this.setState({listCountryCode: jsonData.list_country_code || []})          
    }).catch(er => console.log(er))
  }

  changeCountryCode(value) {    
    let countryCode = value
    this.setState({
      countryCode: countryCode
    });
  }

  checkAuth () {
    if (global.rxu.get(this.props, 'netaauth.user.id')) {
      this.props.setComp('chat') 
    } else {
      this.fetchCountryCode()
    }
  }

  keyClickFunction(event){
    if(event.keyCode === 13) {
      if (this.state.flagStep === 0) {
        this.onClickLoginViaOTP ()
      }
      else if (this.state.flagStep === 1) {
        this.onClickLoginViaOTPConfirm ()
      }
    }
  }

  onClickLoginViaOTP () {
    let phoneNumber = this.state.inputPhone
    let prefixesFlag = false
    phoneNumber = phoneNumber.replace("+", "")
    let prefixes = ["0084", "084", "84", "0"]
    for (let iChar in prefixes) {
      let jChar = prefixes.length - iChar
      let phoneSub = phoneNumber.substring(0, jChar)
      if (phoneSub === prefixes[iChar]) {
        phoneNumber = phoneNumber.replace(prefixes[iChar], "+84")
        prefixesFlag = true
        break
      }
    }

    if(!prefixesFlag){
      phoneNumber = '+' + this.state.countryCode + this.state.inputPhone 
    }

    if (isNaN(phoneNumber)){
      this.setState({errMess: 'Số điện thoại phải là số '})
      setTimeout(() => { this.setState({ errMess: ''}) }, 3000)
    } else {      
      if (this.token) {
        let params = { 'phone': phoneNumber }
        let headers = { 'TC-Token': this.token, ...dHeaders }
        fetch(global.rxu.config.base_api_neta + '/api/users/login_by_otp.json', {
          method: 'POST',
          body: JSON.stringify(params),
          headers: headers 
        })
        .then((res) => { return res.json() })
        .then((json) => {
          if ((!json.Code || json.Code === 200) && json.token) {
            this.tokenLogin = json.token
            this.setState({ flagStep: 1 })
          } else{
            this.setState({errMess:'Số điện thoại không tồn tại'})
            setTimeout(() => { this.setState({ errMess: ''}) }, 3000)
          }
        })
        .catch(er => console.log(er))
      } else {
        this.setState({errMess:'Lỗi kết nối '})
        setTimeout(() => { this.setState({ errMess: ''}) }, 3000)
      }
    }
  }

  onClickLoginViaOTPConfirm () {
    if (this.state.flagStep === 1) {
      let phoneNumberOTP = this.state.inputPhoneOTP 
      if (isNaN(phoneNumberOTP)) {        
       this.setState({errMess:'OTP phải là số '})
        setTimeout(function() {
          this.setState({ errMess: ''});
        }.bind(this), 3000);
      }else{
        let params = { 'otp': this.state.inputPhoneOTP }
        let headers = { 'TC-Login-Key': this.tokenLogin, ...dHeaders }
        fetch(global.rxu.config.base_api_neta + '/api/users/confirm_login_by_otp.json', {
          method: 'POST',
          body: JSON.stringify(params),
          headers: headers }).then((res) => { return res.json() })
          .then((json) => {
            let token = json.Data.token || ''
            if (token) {
              this.helpGetUserinfoAndLogin(token, (jsonb) => {
                this.props.netaloginAction({ token: token, name: jsonb.full_name, id: jsonb.Id, phone: jsonb.phone })
                this.props.setComp('chat')
              }, () => { this.setState({ inputPhoneOTP: '' }) })
            } else {
              this.setState({
                inputPhoneOTP: '',
              })
            }

          }).catch(er => {
            console.log(er)
            this.setState({errMess:'OTP sai'})        
            setTimeout(function() {
              this.setState({ errMess: ''});
            }.bind(this), 3000);
          }) 
      }
      
    }
  }

  helpGetUserinfoAndLogin (token, callback, callbackFailed) {
    fetch(global.rxu.config.base_api_neta + '/api/session.json', {
      method: 'GET',
      headers: { 'TC-Token': token, ...dHeaders }
    }).then(r => r.json()).then((json) => {
      if (json.user_id) {
        fetch(global.rxu.config.base_api_neta + '/api/users/' + json.user_id, {
          method: 'GET',
          headers: { 'TC-Token': token, ...dHeaders }
        }).then(r => r.json()).then((jsonb) => {
          if (jsonb && jsonb.Id) {
            callback(jsonb)
          }
        })
      }
    })
  }

  updateInput (inputName, e) {
    let state = {}
    state[inputName] = e.target.value
    this.setState(state)  
  }

  fetchSession () {
    let params = {
      'application_id': global.rxu.config.application_id,
      'auth_key': global.rxu.config.auth_key,
      'nonce': global.rxu.config.nonce,
      'signature': global.rxu.config.signature,
      'timestamp': global.rxu.config.timestamp
    }

    fetch(global.rxu.config.base_api_neta + '/api/session.json', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: dHeaders }).then((res) => { return res.json() })
      .then((json) => {
        if (!json.Code || json.Code === 200) {
          this.token = json.token
        }
      }).catch(er => console.log(er))
  }

  render () {
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  favorite: state.favorite,
  netaauth: state.netaauth
})

const mapDispatchToProps = {
  rxnavClose,
  rxnavToggle,
  netaloginAction,
  setComp
}

const ComponentWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default ComponentWrapped
