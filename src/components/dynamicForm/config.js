import elInput from 'element-ui/lib/input'
import DyInput from '@components/input'
import checkbox from 'element-ui/lib/checkbox'
import radio from 'element-ui/lib/radio'
import elSwitch from 'element-ui/lib/switch'
import checkboxGroup from '@components/checkboxGroup'
import radioGroup from '@components/radioGroup'
import simpleSelect from '@components/simpleSelect'
import DyText from '@components/text'
import DyTextarea from '@components/textarea'

const components = {
  elInput,
  checkbox,
  checkboxGroup,
  radioGroup,
  simpleSelect,
  DyText,
  radio,
  elSwitch,
  DyInput,
  DyTextarea,
}
const fieldTypeMap = {
  elInput: 'elInput',
  input: 'DyInput',
  select: 'simpleSelect',
  text: 'DyText',
  switch: 'elSwitch',
  radio: 'radio',
  radioGroup: 'radioGroup',
  checkbox: 'checkbox',
  checkboxGroup: 'checkboxGroup',
  textarea: 'DyTextarea',
  multiGroup: 'multiGroup',
}
const fieldDefault = {
  group: {
    defaultValue: function() {
      return {}
    },
    cleanValue: () => {
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
    defaultValue: () => {
      return []
    },
    cleanValue: () => {
      return []
    },
  },
  checkboxGroup: {
    defaultValue: () => {
      return []
    },
    cleanValue: () => {
      return []
    },
  },
}
const unlinkageFieldType = [`text`, `hidden`]
export {fieldTypeMap, fieldDefault, components, unlinkageFieldType}
export default {fieldTypeMap, fieldDefault, components, unlinkageFieldType}
