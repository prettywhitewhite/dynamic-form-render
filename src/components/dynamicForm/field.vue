<template>
  <el-form-item
    ref="elFormItem"
    v-if="isShowFormItem"
    class="dy-form-field"
    :label-width="field.label !== undefined ? labelWidth : '0px'"
    :class="className"
    :prop="path"
    :rules="isShowFormItem ? rules : null"
    v-on="dispatchFormItemEvent"
  >
    <span
      slot="label"
      class="dy-form-field__label"
      v-if="field.label || field.prefixIcon || field.suffixIcon"
    >
      <i
        v-if="field['prefixIcon']"
        class="dy-form-field__label__prefix-icon"
        :class="field.prefixIcon"
      />
      {{ field.label }}
      <i
        v-if="field['suffixIcon']"
        class="dy-form-field__label__suffix-icon"
        :class="field.suffixIcon"
      />
    </span>
    <component
      :is="componentName"
      v-if="componentName"
      ref="field"
      v-model="iValue"
      v-bind="props"
      :fields="field.fields"
      :path="path"
      :disabled="computedDisabled"
      :class="componentClassName"
      :style="computedStyle"
      :labelWidth="labelWidth"
      v-on="listeners"
    />
    <slot name="footer">
      <p class="dy-form-field__desc" v-if="componentDesc">
        {{ componentDesc }}
      </p>
      <el-popover
        placement="top-start"
        v-if="field.tips"
        class="dy-form-field__tooltip"
        popper-class="dy-form-field__tooltip__popper"
        effect="light"
        trigger="hover"
      >
        <i
          class="el-icon-warning dy-form-field__tooltip__icon"
          slot="reference"
        ></i>
        <div v-html="sanitize(field.tips)" />
      </el-popover>
    </slot>
  </el-form-item>
