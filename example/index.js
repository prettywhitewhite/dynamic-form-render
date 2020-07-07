import Vue from 'vue'
import App from './App.vue'
import dynamicForm from '../src/index'
Vue.use(dynamicForm)

new Vue({
  render: h => h(App),
}).$mount('#demo')
