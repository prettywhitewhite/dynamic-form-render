import {isEmpty, isObjectLike, isArray, isPlainObject, cloneDeep} from 'lodash'
export const generateOptions = function(propData, map, ignoredKeys = []) {
  let data = propData
  if (isEmpty(data) && !isObjectLike(data)) {
    return []
  }
  if (isArray(data)) {
    if (!isEmpty(map)) {
      data = formatByProps(data, {id: 'id', text: 'text'}, map)
    }
    return data.filter(item => !item.hide)
  }
  const options = []
  for (const key in data) {
    if (data.hasOwnProperty(key) && !ignoredKeys.includes(key) && !item.hide) {
      const item = Object.assign({}, data[key], {$key: key})
      const option = formatByProps(item, {id: 'id', text: 'text'}, map)
      options.push(option)
    }
  }
  return options
}

export const convertToObject = function(value, replaceKey = 'id') {
  const obj = {}
  if (!isObjectLike(value)) {
    return obj
  }
  if (isArray(value)) {
    value.forEach(item => {
      if (item[replaceKey]) {
        obj[item[replaceKey]] = item
      }
    })
    return obj
  }
  for (const key in value) {
    if (value.hasOwnProperty(key) && value[key][replaceKey]) {
      obj[value[key][replaceKey]] = value[key]
    }
  }
  return obj
}

export const formatByProps = (data, props, propsMap = {}) => {
  if (
    !isObjectLike(data) ||
    !props ||
    !isPlainObject(props) ||
    !isPlainObject(propsMap)
  ) {
    return data
  }

  const map = Object.assign({}, props, propsMap)
  if (isArray(data)) {
    return data.map(item => {
      if (!isPlainObject(item)) {
        return item
      }
      let replaceObj = cloneDeep(item)
      for (const key in map) {
        if (map.hasOwnProperty(key) && key !== map[key]) {
          replaceObj[key] = item[map[key]]
        }
      }
      return replaceObj
    })
  }
  const result = cloneDeep(data)
  for (const key in map) {
    if (map.hasOwnProperty(key) && key !== map[key]) {
      result[key] = data[map[key]]
    }
  }
  return result
}
