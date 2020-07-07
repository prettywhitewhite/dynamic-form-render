export const formatterEllipsisLable = function(long) {
  return value => {
    return value.length > long ? value.substring(0, long) + '...' : value
  }
}
export function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}
