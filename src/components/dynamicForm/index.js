import extendedFields from './utils/extendedFields'
import DynamicForm from './form.vue'
DynamicForm.install = function(vue, options) {
  if (options) {
    extendedFields.set(options)
  }
  vue.component(DynamicForm.name, DynamicForm)
}
export default DynamicForm
