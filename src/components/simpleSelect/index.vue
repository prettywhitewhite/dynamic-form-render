<template>
  <el-select
    ref="field"
    v-model="iValue"
    class="dy-simple-select"
    :placeholder="placeholder"
    :filterable="filterable"
    :clearable="clearable"
    :remote="remote"
    :remote-method="remoteMethod"
    :loading="loadingOptions"
    :disabled="disabled"
    @change="emitEvent('change', $event)"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.text"
      :value="item.id"
    />
  </el-select>
</template>
<script>
import elSelect from 'element-ui/lib/select'
import elOption from 'element-ui/lib/option'
export default {
  name: 'DySimpleSelect',
  components: {
    elSelect,
    elOption,
  },
  props: {
    value: {
      required: true,
      default: null,
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    filterable: {
      type: Boolean,
      required: false,
      default: false,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: false,
    },
    options: {
      type: [Array, Object],
      required: false,
      default() {
        return []
      },
    },
    loadingOptions: {
      type: Boolean,
      required: false,
      default: false,
    },
    remote: {
      type: Boolean,
      required: false,
      default: false,
    },
    remoteMethod: {
      type: Function,
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      iValue: null,
      iIsValid: true,
      iOptions: [],
    }
  },
  watch: {
    value: {
      handler: function(val) {
        this.iValue = val
      },
      immediate: true,
    },
    isValid: {
      handler: function(val) {
        this.iIsValid = val
      },
      immediate: true,
    },
    iValue: function() {
      this.$emit('input', this.iValue)
    },
    iIsValid: function() {
      this.$emit('update:isValid', this.iIsValid)
    },
  },
  methods: {
    emitEvent(eventName, eventData) {
      this.$emit(eventName, eventData)
    },
  },
}
</script>
