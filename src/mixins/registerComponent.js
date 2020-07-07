import Emitter from '@mixins/emitter'
export default {
  data() {
    return {}
  },
  mixins: [Emitter],
  inject: {
    elFormItem: {
      default: '',
    },
  },
  computed: {
    validateState() {
      return this.elFormItem ? this.elFormItem.validateState : ''
    },
  },

  mounted() {
    this.dispatch('DynamicField', 'dynamicField.addField', [this])
  },

  methods: {
    dispatchChange(value) {
      this.dispatch('ElFormItem', 'el.form.change', [value])
    },
    dispatchBlur(value) {
      this.dispatch('ElFormItem', 'el.form.blur', [value])
    },
    clearValidate() {
      this.elFormItem && this.elFormItem.clearValidate()
    },
    validateFormItem(errorMessage) {
      if (this.elFormItem) {
        this.elFormItem.validateState = !errorMessage ? 'success' : 'error'
        this.elFormItem.validateMessage = errorMessage
      }
    },
  },
  beforeDestroy() {
    this.dispatch('DynamicField', 'dynamicField.removeField', [this])
  },
}
