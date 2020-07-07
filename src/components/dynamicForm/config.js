import elInput from 'element-ui/lib/input'
import checkbox from 'element-ui/lib/checkbox'
import radio from 'element-ui/lib/radio'
import elSwitch from 'element-ui/lib/switch'
import checkboxGroup from '@components/checkboxGroup'
import contentTextarea from '@components/contentTextarea'
import radioGroup from '@components/radioGroup'
import simpleSelect from '@components/simpleSelect'
import fileUploader from '@components/fileUploader'
import DyText from '@components/text'

const components = {
  elInput,
  checkbox,
  checkboxGroup,
  contentTextarea,
  radioGroup,
  simpleSelect,
  DyText,
  fileUploader,
  radio,
  elSwitch,
}
const fieldTypeMap = {
  input: 'elInput',
  contentTextarea: 'contentTextarea',
  select: 'simpleSelect',
  upload: 'fileUploader',
  text: 'DyText',
  switch: 'elSwitch',
  radio,
  radioGroup,
  checkbox,
  checkboxGroup,
}
const fieldDefault = {
  group: {
    defaultValue: function() {
      return {}
    },
    itemDataScope: function(defaultValue) {
      return defaultValue
    },
  },
  select: {
    defaultValue: config => {
      if (config && config.options && !_.isEmpty(config.options)) {
        return _.head(config.options).id
      }
    },
  },
  multiGroup: {
    defaultValue: config => {
      if (config && config.defaultCount) {
        return new Array(config.defaultCount).fill({})
      }
      return [{}]
    },
    itemDataScope: function(defaultValue) {
      return defaultValue[0]
    },
  },
}
export {fieldTypeMap, fieldDefault, components}
export default {fieldTypeMap, fieldDefault, components}
