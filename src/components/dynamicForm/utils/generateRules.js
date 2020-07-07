import wbCharCount from '@utils/wbCharCount'
const requiredValidator = function(rule, val, callback) {
  let value = val
  let hasError = false
  if (typeof value !== 'string') {
    if (Array.isArray(value)) {
      if (!value.length) {
        hasError = true
      }
    } else {
      if (typeof value === 'undefined' || value === null) {
        hasError = true
      }
    }
  } else {
    value = value.trim()
    if (!value) {
      hasError = true
    }
  }
  if (!hasError) {
    callback()
  } else {
    callback(new Error(rule.message || '输入值不能为空'))
  }
}
const validateWord = function(min, max) {
  return (rule, value, callback) => {
    if (!max && !min) {
      return callback()
    }
    const wordCount = wbCharCount(value)
    if (min && wordCount < min) {
      return callback(new Error(rule.message || `输入值少于最小限制${min}个字`))
    }
    if (max && wordCount > max) {
      return callback(new Error(rule.message || `输入值超过最大限制${max}个字`))
    }
    callback()
  }
}
const generateRules = function(rules) {
  if (_.isEmpty(rules)) {
    return []
  }
  if (!_.isArray(rules)) {
    rules = [].concat(rules)
  }
  const actualRules = []
  rules.forEach(rule => {
    if (
      rule.required &&
      (!rule.type || rule.type === 'string') &&
      !rule.validator
    ) {
      actualRules.push({
        validator: requiredValidator,
        message: rule.message,
        required: true,
      })
    } else if (rule.word) {
      actualRules.push({
        validator: validateWord(rule.min, rule.max),
        message: rule.message,
      })
    } else {
      actualRules.push(rule)
    }
  })
  return actualRules
}
export default generateRules
