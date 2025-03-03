import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // 假设你已经有了路由配置
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import WujieVue from 'wujie-vue3' // 导入wujie
import { useFrameworkStore } from './store/framework'

// 创建Pinia实例并使用持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

// 使用插件 - 确保pinia在router之前注册
app.use(pinia) // 注册pinia
app.use(router)
app.use(WujieVue)

// 挂载应用
app.mount('#app')

// 初始化框架配置
const frameworkStore = useFrameworkStore()
// 加载配置文件
frameworkStore.loadConfig().then(() => {
  console.log('配置加载完成')
})
