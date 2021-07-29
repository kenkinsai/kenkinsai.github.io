import React from 'react'
import { connect } from 'react-redux'
import { setComp } from './redux'

import ChatComp from "./themes/netalo/chat"
import CallComp from "./themes/netalo/callhistory"
import ContactComp from "./themes/netalo/contact"
import ConfigComp from "./themes/netalo/config"

global.isclient && require('./themes/netalo/home/home.css')
global.isclient && require('./themes/netalo/login/index.css')

const Main = ({activeComponent}) => {
  activeComponent = activeComponent || 'chat'
  return (
    <div>
      { activeComponent === 'chat' ? <ChatComp /> :
          activeComponent === 'call' ? <CallComp /> :
            activeComponent === 'contact' ? <ContactComp /> :
              activeComponent === 'config' ? <ConfigComp /> : <ChatComp />
      }
    </div>
  )
}
const mapStateToProps = (state) => ({
  activeComponent: state.activeComponent
})

const mapDispatchToProps = { setComp }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
