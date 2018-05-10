import {baseUrl} from './env'
import {removeCookie} from './mUtils'

export default async(url = '', options = {}) => {
  let baseHeaders = {
    'withCredentials': 'true',
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  let loginFilter = (res) => {
    if (res && res.stateCode === -2) {
      removeCookie('uID')
      // location.pathname = '/login'
      // location.hash = '#/login'
    }
  }

  url = baseUrl + url

  options.method = options.method || 'fetch'
  options.data = options.data || {}
  options.headers = options.headers || {}
  options.contentType = options.contentType || false
  options.type = options.type ? options.type.toUpperCase() : 'POST'
  options.headers = {...baseHeaders, ...options.headers}
  if (options.contentType === 'json') {
    options.headers['Content-Type'] = 'application/json'
  }

  if (options.type === 'GET') {
    let dataStr = '' // 数据拼接字符串
    Object.keys(options.data).forEach(key => {
      dataStr += key + '=' + options.data[key] + '&'
    })
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }

  if (window.fetch && options.method === 'fetch') {
    let requestConfig = {
      withCredentials: 'true',
      credentials: 'include',
      method: options.type,
      headers: options.headers,
      mode: 'cors',
      cache: 'force-cache'
    }
    if (options.contentType) { // application/json
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(options.data)
      })
    } else if (options.type === 'POST' && typeof options.data === 'object') { // x-www-form-urlencoded
      let arrs = []
      for (let k in options.data) {
        arrs.push(k + '=' + encodeURIComponent(options.data[k]))
      }
      Object.defineProperty(requestConfig, 'body', {
        value: arrs.join('&')
      })
    }
    try {
      const response = await fetch(url, requestConfig)
      const responseJson = await response.json()
      loginFilter(responseJson)
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest()
      } else if (window.ActiveXObject) {
        let ActiveXObject = window.ActiveXObject
        requestObj = new ActiveXObject('Microsoft.XMLHTTP')
      }

      let sendData = ''
      if (options.contentType) { // application/json
        sendData = JSON.stringify(options.data)
      } else if (options.type === 'POST') { // x-www-form-urlencoded
        if (typeof options.data === 'object') {
          let arrs = []
          for (let k in options.data) {
            arrs.push(k + '=' + encodeURIComponent(options.data[k]))
          }
          sendData = arrs.join('&')
        }
      }

      requestObj.open(options.type, url, true)
      Object.keys(options.headers).forEach(key => {
        requestObj.setRequestHeader(key, options.headers[key])
      })
      requestObj.send(sendData)

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState === 4) {
          if (requestObj.status >= 200 && requestObj.status < 300) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj)
            }
            loginFilter(obj)
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}

