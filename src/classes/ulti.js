// Website - rxshop
// src/classes/ulti.js
/* global translate*/
import { rxsecret } from './../config/index'

let rxu = require('@rxframework/rxulti')

rxu.navClass = function (route, props, showObj, activeClass) {
  let result = ''
  showObj = showObj || {}
  let showPermission = showObj.showPermission || ''
  let showClass = showObj.showClass || ' rxshow '
  let hideClass = showObj.hideClass || ' rxhide '

  if (props.location) {
    let currentLocation = props.location.pathname || ''
    activeClass = activeClass || ' rxactive '

    if (currentLocation === route) {
      result += ' ' + activeClass
    }

    if (rxu.get(props, 'auth.user.arrper', ['']).concat(['']).indexOf(showPermission) !== -1) {
      result += ' ' + showClass
    } else {
      result += ' ' + hideClass
    }
  }

  return result
}

export function isElectron() {
  if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
    return true;
  }
  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
    return true;
  }
  if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true;
  }
  return false;
}
/////
export function loadIconUrl() {
  let icon_close_png = document.createElement("img");
  icon_close_png.src = 'images/default/icons/icon-close.png';
  let url_icon_close_png = 'url(' + icon_close_png.src + ')'
  try {
    document.getElementById('chat-root').style.setProperty("--icon-close-png-url", url_icon_close_png);
  } catch (e) { }
}
////
export function changeTheme(themeChoose) {
  try {
    document.getElementById('chat-root').style.setProperty("--theme-color-text", themeChoose.theme_color_text);
    document.getElementById('chat-root').style.setProperty("--theme-color-text_1", themeChoose.theme_color_text_1);
    document.getElementById('chat-root').style.setProperty("--theme-color_background", themeChoose.theme_color_background);
    document.getElementById('chat-root').style.setProperty("--theme-color_background_sticker", themeChoose.theme_color_background_sticker);
    document.getElementById('chat-root').style.setProperty("--theme-color_background_sticker_active", themeChoose.theme_color_background_sticker_active);
    document.getElementById('chat-root').style.setProperty("--theme-color_background_icon-sticker_active", themeChoose.theme_color_background_icon_sticker_active);
    document.getElementById('chat-root').style.setProperty("--theme-color_background_doc", themeChoose.theme_color_background_doc);
    document.getElementById('chat-root').style.setProperty("--theme-color-text-light", themeChoose.theme_color_text_light);
    document.getElementById('chat-root').style.setProperty("--theme-border-color", themeChoose.theme_border_color);
    document.getElementById('chat-root').style.setProperty("--theme-group-border-color", themeChoose.theme_group_border_color);
    document.getElementById('chat-root').style.setProperty("--theme-color_background_input", themeChoose.theme_color_background_input);
    document.getElementById('chat-root').style.setProperty("--theme-color_background_search_input", themeChoose.theme_color_background_search_input);
    document.getElementById('chat-root').style.setProperty("--theme-placeholder_color", themeChoose.theme_placeholder_color);
    document.getElementById('chat-root').style.setProperty("font-family", "sans-serif");
  } catch (e) { }
}
export function changeThemeColor(themeChoose) {
  if (rxconfig.theme === 'galo') {
    try {
      document.getElementById('chat-root').style.setProperty("--theme-color", themeChoose.galo.theme_color);
      document.getElementById('chat-root').style.setProperty("--theme-background_forward_color", themeChoose.galo.theme_background_forward_color);
      document.getElementById('chat-root').style.setProperty("--theme-icon_color", themeChoose.galo.theme_icon_color);
      document.getElementById('chat-root').style.setProperty("--theme-doc_icon_color", themeChoose.galo.theme_doc_icon_color);
      document.getElementById('chat-root').style.setProperty("--login_button_color", themeChoose.galo.login_button_color);
      document.getElementById('chat-root').style.setProperty("--login_logo_color", themeChoose.galo.login_logo_color);
      document.getElementById('chat-root').style.setProperty("--theme-filter-color", themeChoose.galo.theme_filter_color);
    } catch (e) { }
  }
  if (rxconfig.theme === 'default') {
    try {
      document.getElementById('chat-root').style.setProperty("--theme-color", themeChoose.default.theme_color);
      document.getElementById('chat-root').style.setProperty("--theme-background_forward_color", themeChoose.default.theme_background_forward_color);
      document.getElementById('chat-root').style.setProperty("--theme-icon_color", themeChoose.default.theme_icon_color);
      document.getElementById('chat-root').style.setProperty("--theme-doc_icon_color", themeChoose.default.theme_doc_icon_color);
      document.getElementById('chat-root').style.setProperty("--login_button_color", themeChoose.default.login_button_color);
      document.getElementById('chat-root').style.setProperty("--login_logo_color", themeChoose.default.login_logo_color);
      document.getElementById('chat-root').style.setProperty("--theme-filter-color", themeChoose.default.theme_filter_color);
    } catch (e) { }
  }

}
export function changeTheme_ThemeColor(themeChoose) {
  if (rxconfig.theme === 'galo') {
    try {
      document.getElementById('chat-root').style.setProperty("--theme-color_background_active_tagname", themeChoose.galo.theme_color_background_active_tagname);
      document.getElementById('chat-root').style.setProperty("--theme-color_background_hover_tagname", themeChoose.galo.theme_color_background_hover_tagname);
      document.getElementById('chat-root').style.setProperty("--theme-color_background_active", themeChoose.galo.theme_color_background_active);
      document.getElementById('chat-root').style.setProperty("--theme-color_background_hover", themeChoose.galo.theme_color_background_hover);
    } catch (e) { }
  }
  if (rxconfig.theme === 'default') {
    try {
      document.getElementById('chat-root').style.setProperty("--theme-color_background_active_tagname", themeChoose.default.theme_color_background_active_tagname);
      document.getElementById('chat-root').style.setProperty("--theme-color_background_hover_tagname", themeChoose.default.theme_color_background_hover_tagname);
      document.getElementById('chat-root').style.setProperty("--theme-color_background_active", themeChoose.default.theme_color_background_active);
      document.getElementById('chat-root').style.setProperty("--theme-color_background_hover", themeChoose.default.theme_color_background_hover);
    } catch (e) { }
  }

}

