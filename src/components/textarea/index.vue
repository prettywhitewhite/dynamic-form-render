<template>
  <div class="dy-textarea">
    <el-input
      v-model="iValue"
      class="dy-textarea__inner"
      type="textarea"
      v-bind="props"
      v-on="$listeners"
    />
    <span v-if="showWordLimit" class="dy-textarea__count">
      <span :class="{'is-overflow': max && count > max}">{{ count }}</span>
      <span v-if="max">/{{ max }}</span>
    </span>
  </div>
</template>
<script>
import wbCharCount from '@utils/wbCharCount'
export default {
  name: 'DyTextarea',
  props: {
    value: {},
    showWordLimit: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 0,
    },
    word: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      iValue: '',
    }
  },
  computed: {
    props() {
      return _.defaultsDeep({}, this.$attrs, {
        rows: 3,
        resize: 'none',
      })
    },
    count() {
      return this.word ? wbCharCount(this.iValue) : this.iValue.length
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
}
</script>
