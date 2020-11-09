<template>
  <el-form
    ref="form"
    class="dy-form"
    :model="iData"
    :label-position="labelPosition"
    :label-width="labelWidth"
    :disabled="disabled"
    :readonly="readonly"
    @submit.native.prevent
  >
    <div
      v-for="(item, index) in structure"
      :key="index"
      :class="[
        `dy-form-fields--${index}`,
        item.id ? `dy-form-fields--${item.id}` : null,
      ]"
    >
      <slot name="sectionHead" v-bind="getSlotData(item, index)" />
      <dynamic-field
        v-if="item.field"
        ref="field"
        :class="{'dy-form-section': !!item.group && item.display === 'section'}"
        v-model="iData[item.field]"
        :field="item"
        :path="item.field"
        :parent-value="iData"
        :label-width="labelWidth"
        :key="`dynamic-field--${index}--${item.field}`"
        :disabled="disabled"
        :is-group="!!item.group"
        :inline="!!item.inline"
        @input="inputHandle"
      />
      <dynamic-field
        v-else-if="item.group || item.display === 'group'"
        ref="field"
        :class="{'dy-form-section': item.display === 'section'}"
        :value="iData"
        :field="item"
        :label-width="labelWidth"
        :parent-value="iData"
        :key="`dynamic-field--${index}--group`"
        :disabled="disabled"
        :is-group="!!item.group"
        :inline="!!item.inline"
        @input="handleValueChange"
      />
      <dynamic-field
        v-else
        ref="field"
        :field="item"
        :label-width="labelWidth"
        :parent-value="iData"
        :key="`dynamic-field--${index}`"
        :disabled="disabled"
      />
      <slot name="sectionFooter" v-bind="getSlotData(item, index)" />
    </div>
    <slot name="footer" />
  </el-form>
</template>
<script>
import eventHub from '@services/eventHub'
import {canEvaluate} from './utils/utils'
import DynamicField from './field'
import extendedFields from './utils/extendedFields'
import config from './config'
let fieldDefault
export default {
  name: 'DynamicForm',
  inheritAttrs: false,
  components: {
    DynamicField,
  },
  model: {
    prop: 'data',
    event: 'input',
  },
  provide() {
    return {
      dynamicForm: this,
    }
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
      required: false,
    },
    structure: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: [String, Number],
      required: false,
      default: '140px',
    },
    labelPosition: {
      type: String,
      requried: false,
    },
    context: {
      // 上下文
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      iData: {},
      iContext: {},
    }
  },
  computed: {
    formContext() {
      return Object.assign({}, this.iContext, {
        set: (key, value) => {
          eventHub.trigger('context-change', key, value)
        },
      })
    },
  },
  watch: {
    data: {
      handler: function(val) {
        if (!_.isEqual(this.iData, val)) {
          this.iData = _.cloneDeep(val)
        }
      },
      immediate: true,
      deep: true,
    },
    iData: {
      handler: function(val) {
        if (!_.isEqual(val, this.data)) {
          this.$emit('input', val)
        }
      },
      deep: true,
      immediate: true,
    },
    structure: {
      handler() {
        this.init()
      },
      deep: true,
    },
    context: {
      handler(context) {
        if (!_.isEqual(context, this.iContext)) {
          this.iContext = context
        }
      },
      immediate: true,
      deep: true,
    },
    iContext: {
      handler(context) {
        this.$emit('update:context', context)
      },
      deep: true,
    },
  },
  beforeCreate() {
    fieldDefault = extendedFields.mergeWith(Object.assign({}, config))
      .fieldDefault
  },
  created() {
    this.init()
  },
  mounted() {
    this.$emit('register', this)
  },
  beforeDestroy() {
    this.$emit('beforeDestroy', this)
  },
  destroyed() {
    this.$emit('destroyed')
  },
  methods: {
    init() {
      this.registerEvents()
      const data = _.cloneDeep(this.iData)
      transcribeStructure(this.structure, data)
      this.iData = Object.assign({}, data)
    },
    registerEvents() {
      eventHub.off('context-change')
      eventHub.on('context-change', (key, value) => {
        this.iContext = Object.assign({}, this.iContext, {[`${key}`]: value})
      })
    },
    inputHandle() {
      this.iData = Object.assign({}, this.iData) //deep object reactivity not triggering el-form-item fieldValue recalculation
    },
    handleValueChange(val) {
      this.iData = Object.assign({}, this.iData, val)
    },
    validate() {
      if (this.$refs['form'] && this.$refs['form'].validate) {
        return this.$refs['form']
          .validate()
          .then(valid => {
            return valid
          })
          .catch(() => {
            return false
          })
      }
      return true
    },
    resetFields() {
      this.$refs['form'].resetFields()
    },
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    getSlotData(field, index) {
      return !_.isUndefined(field.id) && field.id !== ''
        ? {
            id: field.id,
            index: index,
          }
        : {
            index: index,
          }
    },
  },
}

function transcribeStructure(structure, iData) {
  structure.forEach(field => {
    const actualType = field.group ? 'group' : field.type
    const key = field.field
    if (key) {
      if (_.isUndefined(iData[key]) || iData[key] === '') {
        if (
          !_.isUndefined(field.default) &&
          field.default !== '' &&
          !canEvaluate(field.default)
        ) {
          iData[key] = field.default
        } else if (fieldDefault[actualType]) {
          iData[key] = fieldDefault[actualType].defaultValue(field.config) || ''
          if (
            !_.isEmpty(field.fields) &&
            fieldDefault[actualType].itemDataScope
          ) {
            transcribeStructure(
              field.fields,
              fieldDefault[actualType].itemDataScope(iData[key])
            )
          }
        } else {
          iData[key] = ''
        }
      }
    } else if (actualType === 'group' && !_.isEmpty(field.fields)) {
      transcribeStructure(
        field.fields,
        fieldDefault[actualType].itemDataScope(iData)
      )
    }
  })
}
</script>
