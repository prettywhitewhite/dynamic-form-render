<template>
  <el-radio-group
    v-model="iValue"
    :class="{
      'dy-radio-group': true,
      'dy-radio-group--block': !inline,
      'dy-radio-group--plain': type === 'plain',
    }"
    :disabled="disabled"
    v-on="$listeners"
  >
    <component
      :is="display === 'button' ? 'el-radio-button' : 'el-radio'"
      v-for="option in iOptions"
      :key="option.id"
      class="dy-radio-group__item"
      :label="option.id"
      :disabled="option.disabled"
    >
      {{ option.text }}
    </component>
  </el-radio-group>
</template>
<script>
import elRadioGroup from 'element-ui/lib/radio-group'
import elRadioButton from 'element-ui/lib/radio-button'
import elRadio from 'element-ui/lib/radio'
import {generateOptions} from '@utils/data'
export default {
  name: 'DyRadioGroup',
  components: {
    elRadioGroup,
    elRadioButton,
    elRadio,
  },
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    display: {
      type: String,
      default: 'radio', // button
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    inline: {
      // 是否行内元素
      type: Boolean,
      default: true,
    },
    propMap: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: 'primary', // primary ,plain
    },
    byDefault: {
      // 默认选中options 第一个选项
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      iValue: null,
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
    iOptions: {
      handler(options) {
        if (
          this.byDefault &&
          (_.isNull(this.iValue) ||
            _.isUndefined(this.iValue) ||
            this.iValue === '') &&
          !_.isEmpty(this.iOptions) &&
          !this.iOptions.find(option => this.iValue === option.id)
        ) {
          this.$nextTick(() => {
            this.iValue = _.head(options).id
          })
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {},
}
</script>
