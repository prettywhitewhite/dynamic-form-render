<template>
  <div class="dy-dynamic-field-multi-group">
    <div class="dy-dynamic-field-multi-group__units">
      <div
        v-for="(unit, index) in iData"
        class="dy-dynamic-field-multi-group__unit"
        :key="index"
      >
        <dynamic-field-group
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
            class="dy-dynamic-field-multi-group__unit__actions__button"
            :disabled="disabledAdd"
            @click="add(index)"
          >
            +
          </el-button>
          <el-button
            class="dy-dynamic-field-multi-group__unit__actions__button"
            :disabled="disabledRemove"
            @click="remove(index)"
          >
            -
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dynamicFieldGroup from './fieldGroup'
export default {
  name: 'DynamicFieldMultiGroup',
  components: {
    dynamicFieldGroup,
  },
  model: {
    prop: 'data',
    event: 'input',
  },
  props: {
    data: {
      type: Array,
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
      default: 1,
    },
    max: {
      // 最大组数
      type: Number,
      default: 0, // 0不做限制
    },
    defaultCount: {
      type: Number,
      default: 1, // 默认显示几组
    },
    /**
     *  使用multiGroup时 context中 _multiGroupIndex 为 unit的index
     */
  },
  data() {
    return {
      iData: [],
      pathPrefix: this.path ? this.path : '',
    }
  },
  computed: {
    unitsCount() {
      return _.isArray(this.iData) ? this.iData.length : 0
    },
    disabledAdd() {
      return this.disabled || (this.max > 0 && this.unitsCount >= this.max)
    },
    disabledRemove() {
      return this.disabled || (this.min > 0 && this.unitsCount <= this.min)
    },
  },
  watch: {
    data: {
      handler(val) {
        if (!_.isEqual(val, this.iData)) {
          this.iData = _.cloneDeep(val)
        }
      },
      immediate: true,
      deep: true,
    },
    iData: {
      handler(val) {
        if (!_.isEqual(val, this.data)) {
          this.$emit('input', val)
        }
      },
      deep: true,
    },
  },
  methods: {
    add(index = -1) {
      this.iData.splice(index + 1, 0, {})
    },
    remove(index) {
      this.iData.splice(index, 1)
    },
  },
}
</script>
