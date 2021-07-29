import React from 'react'
import Parser from 'html-react-parser'
import { Link } from 'react-router-dom'

global.isclient && require('./index.css')

let adminCSS = '<style>.main-container{ width: 100% !important; padding: 0px !important; } .homenav, .footer{ display: none !important; }</style>'
let contactlist = []

export const renderBody = (vm) => <div>
  <div className='zchat_left'>
    <div className='zleft_menu'>
      <Link className='zmenu_message' to='/chat'>
        <i className='zmenu_icon icon-speech' />
      </Link>
      <Link className='zmenu_call zmenu-active' to='/call'>
        <i className='zmenu_icon icon-phone' />
      </Link>
      <Link className='zmenu_contact' to='/contact'>
        <i className='zmenu_icon icon-people' />
      </Link>
      <Link className='zmenu_config' to='/config'>
        <i className='zmenu_icon icon-grid' />
      </Link>
    </div>
    <div className='zleft_contain'>
      <div className='zleft_searchwrap'>
        <div className='zleft_search'>Search contact</div>
      </div>
      <div className='zleft_addcontact'>+ Add Contact</div>
      <div className='zleft_contactlist'>
        {contactlist.map((ele, index) => <div className='zcontactitem clearfix' key={index}>
          <div className='zcontact_avatar' />
          <div className='zcontact_maininfo'>
            <div className='zcontact_name'>{ele.name}</div>
            <div className='zcontact_status'>{ele.status}</div>
          </div>
        </div>)}
      </div>
    </div>
  </div>
  <div className='zchat_right'>
    <div className='zright_contain'>
      Chatting
    </div>
  </div>
</div>

export const renderFoot = (vm) => <div />

export const renderComponent = (vm) => <div>
  {Parser(adminCSS)}
  {vm.renderBody()}
  {vm.renderFoot()}
</div>
