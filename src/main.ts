import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // 假设你已经有了路由配置
import pinia from './store' // 导入pinia实例
import WujieVue from 'wujie-vue3' // 导入wujie

const app = createApp(App)

// 使用插件
app.use(router)
app.use(pinia) // 注册pinia
app.use(WujieVue)

app.mount('#app')
