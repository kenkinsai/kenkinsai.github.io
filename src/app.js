import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setComp, savePage } from './redux'

import Main from './main'
import LoginComp from "./themes/netalo/login"

const rxio = global.rootRequire('classes/socket').default
const { rxaget, changeTheme, changeThemeColor, changeTheme_ThemeColor } = global.rootRequire('classes/ulti')
const { rxgetLocal } = global.rootRequire('classes/request')
const themeData = global.rootRequire('classes/themeData.json')
const themeColorData = global.rootRequire('classes/themeColorData.json')
const theme_themeColorData = global.rootRequire('classes/theme_themeColorData.json')

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      flagAuth: false
    }
  }

  componentDidMount () {
    const color = global.rxu.json(rxgetLocal('netaThemeColor'), '')
    const themeBackGround = global.rxu.json(rxgetLocal('netaThemeBackGround'), '')
    const token = rxaget(this.props, 'netaauth.user.token', '')
    const userid = rxaget(this.props, 'netaauth.user.id', '')

    if (themeBackGround==='darkTheme'){
      changeTheme(themeData.nightTheme)
      changeTheme_ThemeColor(theme_themeColorData.nightTheme)
    } else {
      changeTheme(themeData.defaultTheme) 
      if (color==='blueColor'){
        changeTheme_ThemeColor(theme_themeColorData.blueColor)
      } else {
        changeTheme_ThemeColor(theme_themeColorData.orangeColor) 
      } 
    }    
    if (color==='blueColor'){
      changeThemeColor(themeColorData.blueColor)
    } else {
      changeThemeColor(themeColorData.orangeColor) 
    }

    
    if (token && userid) {
      if (!rxio.connected && !rxio.init_connected) {
        rxio.login(token, userid, (data) => {
        })
      }
    }

    if (window && window.ipcRenderer) {
      window.ipcRenderer.on('helper_page', () => {
        try {
          this.props.setComp('config')
          this.props.savePage('chtg')
        } catch (e) {}
      })  
    }

    if (rxaget(this.props, 'netaauth.user.id', '')) {
      this.setState({flagAuth: true})
    } else {
      this.setState({flagAuth: false})
    }
  }



  componentDidUpdate (prevProps, prevState) {
    const tokenCurren = rxaget(this.props, 'netaauth.user.token', '')
    const tokenPrev = rxaget(prevProps, 'netaauth.user.token', '')
    
    if (tokenCurren === '' && tokenPrev !== tokenCurren) {
      this.setState({flagAuth: false })
    } else if (tokenCurren !== '' && !this.state.flagAuth) {
      this.setState({flagAuth: true })
    }
  }

  render () {
    return (
      <div>
        { !this.state.flagAuth && <LoginComp /> }
        { this.state.flagAuth && <div className='container-main-box'><Main /></div>}
      </div>
    )
  }
}

// AppContainer.js
const mapStateToProps = (state, ownProps) => ({
  netaauth: state.netaauth
})

const mapDispatchToProps = {
  setComp, savePage
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer
