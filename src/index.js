// import Vue from 'vue'
import DyInput from '@components/input'
import DyTextarea from '@components/textarea'
import checkboxGroup from '@components/checkboxGroup'
import contentTextarea from '@components/contentTextarea'
import dynamicField from '@components/dynamicField'
import dynamicForm from '@components/dynamicForm'
import radioGroup from '@components/radioGroup'
import simpleSelect from '@components/simpleSelect'
import upload from '@components/upload'

// import elementUI from 'element-ui'
import '@styles/index.scss'
// Vue.use(elementUI)
const components = [
  DyInput,
  DyTextarea,
  checkboxGroup,
  contentTextarea,
  dynamicField,
  dynamicForm,
  radioGroup,
  simpleSelect,
  upload,
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
