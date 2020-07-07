<template>
  <el-checkbox-group
    v-model="iValue"
    class="dy-checkbox-group"
    v-on="$listeners"
  >
    <component
      :is="display === 'button' ? 'el-checkbox-button' : 'el-checkbox'"
      v-for="option in iOptions"
      :key="option.id"
      class="dy-checkbox-group__item"
      :label="option.id"
      :disabled="option.disabled"
    >
      {{ option.text }}
    </component>
  </el-checkbox-group>
</template>
<script>
import {generateOptions} from '@utils/data'
export default {
  name: 'DyCheckboxGroup',
  inheritAttrs: false,
  props: {
    value: {
      type: Array,
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
  },
  data() {
    return {
      iValue: [],
    }
  },
  computed: {
    iOptions() {
      return generateOptions(this.options, this.propMap)
    },
  },
  watch: {
    value: {
      handler(val) {
        this.iValue = val
      },
      immediate: true,
    },
    iValue: {
      handler(val) {
        this.$emit('input', val)
      },
    },
  },
  methods: {},
}
</script>
