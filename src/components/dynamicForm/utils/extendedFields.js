let extendFields = null
let mergedFields = null
export default {
  set({fieldTypeMap, components, fieldDefault}) {
    console.log('::', fieldDefault)
    extendFields = {fieldDefault, fieldTypeMap, components}
  },
  get() {
    if (!mergedFields) {
      return {}
    }
    return mergedFields
  },
  mergeWith(defaultFields) {
    mergedFields = Object.assign({}, defaultFields)
    const fields = extendFields || {}
    console.log(fields)
    for (const key in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, key) && fields[key]) {
        mergedFields[key] = Object.assign(mergedFields[key], fields[key])
      }
    }

    return mergedFields
  },
}
