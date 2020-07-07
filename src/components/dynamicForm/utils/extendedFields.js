let extendedFields = null
export default {
  set({fieldTypeMap, components, fieldDefault}) {
    extendedFields = {fieldDefault, fieldTypeMap, components}
  },
  get() {
    if (!extendedFields) {
      return {}
    }
    return extendedFields
  },
  mergeWith(defaultFields) {
    const merged = Object.assign({}, defaultFields)
    const fields = extendedFields || {}
    for (const key in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, key) && fields[key]) {
        merged[key] = Object.assign(merged[key], fields[key])
      }
    }
    return merged
  },
}
