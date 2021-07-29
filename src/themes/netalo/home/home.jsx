import Parser from 'html-react-parser'
import React from 'react'

global.isclient && require('./home.css')

let adminCSS = '<style>.main-container{ width: 100% !important; padding: 0px !important; } .homenav, .footer{ display: none !important; }</style>'

export const renderComponent = (vm) => <div>
  <div>
    {Parser(adminCSS)}
    <div></div>
  </div>
</div>
