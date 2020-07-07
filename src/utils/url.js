import qs from 'qs'

const paramCache = {}
const qsConfig = {skipNulls: true, arrayFormat: 'repeat'}

function getSearchString(str) {
  if (!str) {
    return ''
  }
  return str.substr(str.indexOf('?') > -1 ? str.indexOf('?') + 1 : 0)
}

// 获取url参数
function getUrlParam(name, searchString) {
  let searchStr = searchString
  if (!searchStr) {
    searchStr = window.location.search
  }

  if (!paramCache[searchStr]) {
    searchStr = getSearchString(searchStr)
    paramCache[searchStr] = qs.parse(searchStr, qsConfig)
  }
  if (name) {
    return paramCache[searchStr][name]
  }
  return paramCache[searchStr]
}

function constructHost(host, protocol) {
  let result = ''
  let protocolStr = protocol
  if (!protocolStr) {
    protocolStr = '//'
  }
  if (host) {
    if (/^((https?):)?\/\//.test(host)) {
      result += host
    } else {
      result += protocolStr + host
    }
  }
  return result
}

function constructPath(hostString, path) {
  let result = hostString
  if (path) {
    if (
      path.charAt(0) !== '/' &&
      result.charAt(result.length - 1) !== '/' &&
      result !== ''
    ) {
      result += '/'
    }
    result += path
  }
  return result
}

function constructSearch(pathString, search, customerId) {
  let searchParams = search
  if (typeof searchParams === 'string') {
    searchParams = getSearchString(searchParams)
    searchParams = qs.parse(searchParams, qsConfig)
  }
  let result = pathString
  if (customerId) {
    if (!searchParams) {
      searchParams = {}
    }
    searchParams['user_id'] = customerId
  }
  if (searchParams) {
    const searchString = qs.stringify(searchParams)
    if (searchString) {
      if (
        searchString.charAt(0) !== '?' &&
        result.charAt(result.length - 1) !== '?'
      ) {
        result += '?'
      }
      result += searchString
    }
  }
  return result
}

function constructHash(address, hash) {
  let result = address
  if (hash) {
    if (hash.charAt(0) !== '#' && result.charAt(result.length - 1) !== '#') {
      result += '#'
    }
    result += hash
  }
  return result
}

// 拼接网址
function constructUrl(host, path, search, hash, protocol, customerId) {
  let result = constructHost(host, protocol)
  result = constructPath(result, path)
  result = constructSearch(result, search, customerId)
  return constructHash(result, hash)
}

function isExternalUrl(link) {
  let hasProtocol = false
  const regex = /^((https?):)?\/\/([^/]*)/
  if (typeof link !== 'string') {
    return false
  }
  if (regex.test(link)) {
    hasProtocol = true
  }
  if (!hasProtocol) {
    return false
  }
  return true
  // 新旧版同时使用期间暂且不做host比对。
  // const host = link.match(regex)[3]
  // if (host !== window.location.host) {
  //   return true
  // }
  // return false
}
export {paramCache, getUrlParam, constructUrl, isExternalUrl}
