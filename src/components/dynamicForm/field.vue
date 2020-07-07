<template>
  <el-form-item
    ref="elFormItem"
    v-if="show && !hide"
    class="dy-form-field"
    :label="field.label"
    :label-width="field.label !== undefined ? labelWidth : '0px'"
    :class="className"
    :prop="path"
    :rules="show ? rules : null"
    v-on="dispatchFormItemEvent"
  >
    <component
      :is="componentName"
      ref="field"
      v-model.trim="iValue"
      v-bind="props"
      :fields="field.fields"
      :path="path"
      :disabled="computedDisabled"
      :class="compoentClassName"
      :style="computedStyle"
      :labelWidth="labelWidth"
      v-on="listeners"
    />
    <slot name="footer">
      <p
        :class="{'dy-form-field__desc': true, 'is-offset': !!field.tips}"
        v-if="field.desc"
      >
        {{ field.desc }}
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
import {isFunction, evaluateString} from './utils/utils'
import generateRules from './utils/generateRules'
import config from './config'
import extendedFields from './utils/extendedFields'
import Emitter from '@mixins/emitter'
import elFormItem from 'element-ui/lib/form-item'
import elPopover from 'element-ui/lib/popover'
import dynamicFieldGroup from './fieldGroup'
import dynamicFieldMultiGroup from './fieldMultiGroup'
export default {
  name: 'DynamicField',
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
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      iValue: '',
      defaultProps: {},
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
        ? 'dynamicFieldGroup'
        : this.fieldTypeMap[this.field.type] || this.field.type
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
      const props = _.omit(this.config, 'on')
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
    compoentClassName() {
      return !_.isUndefined(this.field.class)
        ? this.convertValue(this.field.class)
        : null
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
    className() {
      let path = this.path.replace('.', '-')
      const classNames = []
      path && classNames.push('dy-form-field--' + path)
      if (this.field.type === 'hidden') {
        classNames.push('is-hidden')
      }
      if (this.errorMsg) {
        classNames.push('is-error')
      }
      return classNames.join(' ')
    },
    formData() {
      return this.dynamicForm.iData
    },
    context() {
      return this.dynamicForm.formContext
    },
    rules() {
      let rules = generateRules(this.field.rules)
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
    },
    field: {
      handler() {
        // this.init()
      },
      deep: true,
    },
    setValue: {
      handler(val) {
        if (!_.isEmpty(val)) {
          this.$nextTick(() => {
            if (_.isArray(val)) {
              val.forEach(item => {
                _.get(item, 'condition') && (this.iValue = _.get(item, 'set'))
              })
            } else {
              _.get(val, 'condition') && (this.iValue = _.get(val, 'set'))
            }
          })
        }
      },
      immediate: true,
      deep: true,
    },
  },
  beforeCreate: function() {
    //resolve circular dependency
    let fields = Object.assign({}, config)
    fields = extendedFields.mergeWith(fields)

    this.fieldTypeMap = fields.fieldTypeMap
    this.fieldDefault = fields.fieldDefault
    this.$options.components = Object.assign(
      {
        'el-form-item': elFormItem,
        'el-popover': elPopover,
        dynamicFieldGroup: dynamicFieldGroup,
        multiGroup: dynamicFieldMultiGroup,
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
  methods: {
    init() {
      this.registryEvents()
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
    convertValue(expression) {
      if (!_.isUndefined(this.$attrs['multi-group-index'])) {
        this.context['_multiGroupIndex'] = this.$attrs['multi-group-index']
      }
      if (typeof expression === 'string') {
        const _expression = isFunction(expression)
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
    // setDefaultValue() {
    //   if (
    //     _.isNull(this.iValue) ||
    //     _.isUndefined(this.iValue) ||
    //     this.iValue === ''
    //   ) {
    //     if (!_.isUndefined(this.field.default) && this.field.default !== '') {
    //       this.iValue = this.field.default
    //     } else {
    //       if (this.fieldDefault[this.field.type]) {
    //         const value = this.fieldDefault[this.field.type].defaultValue(
    //           this.field.config
    //         )
    //         !_.isUndefined(value) && (this.iValue = value)
    //       }
    //     }
    //   }
    // },

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
