/* 全局通用eventHub, 不允许一个callback在同一个event上的重复注册 */
const events = {}
export default {
  on(eventName, callback) {
    if (!events[eventName]) {
      events[eventName] = []
    }
    if (events[eventName].indexOf(callback) < 0) {
      events[eventName].push(callback)
    }
  },
  off(eventName, callback) {
    if (!events[eventName] || !events[eventName].length) {
      return
    }
    const index = events[eventName].indexOf(callback)
    events[eventName].splice(index, 1)
  },
  trigger(eventName, ...args) {
    if (!events[eventName] || !events[eventName].length) {
      return
    }
    events[eventName].forEach(callback => {
      callback(...args)
    })
  },
}
