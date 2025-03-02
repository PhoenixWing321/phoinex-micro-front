import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // 假设你已经有了路由配置
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import WujieVue from 'wujie-vue3' // 导入wujie

// 创建Pinia实例
const pinia = createPinia()

// 应用持久化插件
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

// 使用插件
app.use(router)
app.use(pinia) // 注册pinia
app.use(WujieVue)

app.mount('#app')
