<template>
  <el-checkbox-group
    v-model="iValue"
    class="dy-checkbox-group"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <component
      :is="display === 'button' ? 'el-checkbox-button' : 'el-checkbox'"
      v-for="option in iOptions"
      class="dy-checkbox-group__item"
      :key="option.id"
      :label="option.id"
      :disabled="option.disabled"
      >{{ option.text }}</component
    >
  </el-checkbox-group>
</template>
<script>
import elCheckboxGroup from 'element-ui/lib/checkbox-group'
import elCheckboxButton from 'element-ui/lib/checkbox-button'
import elCheckbox from 'element-ui/lib/checkbox'
import {generateOptions} from '@utils/data'
export default {
  name: 'DyCheckboxGroup',
  inheritAttrs: false,
  components:{
    elCheckboxGroup,
    elCheckboxButton,
    elCheckbox
  },
  props: {
    value: {
      type: [Array, String],
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
    display: {
      type: String,
      default: 'el-checkbox',
    },
    propMap: {
      type: Object,
      default: null,
    },
    clean: {
      // 是否对value根据options进行清理
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      iValue: null,
    }
  },
  computed: {
    cleanValue() {
      return this.clean ? this.iOptions.map(option => option.id) : []
    },
    iOptions() {
      return generateOptions(this.options, this.propMap)
    },
  },
  watch: {
    value: {
      handler(val) {
        if (!_.isEqual(val, this.iValue)) {
          this.iValue = _.isArray(val) ? _.cloneDeep(val) : []
        }
      },
      immediate: true,
    },
    iValue: {
      handler(val) {
        this.$emit('input', this.clean ? this.handleClean(val) : val)
      },
    },
    options: {
      handler(val, oldVal) {
        if (!_.isEqual(val, oldVal)) {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      if (this.clean) {
        this.iValue = this.handleClean(this.value)
      }
    },
    handleClean(data) {
      return (data || []).filter(id => this.cleanValue.includes(id))
    },
  },
}
</script>
