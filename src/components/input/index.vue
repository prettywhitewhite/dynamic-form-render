<template>
  <el-input
    class="dy-input"
    v-model="iValue"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>
<script>
import elInput from 'element-ui/lib/input'
export default {
  name: 'DyInput',
  components: {
    elInput,
  },
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    trim: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      iValue: null,
    }
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
        this.$emit('input', this.trim ? _.trim(val) : val)
      },
    },
  },
}
</script>
