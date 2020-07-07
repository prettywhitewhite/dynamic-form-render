export default function wbCharCount(value) {
  let val = value
  if (!val) {
    val = ''
  }
  val = val.trim()
  let charCount = 0
  let unicodeCount = 0
  if (val) {
    /*eslint-disable no-control-regex*/
    const unicodeRegex = /[^\x00-\xff]/
    const regLen = val.length
    for (let i = 0; i < val.length; i++) {
      if (unicodeRegex.test(val[i])) {
        unicodeCount++
      }
    }
    charCount = Math.ceil((regLen - unicodeCount) / 2)
    /*eslint-enable no-control-regex*/
  }
  return charCount + unicodeCount
}
