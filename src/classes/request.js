/* global localStorage */
import fetch from 'isomorphic-fetch'

export function apiget (url, params, callbacks) {
  if (typeof window === 'undefined') return {}

  url = url || ''
  params = (typeof (params) === 'object') ? params : {}

  // Make params
  let tempBody = ''
  for (let property in params) {
    if (params.hasOwnProperty(property)) {
      tempBody += `${property}=${params[property]}&`
    }
  }

  // Add authorization
  let match = document.cookie.match(new RegExp('authorize=([^;]+)'))
  if (match) {
    tempBody += `authorization=${match[1]}&`
  }

  tempBody += `timeseed=${Date.now()}`
  fetch(url + '?' + tempBody, { method: 'GET', headers: { 'Accept': 'application/json' }, body: null })
    .then(res => res.json())
    .then((json) => {
      if (typeof (callbacks) !== 'undefined') {
        let callbackIndex = json.success.toString()
        if (typeof (callbacks[callbackIndex]) !== 'undefined') {
          callbacks[callbackIndex](json)
        } else if (typeof (callbacks['default']) !== 'undefined') {
          callbacks['default'](json)
        }
      }
      if (json.success === -3) {
        window.location.href = '/admin/login'
      }
    }).catch(error => console.log(error))
}

export function apicall (method, url, params, headers, callbacks) {
  if (typeof window === 'undefined') return {}

  url = url || ''
  params = (typeof (params) === 'object') ? params : {}

  // Make params
  let tempBody = ''
  for (let property in params) {
    if (params.hasOwnProperty(property)) {
      tempBody += `${property}=${params[property]}&`
    }
  }

  // Add authorization
  let match = document.cookie.match(new RegExp('authorize=([^;]+)'))
  if (match) {
    tempBody += `authorization=${match[1]}&`
  }

  headers = headers === {} ? { 'Accept': 'application/json' } : headers
  fetch(url + '?' + tempBody, { method: method, headers: headers, body: null })
    .then(res => res.json())
    .then((json) => callbacks(json)).catch(error => console.log(error))
}

export function apipost (url, params, callbacks) {
  if (typeof window === 'undefined') return {}

  url = url || ''
  params = (typeof (params) === 'object') ? params : {}

  // Add authorization
  let match = document.cookie.match(new RegExp('authorize=([^;]+)'))
  if (match) {
    params['authorization'] = match[1]
  }

  params['timeseed'] = Date.now()
  fetch(url, { method: 'POST', body: JSON.stringify(params), headers: { 'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8' } })
    .then((res) => { return res.json() })
    .then((json) => {
      if (typeof (callbacks) !== 'undefined') {
        let callbackIndex = json.success.toString()
        if (typeof (callbacks[callbackIndex]) !== 'undefined') {
          callbacks[callbackIndex](json)
        } else if (typeof (callbacks['default']) !== 'undefined') {
          callbacks['default'](json)
        }
      }
      if (json.success === -3) {
        window.location.href = '/admin/login'
      }
    }).catch(error => console.log(error))
}

export function rxput (url, params, callback) {

}

export function rxdelete (url, params, callback) {

}

export function rxoption (url, params, callback) {

}

export function rxsetCookie (cname, cvalue, minutes) {
  if (typeof (document) !== 'undefined') {
    let d = new Date()
    d.setTime(d.getTime() + (minutes * 60 * 1000))
    let expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + '; ' + expires
  }
}

export function rxgetCookie (cname) {
  if (typeof (document) !== 'undefined') {
    var value = '; ' + document.cookie
    var parts = value.split('; ' + cname + '=')
    if (parts.length === 2) return parts.pop().split(';').shift()
  }
}

export function rxsetLocal (cname, cvalue) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(cname, cvalue)
  }
}

export function rxgetLocal (cname, cdefault) {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(cname) || cdefault
  } else {
    return cdefault
  }
}

export function rxJson (json, cdefault) {
  let tempReturn = {}
  try {
    tempReturn = JSON.parse(json)
  } catch (e) {
    tempReturn = cdefault
  }

  return tempReturn
}

export function rxaget(variable, keys, defaultVal) {
  defaultVal = defaultVal || "";
  let resultVal = defaultVal;

  try {
    // Keys is array of index
    if (Array.isArray(keys)) {
      let tempResult = variable;
      for (let i in keys) {
        tempResult = tempResult[keys[i]];
      }
      resultVal = tempResult;

      // Keys is a string
    } else {
      keys = keys.split(".");
      let tempResult = variable;
      for (let i in keys) {
        tempResult = tempResult[keys[i]];
      }
      resultVal = tempResult;
    }

    // Case exception, access undefined variable
  } catch (e) {
    resultVal = defaultVal;
  }

  // Case undefined after all
  if (resultVal === undefined) {
    resultVal = defaultVal;
  }

  // HAPPYENDING
  return resultVal;
}
