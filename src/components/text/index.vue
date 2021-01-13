<template>
  <span class="dy-text" :class="`dy-text--${type}`">
    <i v-if="prefixIcon" :class="prefixIcon" class="dy-text__prefix-icon" />
    {{ iValue }}
    <i v-if="suffixIcon" :class="suffixIcon" class="dy-text__suffix-icon" />
  </span>
</template>
<script>
export default {
  name: 'DyText',
  components: {},
  props: {
    value: {
      required: false,
    },
    text: {
      // 强制设置显示内容
      type: String,
    },
    type: {
      type: String,
      default: 'info', // 'success','warning','error'
    },
    prefixIcon: {
      // 文本头部图标
      type: String,
      default: '',
    },
    suffixIcon: {
      // 文本尾部图标
      type: String,
      default: '',
    },
  },
  computed: {
    iValue() {
      return this.text || this.value
    },
  },
}
</script>
