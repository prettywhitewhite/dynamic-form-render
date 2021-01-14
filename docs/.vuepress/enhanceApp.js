import '../../dist/css/index.css'
import DynamicForm from '../../dist/lib/index.js'
export default({
	Vue,
	options, 
  router, // 当前应用的路由实例
  siteData, // 站点元数据
  isServer // 当前应用配置是处于 服务端渲染 或 客户端
})=>{
	Vue.use(DynamicForm)
}