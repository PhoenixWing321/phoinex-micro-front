import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AppManager from '../views/AppManager.vue'

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
    component: () => import('../views/About.vue')
  },
  {
    path: '/app-manager',
    name: 'AppManager',
    component: AppManager
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 