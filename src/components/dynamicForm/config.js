import elInput from 'element-ui/lib/input'
import checkbox from 'element-ui/lib/checkbox'
import radio from 'element-ui/lib/radio'
import elSwitch from 'element-ui/lib/switch'
import checkboxGroup from '@components/checkboxGroup'
import contentTextarea from '@components/contentTextarea'
import radioGroup from '@components/radioGroup'
import simpleSelect from '@components/simpleSelect'
import upload from '@components/upload'
import DyText from '@components/text'

const components = {
  elInput,
  checkbox,
  checkboxGroup,
  contentTextarea,
  radioGroup,
  simpleSelect,
  DyText,
  upload,
  radio,
  elSwitch,
}
const fieldTypeMap = {
  input: 'elInput',
  contentTextarea: 'contentTextarea',
  select: 'simpleSelect',
  upload: 'upload',
  text: 'DyText',
  switch: 'elSwitch',
  radio: 'radio',
  radioGroup: 'radioGroup',
  checkbox: 'checkbox',
  checkboxGroup: 'checkboxGroup',
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
