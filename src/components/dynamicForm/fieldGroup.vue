<template>
  <div
    :class="{
      'dy-dynamic-field-group': true,
      'dy-dynamic-field-group--inline': inline,
    }"
  >
    <template v-for="(item, index) in fields">
      <dynamic-field
        v-if="item.field"
        ref="field"
        v-model="iValue[item.field]"
        :field="item"
        :path="pathPrefix + '.' + item.field"
        :label-width="labelWidth"
        :disabled="disabled"
        :parent-value="iValue"
        :key="`dynamic-field--${index}--${item.field}`"
        :is-group="!!item.group"
        :inline="!!item.inline"
        :multi-group-index="$attrs['multi-group-index']"
        @input="inputHandle"
      />
      <dynamic-field
        v-else-if="item.group || item.display === 'group'"
        ref="field"
        :value="iValue"
        :field="item"
        :path="pathPrefix"
        :label-width="labelWidth"
        :parent-value="iValue"
        :key="`dynamic-field--${index}--group`"
        :disabled="disabled"
        :is-group="!!item.group"
        :inline="!!item.inline"
        :multi-group-index="$attrs['multi-group-index']"
        @input="handleValueChange"
      />
      <dynamic-field
        v-else
        ref="field"
        :field="item"
        :label-width="labelWidth"
        :parent-value="iValue"
        :key="`dynamic-field--${index}`"
        :disabled="disabled"
      />
    </template>
  </div>
</template>
<script>
export default {
  name: 'DynamicFieldGroup',
  props: {
    value: {
      type: Object,
      default: () => ({}),
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
      default: '',
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      iValue: {},
      pathPrefix: this.path ? this.path : '',
    }
  },
  watch: {
    value: {
      handler(val) {
        if (!_.isEqual(val, this.iValue)) {
          this.iValue = !_.isEmpty(val) ? _.cloneDeep(val) : {}
        }
      },
      immediate: true,
      deep: true,
    },
    iValue: {
      handler(val) {
        if (!_.isEqual(val, this.value)) {
          this.$emit('input', val)
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    inputHandle() {
      this.iValue = Object.assign({}, this.iValue)
    },
    handleValueChange(val) {
      this.iValue = Object.assign({}, this.iValue, val)
    },
  },
}
</script>
