/* global CustomEvent */
// import * as ramda from 'ramda', // global.rxi = ramda
import jQuery from 'jquery'

let rxu = require('./classes/ulti').default
let translate = require('./classes/lang').default
const rxio = require('./classes/socket').default


if (!global.defined) {
  let secret = rxu.secret
  let theme = secret.theme || 'default'

  global.defined = true
  global.rxu = rxu
  global.currentTheme = theme
  global.$ = jQuery
  global.t = translate
  global.translate = translate
  
  global.isclient = typeof window !== 'undefined'
  global.rootbase = __dirname
  global.nodebase = global.rootbase + '../node_modules/'
  global.rootRequire = function (name) {
    // eslint-disable-next-line
    return require(__dirname + '/' + name)
  }

  global.rootRequiretheme = function (name) {
    // eslint-disable-next-line
    return require(__dirname + '/themes/' + theme + '/' + name)
  }

  global.rootContext = function (context) {
    if (typeof window !== 'undefined') {
      context = context || window.__STATIC_CONTEXT__
    }
    return context
  }

  global.JSONToCSVConvertor = function (JSONData, ReportTitle, ShowLabel = true) {
    let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData
    let CSV = ''; CSV += ReportTitle + '\r\n\n'
    if (ShowLabel) { let row = ''; for (let index in arrData[0]) { row += index + ',' }; row = row.slice(0, -1); CSV += row + '\r\n' }
    for (let i = 0; i < arrData.length; i++) { let row = ''; for (let index in arrData[i]) { row += '"' + arrData[i][index] + '",' }; row.slice(0, row.length - 1); CSV += row + '\r\n' } if (CSV === '') { return }
    let fileName = 'Report_'; fileName += ReportTitle.replace(/ /g, '_'); let uri = 'data:text/csv;charset=utf-8,' + escape(CSV); let link = document.createElement('a')
    link.href = uri; link.style = 'visibility:hidden'; link.download = fileName + '.csv'
    document.body.appendChild(link); link.click(); document.body.removeChild(link)
  }

  // Jquery addon and jquery global stuff
  let $ = global.$
  global.scrolltop = function () {
    $('html, body').animate({ scrollTop: 0 }, 'fast')
  }
  global.scrollfire = function () {
    window.dispatchEvent(new CustomEvent('scroll'))
  }

  global.global_init = global.global_init || 'notyet'
  if (global.global_init === 'notyet' && typeof window !== 'undefined') {
    global.imgError = function (e) {
      e.target.style.visibility = 'hidden'
    }

    // Default worker
    $('img').on('error', function () {
      $(this).attr('src', '/images/missing.png')
    })

    // Sidebar navigator
    setTimeout(() => {
      $('.adnav__itemname.rxactive').parent('.adnav__groupwrap').addClass('rxactive')
      $('.adnav__itemname.rxactive').parent('.adnav__groupwrap').prev('.adnav__groupname').addClass('adnav__groupname--expand')
    }, 1000)

    // Plugin
    ;(function ($) {
      let uniqueCntr = 0
      $.fn.scrolled = function (waitTime, fn) {
        if (typeof waitTime === 'function') {
          fn = waitTime
          waitTime = 20
        }
        var tag = 'scrollTimer' + uniqueCntr++
        this.scroll(function () {
          var self = $(this)
          var timer = self.data(tag)
          if (timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(function () {
            self.removeData(tag)
            fn.call(self[0])
          }, waitTime)
          self.data(tag, timer)
        })
      }
    })($)

    global.onResizeWindow = function () { $('.rxwindowheight').css({ 'height': $(window).height() + 'px' }) }
    $(window).on('load', global.onResizeWindow)
    $(window).resize(global.onResizeWindow)
  }
}

if (typeof window !== 'undefined') {
  const _addContact = (arrContacts, callback) => {
    if (arrContacts && arrContacts.constructor === Array && arrContacts.length > 0) {
      rxio.sendContacts(arrContacts, (data, err) => {
        callback(data, err)
      })
    } 
  }
  window.ChatNet = {
    addContact: _addContact
  }
}

export default {}