export function timeConverter(timestamp, type) {
  let time = ''
  if (!isNaN(timestamp)) {
    timestamp = Number(timestamp)
    if (timestamp.toString().length >= 13 && timestamp.toString().length < 16) {
      timestamp = Math.floor(timestamp / 1000)
    }
    if (timestamp.toString().length >= 16 && timestamp.toString().length < 19) {
      timestamp = Math.floor(timestamp / 1000000)
    }
    timestamp = timestamp * 1000
    let date = new Date(Math.floor(timestamp))
    let days = [translate('Sunday'), translate('Monday'), translate('Tuesday'), translate('Wednesday'), translate('Thursday'), translate('Friday'), translate('Saturday')]
    let dayofweek = days[date.getDay()]
    let year = date.getFullYear()
    let month = ('0' + (date.getMonth() + 1)).substr(-2)
    let datestr = ('0' + date.getDate()).substr(-2)
    let hour = ('0' + date.getHours()).substr(-2)
    let min = ('0' + date.getMinutes()).substr(-2)
    let sec = ('0' + date.getSeconds()).substr(-2)


    if (type === 'date') {
      time = datestr + '/' + month + '/' + year
    } else if (type === 'time') {
      time = hour + ':' + min + ':' + sec
    } else if (type === 'minute') {
      time = hour + ':' + min
    } else if (type === 'dateweek') {
      time = dayofweek + ', ' + datestr + '/' + month + '/' + year
    } else if (type === 'dateweektime') {
      time = dayofweek + ', ' + datestr + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec
    } else if (type === 'dayminute') {
      time = datestr + '/' + month + '/' + year + ' ' + hour + ':' + min
    } else if (type === 'dayofweek') {
      time = dayofweek
    } else {
      time = datestr + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec
    }
  }
  return time
}

export function timeToDate(timestamp) {
  let result = ((timestamp + 25200) - (timestamp + 25200) % (86400)) - 25200
  return result
}

export function timesUnixToDate(timestamp1, timestamp2) {
  let result = ((timestamp1 + 25200) - (timestamp1 + 25200) % (86400)) - 25200
  if (result < 0) {
    result = ((timestamp2 + 25200) - (timestamp2 + 25200) % (86400)) - 25200
  }
  return result
}

export function convertSecondUnix(timestamp, type) {
  let timenow = Math.floor(Date.now() / 1000)
  let datenow = timeToDate(timenow)
  let result = datenow
  if (!isNaN(timestamp)) {
    timestamp = Number(timestamp)
    if (timestamp.toString().length >= 13 && timestamp.toString().length < 16) {
      timestamp = Math.floor(timestamp / 1000)
    }
    if (timestamp.toString().length >= 16 && timestamp.toString().length < 19) {
      timestamp = Math.floor(timestamp / 1000000)
    }

    result = timestamp
  }

  return result
}


