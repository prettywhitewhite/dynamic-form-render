<template>
  <el-form
    ref="form"
    class="dy-form"
    :model="iData"
    :label-position="labelPosition"
    :label-width="labelWidth"
    :disabled="disabled"
    @submit.native.prevent
  >
    <template v-for="(item, index) in structure">
      <dynamic-field
        v-if="(item.group || item.display === 'group') && !item.field"
        ref="field"
        :value="iData"
        :field="item"
        :label-width="labelWidth"
        :parent-value="iData"
        :key="`dynamic-field-group--${index}`"
        :disabled="disabled"
        :is-group="!!item.group"
        :inline="!!item.inline"
        @input="handleValueChange"
      />
      <dynamic-field
        v-else
        ref="field"
        v-model="iData[item.field]"
        :field="item"
        :path="item.field"
        :parent-value="iData"
        :label-width="labelWidth"
        :key="
          item.field
            ? `dynamic-field-${item.field}--${index}`
            : `dynamic-field--${index}`
        "
        :disabled="disabled"
        :is-group="!!item.group"
        :inline="!!item.inline"
        @input="inputHandle"
      />
    </template>
  </el-form>
</template>
<script>
import eventHub from '@services/eventHub'
import DynamicField from './field'
import extendedFields from './utils/extendedFields'
import config from './config'
let fieldDefault
export default {
  name: 'DynamicForm',
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
          this.iData = val
        }
      },
      immediate: true,
    },
    iData: {
      handler: function(val) {
        this.$emit('input', val)
      },
      immdediate: true,
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
  methods: {
    init() {
      this.iData = this.data || {}
      this.registerEvents()
      transcribeStructure(this.structure, this.iData)
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
      return this.$refs['form']
        .validate()
        .then(valid => {
          return valid
        })
        .catch(() => {
          return false
        })
    },
    resetFields() {
      this.$refs['form'].resetFields()
    },
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
  },
}
function transcribeStructure(structure, iData) {
  structure.forEach(field => {
    const actualType = field.group ? 'group' : field.type
    const key = field.field
    if (key) {
      if (_.isUndefined(iData[key]) || iData[key] === '') {
        if (!_.isUndefined(field.default)) {
          iData[key] = field.default
          return
        }
        if (fieldDefault[actualType]) {
          iData[key] = fieldDefault[actualType].defaultValue(field.config) || ''
          if (!_.isEmpty(field.fields)) {
            transcribeStructure(
              field.fields,
              fieldDefault[actualType].itemDataScope(iData[key])
            )
          }
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
