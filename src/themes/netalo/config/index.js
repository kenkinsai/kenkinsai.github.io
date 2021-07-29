/* global translate */ 
import { connect } from 'react-redux';
import * as Jsx from './index.jsx';
const themeData = global.rootRequire('classes/themeData.json')
const themeColorData = global.rootRequire('classes/themeColorData.json')
const theme_themeColorData = global.rootRequire('classes/theme_themeColorData.json')
const dataQ = global.rootRequire('classes/frequently_asked_questions.json')
const RxComponent = global.rootRequire('components/shares/rxComponent').default
const { netaUpdateProfileAction, setComp, rxnavToggle, rxnavClose, netaloginAction, netalogoutAction, saveLanguage, savePage, saveTheme, saveThemeBackgroud , saveNotificationStatus} = global.rootRequire('redux')
const rxio = global.rootRequire('classes/socket').default
const { rxaget ,changeTheme, changeThemeColor,changeTheme_ThemeColor} = global.rootRequire('classes/ulti')
const { rxsetLocal, rxgetLocal } = global.rootRequire('classes/request')
const { checkNameUser } = global.rootRequire('classes/chat')
let zget = global.rxu.get

class Component_ extends RxComponent {
  constructor (props, context) {
    super(props, context, Jsx)
    this.state = global.rootContext(this.props.staticContext) || {
      displayEditScreen: false,
      page:'cdtb',
      netaauth_user_name:'',
      notificationStatusValue:'',
      status_clickTitle: [
        { status_click: false, quest_num: 'questNum1' },
        { status_click: false, quest_num: 'questNum2' },
        { status_click: false, quest_num: 'questNum3' },
        { status_click: false, quest_num: 'questNum4' },
        { status_click: false, quest_num: 'questNum5' },
        { status_click: false, quest_num: 'questNum6' },
        { status_click: false, quest_num: 'questNum7' },
        { status_click: false, quest_num: 'questNum8' },
        { status_click: false, quest_num: 'questNum9' },
        { status_click: false, quest_num: 'questNum10' },
        { status_click: false, quest_num: 'questNum11' },
        { status_click: false, quest_num: 'questNum12' },
        { status_click: false, quest_num: 'questNum13' },
        { status_click: false, quest_num: 'questNum14' },
        { status_click: false, quest_num: 'questNum15' },
        { status_click: false, quest_num: 'questNum16' }
      ],
      usernameValue:"",
      imgkey:"",
      unblockList:{}
    }

    this.uploadInputImage = null
    
    this.users = rxaget(this.props, 'user.users', {}) || {}
    this._user = rxaget(this.props, 'netaauth.user', {})
    this.userinfo = this.users[this._user.id]
    this.token = rxaget(this.props, 'netaauth.user.token', '')
    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    this.updateProfile = this.updateProfile.bind(this)
    this.uploadFileImages = this.uploadFileImages.bind(this)
    this.getBlockList = this.getBlockList.bind(this)
    this.onClickUnBlockContact = this.onClickUnBlockContact.bind(this)
    // this.onChooseContactUnblock= this.onChooseContactUnblock.bind(this)
    this.state.netaauth_profile_url = this._user.profile_url
    // if(typeof this.state.notificationStatusValue === 'undefined'){
    //  this.state.notificationStatusValue = zget(this.props, 'notificationStatusValue', {})
    // }
    // console.log(dataQ,'data')
    let arrQuestion =[]
    for (const question of Object.keys(dataQ)) {
      if (dataQ[question]) {

        arrQuestion.push(dataQ[question])
      }
    }
    this.state.arrQuestion =arrQuestion
    // console.log(arrQuestion)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.netaauth.user && JSON.stringify(nextProps.netaauth.user) !== JSON.stringify(this._user)) {
      this._user = rxaget(nextProps, 'netaauth.user', {})
      this.convertOmessUser(zget(nextProps, 'netaauth.user.id'))
      this.setState({netaauth_profile_url:this._user.profile_url})
    }
  }

  componentDidMount () {
    const color = global.rxu.json(rxgetLocal('netaThemeColor'), '')
    const themeBackGround = global.rxu.json(rxgetLocal('netaThemeBackGround'), '')   
    let notificationStatusValue
    if (Notification.permission === "denied") {
      notificationStatusValue = false
    } else{
      notificationStatusValue = global.rxu.json(rxgetLocal('netaNotificationStatus'), '')
    }
    let page = rxgetLocal('netaPage')
    
    if (themeBackGround==='darkTheme'){
      changeTheme(themeData.nightTheme)
      changeTheme_ThemeColor(theme_themeColorData.nightTheme)
    }else {
      changeTheme(themeData.defaultTheme) 
      if(color==='blueColor'){
        changeTheme_ThemeColor(theme_themeColorData.blueColor)
      } else {
        changeTheme_ThemeColor(theme_themeColorData.orangeColor) 
      } 
    }    
    if(color==='blueColor'){
      changeThemeColor (themeColorData.blueColor)
    } else {
      changeThemeColor (themeColorData.orangeColor) 
    } 
    if (typeof page === 'undefined' || page === null) {
      rxsetLocal('netaPage', JSON.stringify('cdtb'))   
      page = 'cdtb'   
    }

    this.setState({
      page:page,
      notificationStatusValue:notificationStatusValue
    })  
    this.fetchData()

    this.convertOmessUser(zget(this.props, 'netaauth.user.id'))
    if (this.token && this.userinfo) {
      if (!rxio.connected && !rxio.init_connected) {
        rxio.login(this.token, this.userinfo, (data) => {
          this.getBlockList()
        })
      }
      else this.getBlockList()
    }
  }
  getBlockList() {
    if (rxio.connected) {
      const msg = {
        "uin": Number(this.userid),
        "pindex": 0, "psize": 1000
      }
      let that = this
      rxio.socket.emit('blocked_list', msg, (data) => {
        if (data.result === 0 && data.list) {
          let blockedList = []
          data.list.map(i => {
            if (this.users[Number(i.uin)]) {
              let group = {
                ...i,
                ...that.users[Number(i.uin)]
              }
              blockedList.push(group)
            }
            return blockedList
          })
          // console.log("blocked_list", data, that.users, blockedList)
          that.setState({ blockedList: blockedList })
        }
      })
      rxio.getUpdateGroup((data) => {
        try {
          if (data.unblocked_all.length > 0 || data.blocked_all.length > 0) {
            // console.log("data",data)
            let blockedList = JSON.parse(JSON.stringify(that.state.blockedList))
            if (data.unblocked_all.length) {
              const index = blockedList.findIndex(i => i.uin.toString() === data.unblocked_all[0].toString())
              if (index !== -1) {
                blockedList.splice(index, 1)
              }
            }
            else {
              const index = blockedList.findIndex(i => i.uin.toString() === data.blocked_all[0].toString())
              if (index === -1) {
                if (that.users[Number(data.blocked_all[0])]) {
                  let group = {
                    uin: data.blocked_all[0],
                    group_id: data.group_id,
                    ...that.users[Number(data.blocked_all[0])]
                  }
                  blockedList.push(group)
                }
              }
            }
            that.setState({ blockedList: blockedList })
          }
        } catch (e) { console.log("e", e) }
      })
    }
  }
  onChooseContactUnblock(group, index) {
    let unblockList = JSON.parse(JSON.stringify(this.state.unblockList))
    if (unblockList[group.group_id])
      delete unblockList[group.group_id]
    else unblockList[group.group_id] = group
    this.setState({ unblockList: unblockList})
  }

  onClickUnBlockContact() {
    try {
      let unblockList = JSON.parse(JSON.stringify(this.state.unblockList)),
        that = this
      for (let key in unblockList) {
        let group = unblockList[key]
        rxio.blockUser({ group_id: group.group_id, uni: group.uin, type: 'unblock_user' }, () => {
          let blockedList = JSON.parse(JSON.stringify(that.state.blockedList))
          let index = blockedList.findIndex(i => i.uin.toString() === group.uin.toString())
          if (index !== -1) {
            blockedList.splice(index, 1)
          }
          that.setState({ blockedList })
        })
      }
    } catch (error) { }
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
            method: 'POST', headers: header,body: JSON.stringify(dataParams), redirect: 'follow'
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
                                this.setState({imgkey:key,netaauth_profile_url:key})
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
  updateProfile(){
    let dataParams = {}
    if (this.state.usernameValue !== this.state.netaauth_user_name) dataParams.full_name = this.state.usernameValue
    if (this.state.imgkey) dataParams.profile_url = this.state.imgkey
    if (Object.keys(dataParams).length) {
      let header = { 'TC-Token': this.token, 'Content-Type': 'application/json; charset=UTF-8', 'Accept-Encoding': 'gzip', 'Connection': 'keep-alive' }
      let requestOptions = {
        method: 'PUT', headers: header, body: JSON.stringify(dataParams), redirect: 'follow'
      };
      fetch(global.rxu.config.update_profile + this._user.id, requestOptions).then(res => { return res.json() })
        .then((json) => {
          fetch(global.rxu.config.base_api_neta + '/api/users/' + this._user.id, {
            method: 'GET',
            headers: header
          }).then(r => r.json()).then((jsonb) => {
            if (jsonb && jsonb.Id) {
              let data = this._user
              data.name = jsonb.name || jsonb.full_name
              data.full_name = jsonb.full_name || jsonb.name
              if (jsonb.profile_url) data.profile_url = jsonb.profile_url
              this.setState({ netaauth_user_name: data.name, usernameValue: data.name,
                netaauth_profile_url: jsonb.profile_url,imgkey:'',displayEditScreen:false })
              this.props.netaUpdateProfileAction(data)
            }
          })
        }).catch(error => console.log('update_profile error', error))
    }
  }
  convertOmessUser(omessId){
    let usersinfo = ''
    let username =''
    if (rxgetLocal('rxusers')) {
      username = zget(this.props, 'netaauth.user.name')
      if (!username) {
        usersinfo = zget(global.rxu.json(rxgetLocal('rxusers'), {}), 'users') || {}
        username = checkNameUser(zget(usersinfo, [omessId], {}))
      }
    }
    this.setState({ netaauth_user_name: username, usernameValue: username })
    return username
  }
  componentWillReceiveProps (nextprops) {
    if (Notification.permission === "denied") {
      this.setState({
        notificationStatusValue:false
      })  
    }
    if (nextprops.themeBackgroudValue === 'darkTheme'){
      changeTheme(themeData.nightTheme)
      changeTheme_ThemeColor(theme_themeColorData.nightTheme)
    }else {
      changeTheme(themeData.defaultTheme)
      if(nextprops.themeValue === 'blueColor'){        
        changeTheme_ThemeColor(theme_themeColorData.blueColor)
      } else {        
        changeTheme_ThemeColor(theme_themeColorData.orangeColor) 
      } 
    }

    if(nextprops.themeValue === 'blueColor'){
      changeThemeColor (themeColorData.blueColor)      
    } else {
      changeThemeColor (themeColorData.orangeColor)              
    } 
    
  }

  onClickLogout () {
    if (rxio.connected) {
      rxio.disconnect()
    }

    this.zmenu_logoutConfigpage()
    this.props.netalogoutAction()
    // this.props.history.push('/login')
    this.props.setComp('login')
  }

  zmenu_logoutConfigpage () {
    this.props.savePage('cdtb')
  }

  themeSelect (value) {
    this.setState({ themeValue: value })

    this.props.saveThemeBackgroud(value)
  }

  editBtnClick () {
    this.setState({ displayEditScreen: true })
  }

  cancelBtnClick () {
    this.setState({ netaauth_profile_url: this._user.profile_url, imgkey: '', displayEditScreen: false },
      () => this.convertOmessUser(zget(this.props, 'netaauth.user.id')))
  }

  submitThemeColor (value) {
    this.props.saveTheme(value)
  }
  usePushNotifications(e){
    if (Notification.permission === "denied") {
      alert(translate('Notifications blocked. Please enable them in your browser.'));

      this.props.saveNotificationStatus(JSON.stringify(false))
      this.setState({notificationStatusValue:false})
    }else{
      let value = e.target.checked
      this.props.saveNotificationStatus(JSON.stringify(value))
      try{
        if(window.Notification && Notification.permission !== "denied") {
          Notification.requestPermission(function(status) {            
          });
        }
      }catch(e){
      }
      this.setState({notificationStatusValue:value})
    }


  }
  choose_cdtb (value) {
    this.props.savePage(value)
    this.setState({page:'cdtb'})
  }
  choose_cdcd (value) {
    const color = rxgetLocal('netaThemeColor')
    if (typeof color === 'undefined' || color === null) {
      rxsetLocal('netaThemeColor', JSON.stringify('orangeColor'))
    }

    const colorBackground = rxgetLocal('netaThemeBackGround')
    if (typeof colorBackground === 'undefined' || color === null) {
      rxsetLocal('netaThemeBackGround', JSON.stringify('defaultTheme'))
    }
    this.props.savePage(value)
    this.setState({page:'cdcd'})
  }

  choose_chtg (value) {
    this.props.savePage(value)
    this.setState({page:'chtg'})
  }

  choose_dksd (value) {
    this.props.savePage(value)
    this.setState({page:'dksd'})
  }

  choose_cdnn (value) {
    this.props.savePage(value)
    this.setState({page:'cdnn'})
  }

  chtg_clickTitle (name) {
    const questNum = name
    const arrQuestion = this.state.arrQuestion
    // if(arrQuestion.indexOf('Key') !== -1)
    for (let i = 0; i < 16; i++) {
      if (questNum === arrQuestion[i].name) {
        if (arrQuestion[i].status_click === true) {
          arrQuestion[i].status_click = false
        } else {
          arrQuestion[i].status_click = true
        }
      }
    }

    this.setState({ arrQuestion: arrQuestion })
  }

  changeLang (value) {
    if (value) {
      this.props.saveLanguage(value)
    }
  }

  func_getCharacName (name) {
    const arrName = name.split(' ')
    if (arrName.length === 1) {
      const _name = arrName[0][0] + arrName[0][1]
      return _name.toUpperCase()
    } else {
      const _name = (arrName[0][0] + arrName[arrName.length - 1][0])
      return _name.toUpperCase()
    }
  }

  fetchData () { }

  render () {
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  favorite: state.favorite,
  netaauth: state.netaauth,
  user: state.user,
  langValue: state.langValue,
  pageValue: state.pageValue,
  themeValue: state.themeValue,
  // notificationStatusValue: state.notificationStatusValue,
  themeBackgroudValue: state.themeBackgroudValue

})

const mapDispatchToProps = {
  saveNotificationStatus,
  savePage,
  saveTheme,
  saveThemeBackgroud,
  saveLanguage,
  rxnavClose,
  rxnavToggle,
  netaloginAction,
  netalogoutAction,
  setComp,
  netaUpdateProfileAction
}

const ComponentWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default ComponentWrapped
