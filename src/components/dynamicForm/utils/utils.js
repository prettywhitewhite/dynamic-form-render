// 解析函数字符串值
export const evaluateString = (string, rootValue, parentValue, context) => {
  return new Function(
    'rootValue',
    'parentValue',
    'context',
    `return (${string})`
  )(rootValue, parentValue, context)
}
export const isFunction = function(func) {
  if (typeof func === 'function') {
    return true
  }
  if (
    typeof func === 'string' &&
    func.substring(0, 2) === '{{' &&
    func.substring(func.length - 2, func.length) == '}}'
  ) {
    return func.substring(2, func.length - 2)
  }
  return false
}