export function autoConvertTime(timestamp) {
  let timenow = Math.floor(Date.now() / 1000)
  let datenow = timeToDate(timenow)
  let result = ''
  if (!isNaN(timestamp)) {
    timestamp = Number(timestamp)
    if (timestamp.toString().length >= 13 && timestamp.toString().length < 16) {
      timestamp = Math.floor(timestamp / 1000)
    }
    if (timestamp.toString().length >= 16 && timestamp.toString().length < 19) {
      timestamp = Math.floor(timestamp / 1000000)
    }
    if (timestamp > datenow) {
      result = timeConverter(timestamp, 'minute')
    } else {
      if (timestamp > (datenow - (86400 * 3))) {
        result = timeConverter(timestamp, 'dayofweek')
      } else {
        result = timeConverter(timestamp, 'date')
      }
    }
  }
  return result
}

export function secondToTime(second) {
  if (second && !isNaN(second)) {
    let sec_num = parseInt(second, 10)
    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    let seconds = sec_num - (hours * 3600) - (minutes * 60)

    if (hours < 10) { hours = '0' + hours }
    if (minutes < 10) { minutes = '0' + minutes }
    if (seconds < 10) { seconds = '0' + seconds }
    if (second < 3600) {
      return minutes + ':' + seconds;
    } else {
      return hours + ':' + minutes + ':' + seconds
    }
  } else {
    return '00:00'
  }
}

