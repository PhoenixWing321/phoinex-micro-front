import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AppManager from '../views/AppManager.vue'
import About from '../views/About.vue'

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      standalone: true
    }
  },
  {
    path: '/app-manager',
    name: 'AppManager',
    component: AppManager,
    meta: {
      standalone: true
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 