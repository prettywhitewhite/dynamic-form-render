<template>
  <div class="dy-dynamic-field-multi-group">
    <div class="dy-dynamic-field-multi-group__units">
      <div
        v-for="(unit, index) in iData"
        class="dy-dynamic-field-multi-group__unit"
        :key="index"
      >
        <dynamic-field-group
          v-if="delayShow"
          class="dy-dynamic-field-multi-group__unit__fields"
          v-model="iData[index]"
          :labelWidth="labelWidth"
          :disabled="disabled"
          :fields="fields"
          :path="`${path}:${index}`"
          :multi-group-index="index"
        />
        <div class="dy-dynamic-field-multi-group__unit__actions">
          <el-button
            v-show="!disabledAdd"
            class="dy-dynamic-field-multi-group__unit__actions__button"
            :disabled="disabledAdd"
            @click="add(index)"
          >
            +
          </el-button>
          <el-button
            v-show="!disabledRemove"
            class="dy-dynamic-field-multi-group__unit__actions__button"
            :disabled="disabledRemove"
            @click="remove(index)"
          >
            -
          </el-button>
        </div>
      </div>
    </div>
    <div class="dy-dynamic-field-multi-group__batch">
      <el-button v-show="showStep" @click="addBatch">
        {{ stepText }}
      </el-button>
    </div>
  </div>
</template>
<script>
import extendedFields from './utils/extendedFields'
import DynamicFieldGroup from './fieldGroup'
export default {
  name: 'DynamicFieldMultiGroup',
  components: {
    DynamicFieldGroup,
  },
  model: {
    prop: 'data',
    event: 'input',
  },
  props: {
    data: {
      type: [Array, String],
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
    labelWidth: {
      type: [String, Number],
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    path: {
      type: String,
      required: true,
    },
    min: {
      // 最小组数
      type: Number,
      default: 1, // 至少为1
    },
    max: {
      // 最大组数
      type: Number,
      default: 0, // 0不做限制
    },
    /**
     *  使用multiGroup时 context中 _multiGroupIndex 为 unit的index
     */
    step: {
      type: Number,
      default: 0,
    },
    stepText: {
      type: String,
      default: '+ 新增一组',
    },
  },
  data() {
    return {
      iData: null,
      pathPrefix: this.path ? this.path : '',
      delayShow: false,
    }
  },
  computed: {
    unitsCount() {
      return _.isArray(this.iData) ? this.iData.length : 1
    },
    localMin() {
      return this.min > 0 ? this.min : 1
    },
    disabledAdd() {
      return (
        this.disabled ||
        (this.max > 0 && this.unitsCount >= this.max) ||
        this.step > 0
      )
    },
    disabledRemove() {
      return this.disabled || this.unitsCount <= this.localMin || this.step > 0
    },
    dataStructure() {
      return this.transcribeStructure(this.fields, {}, this.initField)
    },
    showStep() {
      return (
        this.step > 0 &&
        !this.disabled &&
        this.min < this.max &&
        this.unitsCount < this.max
      )
    },
  },
  watch: {
    data: {
      handler(val) {
        if (
          !_.isEqual(val, this.iData) ||
          _.toArray(val).length < this.localMin
        ) {
          this.iData = this.processData(val)
        }
      },
      immediate: true,
      deep: true,
    },
    iData: {
      handler(val) {
        this.$emit('input', val)
      },
      immediate: true,
      deep: true,
    },
  },
  beforeCreate() {
    const fields = extendedFields.get()
    this.fieldTypeMap = fields.fieldTypeMap
    this.fieldDefault = fields.fieldDefault
  },
  created() {
    this.$nextTick(() => {
      this.delayShow = true
    })
  },
  methods: {
    processData(dataParam) {
      let data = _.isArray(dataParam) ? _.cloneDeep(dataParam) : []
      if (data.length < this.localMin) {
        data = data.concat(
          _.fill(Array(this.localMin - data.length), this.dataStructure)
        )
      }
      return data
    },
    add(index = -1) {
      this.iData.splice(index + 1, 0, Object(this.dataStructure))
    },
    addBatch() {
      for (let i = 0; i < this.step; i++) {
        if (this.unitsCount >= this.max) {
          break
        }
        this.iData.push(Object(this.dataStructure))
      }
    },
    remove(index) {
      this.iData.splice(index, 1)
    },
    initField(field) {
      if (!_.isUndefined(field.default) && field.default !== '') {
        return field.default
      }
      const actualType = field.group ? 'group' : field.type
      let value
      if (this.fieldDefault[actualType]) {
        value = this.fieldDefault[actualType].defaultValue(field.config)
      }
      return value || ''
    },
    transcribeStructure(structure, data, handleFunc) {
      if (!_.isArray(structure) || _.isEmpty(structure)) {
        return
      }
      structure.forEach(field => {
        const actualType = field.group ? 'group' : field.type
        const key = field.field
        if (actualType === 'group') {
          key
            ? this.transcribeStructure(field.fields, data[key], handleFunc)
            : this.transcribeStructure(field.fields, data, handleFunc)
        } else {
          if (key && _.isFunction(handleFunc)) {
            data[key] = handleFunc(field)
          }
        }
      })
      return data
    },
  },
}
</script>