export function padstr(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function secondsToTime(secs) {
  let hours = Math.floor(secs / (60 * 60))

  let divisor_for_minutes = secs % (60 * 60)
  let minutes = Math.floor(divisor_for_minutes / 60)

  let divisor_for_seconds = divisor_for_minutes % 60
  let seconds = Math.ceil(divisor_for_seconds)

  return { 'h': padstr(hours, 2), 'm': padstr(minutes, 2), 's': padstr(seconds, 2) }
}

export function rxaget(variable, keys, defaultVal) {
  defaultVal = defaultVal || ''
  let resultVal = defaultVal


  try {
    // Keys is array of index
    if (Array.isArray(keys)) {
      let tempResult = variable
      for (let i in keys) {
        tempResult = tempResult[keys[i]]
      }
      resultVal = tempResult

      // Keys is a string
    } else {
      keys = keys.split('.')
      let tempResult = variable
      for (let i in keys) {
        tempResult = tempResult[keys[i]]
      }
      resultVal = tempResult
    }

    // Case exception, access undefined variable
  } catch (e) {
    resultVal = defaultVal
  }

  // Case undefined after all
  if (resultVal === undefined) {
    resultVal = defaultVal
  }

  // HAPPYENDING
  return resultVal
}

export function subString(str, pos) {
  pos = pos || 33
  let result = ''
  if (str && typeof (str) === 'string' && str.length > pos) {
    result = str.substr(0, pos) + ' ...'
  } else {
    result = str
  }

  return result
}

export function rxChangeSlug(x, isNotNull = false) {
  let str = x
  if (typeof (x) !== 'undefined') {
    str = str.toLowerCase()
    str = str.replace(/[`~!@#$%^&*()_|+=?;:'",.<>{}[\]\\/]/gi, '')
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    str = str.replace(/ + /g, ' ')
    str = str.replace(/ /g, '-')
    str = str.trim()
  }
  return isNotNull ? (str || x) : str
}

export function rxChangeSlugSearch(x, isNotNull = false) {
  let str = x
  if (typeof (x) !== 'undefined') {
    str = str.toLowerCase()
    // str = str.replace(/[`~!@#$%^&*()_|+=?;:'",.<>{}[\]\\/]/gi, '')
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    str = str.replace(/ + /g, ' ')
    // str = str.replace(/ /g, '-')
    str = str.trim()
  }
  return isNotNull ? (str || x) : str
}


export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function sortArrObj(array, key, type) {
  if (type === 'desc') {
    return array.sort((a, b) => (Number(rxaget(a, key, 0)) > Number(rxaget(b, key, 0))) ? -1 : ((Number(rxaget(b, key, 0)) > Number(rxaget(a, key, 0))) ? 1 : 0))
  } else {
    return array.sort((a, b) => (Number(rxaget(a, key, 0)) > Number(rxaget(b, key, 0))) ? 1 : ((Number(rxaget(b, key, 0)) > Number(rxaget(a, key, 0))) ? -1 : 0))
  }
}

export function idToColor(userid){
  let nameColorArr = ['#ED6494','#65D5D1','#1BA8D6','#EFAE62','#5BBC43','#EF5B54','#B27CD3','#FA944A','#5BBC43','#65D5D1']
  let idColor = userid.slice(-1)
  return nameColorArr[idColor]
}

export function stringToColour(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

export function removeTags(str) {
  if ((str===null) || (str==='')) {
    return false
  } else {
    str = str.toString()
  }
      
  if(str.indexOf('\\')){
    str = str.replace(/\\/g, '')
  }
  return str.replace( /(<([^>]+)>)/ig, '')
}

export function converEmojiTag(message){
  message = message.replace(/"/g,'\\"')
  const objEmoji = {':)':'🙂',':(':'🙁',':P':'😛',':D':'😃',':O':'😮',';)':'😉','B-)':'🤓','B|':'😎','>:(':'😠',":'(":'😢','O:)':'😇',':*':'😘','3:)':'😈','^_^':'😊','o.O':'😳','>:O':'😫','(y)':'👍',':poop:':'💩'}
  const resMess = message.match(/(:\)|:\(|:P|:D|:O|;\)|B-\)|B\||>:\(|:\/|:'\(|O:\)|:\*|3:\)|\^_\^|o.O|>:O|\(y\)|:poop:)/g)
  if (resMess && resMess.constructor === Array && resMess.length > 0) {
    const uniemoji = [...new Set(resMess)]
    for (let emoji of uniemoji) {
      try {
        const stremoji = emoji.replace(/\)/g,'\\)').replace(/\(/g,'\\(').replace(/\|/g,'\\|').replace(/\//g,'\\/').replace(/'/g,'\\\'').replace(/\*/g,'\\*').replace(/\^/g,'\\^')
        const regEmoji = new RegExp(stremoji, 'g')
        const replaceEmoji = objEmoji[emoji]
        if (replaceEmoji) {
          message = message.replace(regEmoji, replaceEmoji)   
        }
      } catch(e) {}
    }
  }

  return message
}

let secret = rxsecret()
export const rxconfig = (function () {
  let config = []
  config.theme = secret.theme
  // Web 
  config.web_port = secret.web_port

  // Server
  config.base_api_neta = secret.base_api

  // Profile Img
  config.profile_api = secret.profile_api

  // CDN Profile
  config.cdn_endpoint = secret.cdn_endpoint

  // Config Login
  config.application_id = secret.application_id
  config.auth_key = secret.auth_key
  config.nonce = secret.nonce
  config.signature = secret.signature
  config.timestamp = secret.timestamp

  // Authorize
  // Homepage
  config.api_home = config.base_api + '/site'
  config.api_site_product = config.base_api + '/site/product'
  config.api_site_productcate = config.base_api + '/site/productcate'
  config.api_site_order_add = config.base_api + '/site/orderadd'

  // Note
  config.api_note = config.base_api + '/note'

  // Note cate
  config.api_cate = config.base_api + '/cate'

  // Note cate
  config.api_review = config.base_api + '/review'

  // Order
  config.api_order = config.base_api + '/order'
  config.api_productcate = config.base_api + '/productcate'
  config.api_product = config.base_api + '/product'

  config.api_authorize = config.base_api + '/authorize'
  config.api_user = config.base_api + '/user'
  config.api_user_edit = config.api_user + '/edit'
  config.api_user_delete = config.api_user + '/delete'
  config.api_user_restore = config.api_user + '/restore'
  config.api_role = config.base_api + '/role'
  config.api_role_edit = config.api_role + '/edit'
  config.api_role_delete = config.api_role + '/delete'
  config.api_role_restore = config.api_role + '/restore'
  config.api_role_all = config.api_role + '/all'
  config.api_permission = config.base_api + '/permission'
  config.api_permission_edit = config.api_permission + '/edit'
  config.api_permission_delete = config.api_permission + '/delete'
  config.api_permission_restore = config.api_permission + '/restore'
  config.api_permission_all = config.api_permission + '/all'
  config.api_permission_genpermission = config.api_permission + '/generation'
  // [[RX_APIS]] //

  // Netalo
  config.address_book = config.base_api_neta + '/api/address_book.json'
  config.registered_users = config.base_api_neta + '/api/registered_users.json'
  config.create_blob = config.base_api_neta + '/api/content/blobs.json'
  config.get_groups = config.base_api_neta + '/api/groups'
  config.get_blobs = config.base_api_neta + '/api/content/blobs'
  config.get_phone = config.base_api_neta + '/api/users/by_phone.json'
  config.get_avatar = config.base_api_neta + '/avatar/'
  config.get_static = config.profile_api + '/profiles/'
  config.get_media_chat = config.base_api_neta + '/api/media_chat.json'
  config.update_profile = config.base_api_neta + '/api/users/'

  return config
}())

rxu.secret = secret
rxu.config = rxconfig
export default rxu
