import DyInput from '@components/input'
import DyTextarea from '@components/textarea'
import checkboxGroup from '@components/checkboxGroup'
import dynamicField from '@components/dynamicField'
import dynamicForm from '@components/dynamicForm'
import radioGroup from '@components/radioGroup'
import simpleSelect from '@components/simpleSelect'
import '@styles/index.scss'
const components = [
  DyInput,
  DyTextarea,
  checkboxGroup,
  dynamicField,
  dynamicForm,
  radioGroup,
  simpleSelect,
]
export default {
  install(Vue, options) {
    components.forEach(component => {
      if (component.install) {
        component.install(Vue, options || {})
      } else {
        Vue.component(component.name, component)
      }
    })
  },
}