</template>
<script>
import sanitize from '@utils/sanitizeHtml'
import {canEvaluate, evaluateString} from './utils/utils'
import generateRules from './utils/generateRules'
import extendedFields from './utils/extendedFields'
import Emitter from '@mixins/emitter'
import elFormItem from 'element-ui/lib/form-item'
import elPopover from 'element-ui/lib/popover'
import DynamicFieldGroup from './fieldGroup'
import DynamicFieldMultiGroup from './fieldMultiGroup'
export default {
  name: 'DynamicField',
  inheritAttrs: false,
  componentName: 'DynamicField',
  mixins: [Emitter],
  provide() {
    return {
      dynamicField: this,
    }
  },
  inject: ['dynamicForm'],
  props: {
    value: {
      required: false,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    field: {
      type: Object,
      required: true,
    },
    labelWidth: {
      type: [String, Number],
      required: false,
    },
    path: {
      type: String,
      default: '',
    },
    parentValue: {
      type: [Object, Array],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      iValue: '',
      dispatchFormItemEvent: {
        'el.form.blur': value => {
          this.dispatch('ElFormItem', 'el.form.blur', value)
        },
        'el.form.change': value => {
          this.dispatch('ElFormItem', 'el.form.change', value)
        },
      },
      fields: [],
      sanitize,
    }
  },
  computed: {
    componentName() {
      return this.isGroup
        ? 'DynamicFieldGroup'
        : this.fieldTypeMap[this.field.type]
    },
    computedStyle() {
      return this.offset !== 0
        ? {
            'margin-left': this.offset * parseInt(this.labelWidth) + 'px',
          }
        : null
    },
    config() {
      return !_.isUndefined(this.field.config)
        ? this.convertValue(this.field.config)
        : null
    },
    props() {
      const props = _.omit(this.config, 'on', 'class')
      if (this.isGroup && this.inline) {
        props.inline = true
      }
      return props
    },
    events() {
      return _.get(this.config, 'on')
    },

    offset() {
      let offset = Number(_.get(this.field, 'offset'))
      return _.isNumber(offset) ? offset : 0
    },
    listeners() {
      return this.events
        ? {...this.$listeners, ...this.events}
        : this.$listeners
    },

    dependence() {
      return !_.isUndefined(this.field.dependence)
        ? this.convertValue(this.field.dependence)
        : null
    },
    hide() {
      return _.has(this.dependence, 'hide') ? !!this.dependence.hide : false
    },
    show() {
      return _.has(this.dependence, 'show') ? !!this.dependence.show : true
    },
    setValue() {
      return _.has(this.dependence, 'value') ? this.dependence.value : null
    },
    dependenceDisabled() {
      return !_.isUndefined(_.get(this.dependence, 'disabled'))
        ? this.dependence.disabled
        : false
    },
    computedDisabled() {
      return (
        this.disabled ||
        this.dependenceDisabled ||
        (this.props && this.props.disabled)
      )
    },
    componentClassName() {
      return !_.isUndefined(_.get(this.config, 'class'))
        ? this.convertValue(_.get(this.config, 'class'))
        : null
    },
    componentDesc() {
      return !_.isUndefined(this.field.desc)
        ? this.convertValue(this.field.desc)
        : ''
    },
    fieldClassName() {
      return !_.isUndefined(this.field.class)
        ? this.convertValue(this.field.class)
        : null
    },
    className() {
      let path = this.path.replace('.', '-')
      const classNames = []

      path && classNames.push('dy-form-field-path--' + path)
      if (this.field.type === 'hidden') {
        classNames.push('is-hidden')
      }
      return classNames.concat(this.fieldClassName)
    },
    isShowFormItem() {
      return this.show && !this.hide
    },
    formData() {
      return this.dynamicForm.iData
    },
    context() {
      return this.dynamicForm.formContext
    },

    rules() {
      const _rules = canEvaluate(this.field.rules)
        ? this.convertValue(this.field.rules)
        : this.field.rules
      let rules = generateRules(_rules)
      if (!_.isEmpty(this.fields)) {
        this.fields.forEach(field => {
          if (field.defaultRules) {
            rules = rules.concat(field.defaultRules)
          }
        })
      }
      return rules
    },
  },
  watch: {
    value: {
      handler: function(val) {
        if (!_.isEqual(val, this.iValue)) {
          this.iValue = typeof val === 'undefined' ? '' : _.cloneDeep(val)
        }
      },
      immediate: true,
      deep: true,
    },
    iValue: {
      handler(val) {
        if (!_.isEqual(val, this.value)) {
          this.$emit('input', val)
        }
      },
      deep: true,
      immediate: true,
    },
    isShowFormItem: {
      handler(isShow) {
        if (!(this.dynamicForm || {}).disabled) {
          isShow ? this.initFieldValue() : this.resetFieldValue()
        }
      },
    },
    setValue: {
      handler(val) {
        if (!_.isEmpty(val)) {
          this.$nextTick(() => {
            if (_.isArray(val)) {
              val.forEach(item => {
                _.get(item, 'condition') &&
                  !_.isEqual(this.iValue, _.get(item, 'set')) &&
                  (this.iValue = _.get(item, 'set'))
              })
            } else {
              _.get(val, 'condition') &&
                !_.isEqual(this.iValue, _.get(val, 'set')) &&
                (this.iValue = _.get(val, 'set'))
            }
          })
        }
      },
      immediate: true,
      deep: true,
    },
    rules: {
      handler: {
        handler() {
          this.$nextTick(() => {
            this.$refs['elFormItem'] &&
              this.$refs['elFormItem'].addValidateEvents()
          })
        },
        deep: true,
      },
    },
  },
  beforeCreate: function() {
    const fields = extendedFields.get()
    this.fieldTypeMap = fields.fieldTypeMap
    this.fieldDefault = fields.fieldDefault
    this.$options.components = Object.assign(
      {
        'el-form-item': elFormItem,
        'el-popover': elPopover,
        DynamicFieldGroup: DynamicFieldGroup,
        multiGroup: DynamicFieldMultiGroup,
      },
      fields.components
    )
  },
  created() {
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs['elFormItem'] && this.$refs['elFormItem'].addValidateEvents()
    })
  },
  beforeDestroy() {
    this.removeEvents()
  },
  methods: {
    init() {
      this.setDefault()
      this.registryEvents()
    },
    setDefault() {
      if (_.isUndefined(this.iValue) || this.iValue === '') {
        this.iValue = this.initValue(this.field)
      }
    },
    registryEvents() {
      this.$on('dynamicField.addField', field => {
        if (field) {
          this.fields.push(field)
        }
      })
      this.$on('dynamicField.removeField', field => {
        const index = this.fields.indexOf(field)
        if (index !== -1) {
          this.fields.splice(this.fields.indexOf(field), 1)
        }
      })
    },
    removeEvents() {
      this.$off('dynamicField.addField')
      this.$off('dynamicField.removeField')
    },
    convertValue(expression) {
      if (!_.isUndefined(this.$attrs['multi-group-index'])) {
        this.context['_multiGroupIndex'] = this.$attrs['multi-group-index']
      }
      if (typeof expression === 'string') {
        const _expression = canEvaluate(expression)
        if (_expression !== false) {
          try {
            return evaluateString(
              _expression,
              this.formData,
              this.parentValue,
              this.context
            )
          } catch (err) {
            console.error(err.message)
            console.error(`happen at ${expression}`)
            return expression
          }
        }
        return expression
      }
      if (typeof expression === 'function') {
        return expression(this.formData, this.parentValue, this.context)
      }
      if (_.isPlainObject(expression)) {
        const object = {}
        _.forOwn(expression, (value, key) => {
          object[key] = this.convertValue(value)
        })
        return object
      }
      if (_.isArray(expression)) {
        return expression.map(value => {
          return this.convertValue(value)
        })
      }
      return expression
    },
    resetFieldValue() {
      let copyValue = _.cloneDeep(this.iValue)
      if (this.isGroup) {
        this.field.reset
          ? this.transcribeStructure(this.field.fields, copyValue, true, true)
          : this.transcribeStructure(this.field.fields, copyValue, true, false)
      } else {
        if (!this.field.reset) {
          return
        }
        copyValue = this.cleanValue(this.field)
      }
      if (!_.isEqual(copyValue, this.iValue)) {
        this.iValue = copyValue
      }
    },
    initFieldValue() {
      let copyValue = _.cloneDeep(this.iValue)
      if (this.isGroup) {
        this.field.reset
          ? this.transcribeStructure(this.field.fields, copyValue, false, true)
          : this.transcribeStructure(this.field.fields, copyValue, false, false)
      } else {
        if (!this.field.reset) {
          return
        }
        copyValue = this.initValue(this.field)
      }
      if (!_.isEqual(copyValue, this.iValue)) {
        this.iValue = copyValue
      }
    },
    cleanValue(field) {
      if (!_.isUndefined(field.cleanValue)) {
        return field.cleanValue
      }
      let cleanValue = ''
      const actualType = field.group ? 'group' : field.type
      if (
        this.fieldDefault[actualType] &&
        this.fieldDefault[actualType].cleanValue
      ) {
        cleanValue = this.fieldDefault[actualType].cleanValue()
      }
      return cleanValue
    },

    initValue(field) {
      if (canEvaluate(field.default)) {
        return this.convertValue(field.default)
      } else if (!_.isUndefined(field.default) && field.default !== '') {
        return field.default
      }
      const actualType = field.group ? 'group' : field.type
      let value
      if (this.fieldDefault[actualType]) {
        value = this.fieldDefault[actualType].defaultValue(field.config)
      }
      return value || ''
    },
    transcribeStructure(structure, data, isReset, isGlobalExecute) {
      if (!_.isArray(structure) || _.isEmpty(structure)) {
        return
      }
      structure.forEach(field => {
        const isExecute = isGlobalExecute || field.reset
        const actualType = field.group ? 'group' : field.type
        const key = field.field
        if (actualType === 'group') {
          key
            ? this.transcribeStructure(
                field.fields,
                data[key],
                isReset,
                isGlobalExecute
              )
            : this.transcribeStructure(field.fields, data, isReset, isExecute)
        } else {
          if (key && isExecute) {
            data[key] = isReset ? this.cleanValue(field) : this.initValue(field)
          }
        }
      })
    },
    validate() {
      return new Promise((resolve, reject) => {
        if (this.$refs['field'] && this.$refs['field'].validate) {
          this.$refs['field']
            .validate()
            .then(valid => {
              resolve(valid)
            })
            .catch(err => {
              reject(err)
            })
        } else {
          resolve(true)
        }
      })
    },
  },
}
</script>
