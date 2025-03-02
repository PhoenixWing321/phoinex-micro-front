import { defineStore } from 'pinia'
import type { FrameworkState, UserInfo, SubApp } from '../types/framework'

// 定义框架级别的store
export const useFrameworkStore = defineStore('framework', {
  // 状态
  state: (): FrameworkState => ({
    // 布局相关
    sidebarCollapsed: false, // 侧边栏是否折叠
    currentTheme: 'light', // 当前主题：light或dark
    
    // 用户相关
    userInfo: null, // 用户信息
    isLoggedIn: false, // 是否已登录
    
    // 微前端相关
    subApps: [], // 子应用列表
    currentApp: null, // 当前激活的子应用
    
    // 系统状态
    isLoading: false, // 全局加载状态
    systemMessages: [], // 系统消息
  }),
  
  // getters
  getters: {
    // 获取用户名
    username: (state): string => state.userInfo?.username || '未登录',
    
    // 判断是否是管理员
    isAdmin: (state): boolean => state.userInfo?.role === 'admin',
    
    // 获取当前激活的子应用名称
    currentAppName: (state): string => state.currentApp?.name || '',
  },
  
  // actions
  actions: {
    // 切换侧边栏状态
    toggleSidebar(): void {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    
    // 切换主题
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      // 更新根元素的data-theme属性
      document.documentElement.setAttribute('data-theme', this.currentTheme)
    },
    
    // 设置用户信息并登录
    login(userInfo: UserInfo): void {
      this.userInfo = userInfo
      this.isLoggedIn = true
    },
    
    // 登出
    logout(): void {
      this.userInfo = null
      this.isLoggedIn = false
    },
    
    // 注册子应用
    registerSubApp(app: SubApp): void {
      if (!this.subApps.find(a => a.name === app.name)) {
        this.subApps.push(app)
      }
    },
    
    // 激活子应用
    activateApp(appName: string): boolean {
      const app = this.subApps.find(a => a.name === appName)
      if (app) {
        this.currentApp = app
        return true
      }
      return false
    },
    
    // 设置全局加载状态
    setLoading(status: boolean): void {
      this.isLoading = status
    },
    
    // 添加系统消息
    addSystemMessage(message: string): void {
      this.systemMessages.push({
        id: Date.now(),
        content: message,
        timestamp: new Date().toISOString(),
        read: false
      })
    },
    
    // 标记消息为已读
    markMessageAsRead(messageId: number): void {
      const message = this.systemMessages.find(m => m.id === messageId)
      if (message) {
        message.read = true
      }
    },
    
    // 清除所有消息
    clearAllMessages(): void {
      this.systemMessages = []
    },
    
    // 初始化主题
    initTheme(): void {
      // 确保DOM加载后再设置主题
      if (document && document.documentElement) {
        document.documentElement.setAttribute('data-theme', this.currentTheme)
      }
    }
  },
  
  // 持久化配置
  persist: {
    key: 'framework-store',
    storage: localStorage,
    paths: ['currentTheme', 'sidebarCollapsed', 'userInfo', 'isLoggedIn']
  }
}) 