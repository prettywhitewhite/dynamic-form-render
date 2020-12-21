import qs from 'qs'
import axios from 'axios'
import {Notification} from 'element-ui/lib/notification'
const isCancel = axios.isCancel
const TRACE_ID_HEADER = 'x-ragnar-traceid'

const defaultConfigs = {
  timeout: 40000,
  paramsSerializer: function(params) {
    return qs.stringify(params)
  },
  headers: {
    post: {
      'Content-Type': 'application/json',
    },
  },
}
function getErrorInfo(error) {
  let url = ''
  let traceId = ''
  let headers = {}
  if (error.response && error.response.headers) {
    headers = error.response.headers
  } else if (error.headers) {
    headers = error.headers
  }
  for (const header in headers) {
    if (headers.hasOwnProperty(header)) {
      if (header.toLowerCase() === TRACE_ID_HEADER) {
        traceId = headers[header]
        break
      }
    }
  }
  if (error.config) {
    url = error.config.url
  }
  return {
    url: url,
    traceId: traceId,
  }
}
function showError(message, traceId) {
  let errorMsg = ''
  if (traceId) {
    errorMsg = ' Trace ID:' + traceId
  }
  // TODO:错误提示
  Notification({
    title: '提示',
    message: `${message}</br>${errorMsg}`,
    type: 'error',
    dangerouslyUseHTMLString: true,
  })
}
function successInterceptor(response, silent, successCode) {
  if (response && response.data && response.data.code === successCode) {
    return response.data
  }
  const traceId = getErrorInfo(response).traceId
  let errorMessage = '接口错误，请重试'
  if (response && response.data && response.data.error) {
    errorMessage = response.data.error
  } else if (response && response.data && response.data.message) {
    errorMessage = response.data.message
  }
  if (!silent) {
    showError(errorMessage, traceId)
  }
  return Promise.reject(new Error(errorMessage))
}
function errorInterceptor(error) {
  if (
    axios.isCancel(error) &&
    error.message === 'CANCELED_DUE_TO_NEW_REQUEST'
  ) {
    return Promise.reject(error)
  }
  const traceId = getErrorInfo(error).traceId
  let errorMessage = ''
  if (error.response && error.response.status === 500) {
    errorMessage = '系统超时，请重试'
  } else if (
    error.code === 'ECONNABORTED' ||
    (error.response && error.response.status === 408)
  ) {
    errorMessage = '连接失败，请检查您的网络状况'
  } else if (error.response && error.response.status === 404) {
    errorMessage = '接口异常，请联系管理员'
  } else {
    errorMessage = '网络超时，请重试'
  }
  showError(errorMessage, traceId)
  return Promise.reject(new Error(errorMessage))
}
function factory(
  baseUrl,
  configs = {},
  silent = false,
  noInterceptor = false,
  successCode = 10000
) {
  const mergedConfigs = Object.assign({}, defaultConfigs, configs)
  if (baseUrl) {
    mergedConfigs.baseURL = baseUrl
  }
  if (!mergedConfigs.params) {
    mergedConfigs.params = {}
  }
  const instance = axios.create(mergedConfigs)
  if (noInterceptor) {
    return instance
  }
  instance.interceptors.response.use(
    response => {
      return successInterceptor(response, silent, successCode)
    },
    error => {
      return errorInterceptor(error, silent)
    }
  )
  return instance
}
const http = factory('', {
  withCredentials: true,
})
const httpSilent = factory(
  '',
  {
    withCredentials: true,
  },
  true
)

export default {
  factory: factory,
  cancelToken: axios.CancelToken,
  isCancel: isCancel,
  http,
  httpSilent,
}
