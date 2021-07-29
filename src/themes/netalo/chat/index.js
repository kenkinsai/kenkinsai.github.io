/*eslint-disable no-undef*/
import { connect } from 'react-redux'
import * as Jsx from './index.jsx'

const RxComponent = global.rootRequire('components/shares/rxComponent').default

const { rxaget } = global.rootRequire('classes/ulti')
const { changeTheme,changeTheme_ThemeColor, loadIconUrl} = global.rootRequire('classes/ulti')
const themeData = global.rootRequire('classes/themeData.json')
const theme_themeColorData = global.rootRequire('classes/theme_themeColorData.json')
const { rxgetLocal, rxsetLocal } = global.rootRequire('classes/request')
const stickerData = global.rootRequire('classes/stickerData.json');
const rxio = global.rootRequire('classes/socket').default
const { netalogoutAction,setComp, saveNotificationStatus } = global.rootRequire('redux')

class Component_ extends RxComponent {
  constructor(props, context) {
    super(props, context, Jsx)
    this.state = {
      contacts: {},
      listCallLog: [],
      flagCalling: 0,
      objsCalling: {},
      reloadPage: false,
      groups:{},
      group_id: rxaget(this.props, 'rxgroup.groupid', ''),
    }

    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    this.token = rxaget(this.props, 'netaauth.user.token', '')
  }
  componentDidMount() {
    const color = global.rxu.json(rxgetLocal('netaThemeColor'), '')
    const themeBackGround = global.rxu.json(rxgetLocal('netaThemeBackGround'), '')
    const notificationStatusValueTmp = rxgetLocal('netaNotificationStatus')
    
    if (Notification.permission === "denied") {      
      this.props.saveNotificationStatus(JSON.stringify(false))
    } else{      
      if(typeof(notificationStatusValueTmp) === 'undefined'){
        this.props.saveNotificationStatus(JSON.stringify(true))
      }
    }
    

    loadIconUrl()
    if (themeBackGround==='darkTheme'){
      changeTheme(themeData.nightTheme)
      changeTheme_ThemeColor(theme_themeColorData.nightTheme)
    } else {
      changeTheme(themeData.defaultTheme) 
      if(color==='blueColor'){
        changeTheme_ThemeColor(theme_themeColorData.blueColor)
      } else {
        changeTheme_ThemeColor(theme_themeColorData.orangeColor) 
      } 
    }  

    const rxSticker = global.rxu.json(rxgetLocal('rxsticker'), {})
    if (!rxSticker.version || (rxSticker.version && (Number(rxSticker.version) < Number(stickerData.version)))) {
      rxsetLocal('rxsticker', JSON.stringify(stickerData))
    }
    
    if (window && window.ipcRenderer) {
      window.ipcRenderer.on('new_sticker', (event, args) => {
        if (args) {
          try {
            let objSticker = JSON.parse(args)
            if (objSticker.version) {
              rxsetLocal('rxsticker', args)  
            }         
          } catch(e) {
          }
        }
      })
    }

    rxio.getWaitExpired(() => {
      try {
        if (rxio.connected) {
          rxio.disconnect()
        }

        this.props.netalogoutAction()
        // this.props.history.push('/login')
        this.props.setComp('login')
      } catch(e) {}
    })
  }

  onClickAddFriend = () => {
    let modalAddFriend = this.state.modalAddFriend
    this.setState({ modalAddFriend: !modalAddFriend })
  }

  callBackRedirectParent() {
    // this.props.history.push('/chat')
    this.props.setComp('chat')
  }
  checkClickOutside(e) {

    const menuDiv = document.getElementById('menu-message')
    const menuDiv2 = document.getElementById('menu-mouseright-chat')
    const menuDivGroup = document.getElementById('context_menu-group')
    // const groupPopup = document.getElementById('popup-group')
    if (menuDiv && e.target !== menuDiv && menuDiv.style.display === 'block') {
      menuDiv.style.display = 'none'
      this.setState({ mess_selected: {}, mess_id: '' })
    }
    if (menuDivGroup && e.target !== menuDivGroup && menuDivGroup.style.display === 'block') {
      menuDivGroup.style.display = 'none'
      this.setState({ mess_selected: {}, mess_id: '' })
    }
    if (menuDiv2 && e.target !== menuDiv2 && menuDiv2.style.display === 'block') {
      menuDiv2.style.display = 'none'
      this.setState({ mess_selected: {}, mess_id: '' })
    }
  }

  render() {
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({
  themeValue: state.themeValue,
  netaauth: state.netaauth,  
  rxgroup: state.rxgroup,
})

const mapDispatchToProps = {
  netalogoutAction, setComp,
  saveNotificationStatus
}

const ComponentWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default ComponentWrapped
