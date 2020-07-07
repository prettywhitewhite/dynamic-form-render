<template>
  <el-input class="dy-text" :value="iValue" v-bind="$attrs" readonly />
</template>
<script>
import elInput from 'element-ui/lib/input'
export default {
  name: 'DyText',
  components: {
    elInput,
  },
  props: {
    value: {
      required: false,
    },
    text: {
      // 强制设置显示内容
      type: String,
    },
  },
  computed: {
    iValue() {
      return this.text || this.value
    },
  },
}
</script>
