import { defineStore } from 'pinia'
import type { SubApp, MenuItem, OpenMode, SystemMessage, UserInfo, FrameworkState } from '../types/framework'
import axios from 'axios'

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
    currentAppName: null, // 当前激活的子应用
    showDrawer: false, // 是否显示应用抽屉
    
    // 系统状态
    isLoading: false, // 全局加载状态
    systemMessages: [], // 系统消息
    
    // 配置相关
    configLoaded: false, // 配置是否已加载
    mainMenu: [], // 主菜单配置
    openModes: [], // 打开方式配置
    mdiApps: [], // 添加MDI应用列表
  }),
  
  // getters
  getters: {
    // 获取用户名
    username: (state): string => state.userInfo?.username || '未登录',
    
    // 判断是否是管理员
    isAdmin: (state): boolean => state.userInfo?.role === 'admin',
    
    // 获取当前激活的子应用名称 - 重命名以避免与state冲突
    activeAppName: (state): string => state.currentAppName || '',
    
    // 获取排序后的主菜单
    sortedMainMenu: (state): MenuItem[] => {
      return [...state.mainMenu].sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    
    // 获取默认的打开方式
    defaultOpenMode: (state): OpenMode | undefined => {
      // 确保openModes是数组
      const modes = state.openModes || [];
      return modes.find(mode => mode.isDefault === true);
    },
    
    currentApp: (state): SubApp | null => {
      return state.subApps.find(app => app.name === state.currentAppName) || null;
    },
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
      this.initTheme()
    },
    
    // 设置用户信息并登录
    setUserInfo(userInfo: UserInfo | null): void {
      this.userInfo = userInfo
      this.isLoggedIn = !!userInfo
    },
    
    // 添加登录方法
    login(userInfo: UserInfo): void {
      this.setUserInfo(userInfo)
    },
    
    // 登出
    logout(): void {
      this.userInfo = null
      this.isLoggedIn = false
    },
    
    // 注册子应用
    registerSubApp(app: SubApp): void {
      // 检查应用是否已存在
      const existingAppIndex = this.subApps.findIndex(a => a.name === app.name)
      if (existingAppIndex >= 0) {
        // 更新现有应用
        this.subApps[existingAppIndex] = app
      } else {
        // 添加新应用
        this.subApps.push(app)
      }
    },
    
    // 激活子应用
    activateApp(appName: string): void {
      this.currentAppName = appName
    },
    
    // 设置全局加载状态
    setLoading(status: boolean): void {
      this.isLoading = status
    },
    
    // 添加系统消息
    addSystemMessage(text: string, type: 'info' | 'error' | 'success' = 'info'): void {
      const id = Date.now()
      this.systemMessages.push({ id, text, type })
      
      // 2.5秒后自动移除消息
      setTimeout(() => {
        this.removeSystemMessage(id)
      }, 2500)
    },
    
    // 移除系统消息 - 添加缺失的方法
    removeSystemMessage(messageId: number): void {
      const index = this.systemMessages.findIndex(m => m.id === messageId)
      if (index >= 0) {
        this.systemMessages.splice(index, 1)
      }
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
      // 将主题应用到DOM
      document.documentElement.setAttribute('data-theme', this.currentTheme)
    },
    
    // 设置抽屉显示状态
    setShowDrawer(status: boolean): void {
      this.showDrawer = status
    },
    
    // 执行菜单动作
    executeMenuAction(actionName: string): void {
      // 使用类型安全的方式调用动作
      const actionMap: Record<string, () => void> = {
        toggleTheme: this.toggleTheme,
        toggleSidebar: this.toggleSidebar,
        // 可以添加更多动作映射
      };
      
      if (actionMap[actionName]) {
        actionMap[actionName]();
      } else {
        console.warn(`未找到菜单动作: ${actionName}`);
      }
    },
    
    // 从配置文件加载默认应用和菜单配置
    async loadConfig(): Promise<void> {
      if (this.configLoaded) return;
      
      try {
        this.setLoading(true);
        const response = await axios.get('/config.json');
        
        const config = response.data;
        
        // 加载默认应用
        if (config.defaultApps && Array.isArray(config.defaultApps)) {
          config.defaultApps.forEach((app: SubApp) => {
            this.registerSubApp(app);
          });
          
          // 如果有应用但没有激活的应用，则激活第一个
          if (this.subApps.length > 0 && !this.currentAppName) {
            this.currentAppName = this.subApps[0].name;
          }
        }
        
        // 加载主菜单配置
        if (config.mainMenu && Array.isArray(config.mainMenu)) {
          this.mainMenu = config.mainMenu;
        }
        
        // 加载打开方式配置
        if (config.openModes && Array.isArray(config.openModes)) {
          this.openModes = config.openModes;
        }
        
        this.configLoaded = true;
        this.addSystemMessage('配置加载成功', 'success');
      } catch (error) {
        console.error('加载配置文件失败:', error);
        this.addSystemMessage('加载配置文件失败，请检查网络连接', 'error');
      } finally {
        this.setLoading(false);
      }
    },
    
    // 删除应用
    removeApp(appName: string): void {
      const index = this.subApps.findIndex(app => app.name === appName);
      if (index >= 0) {
        // 如果删除的是当前激活的应用，则清除当前应用
        if (this.currentAppName === appName) {
          this.currentAppName = this.subApps.length > 0 ? this.subApps[0].name : null;
        }
        
        // 删除应用
        this.subApps.splice(index, 1);
        this.addSystemMessage(`应用 ${appName} 已删除`, 'info');
        
        // 如果删除的是MDI应用，也从MDI应用列表中移除
        this.removeMdiApp(appName);
      }
    },
    
    // 添加MDI应用
    addMdiApp(app: SubApp) {
      // 检查应用是否已在MDI列表中
      const existingAppIndex = this.mdiApps.findIndex(a => a.name === app.name)
      if (existingAppIndex >= 0) {
        // 更新现有应用
        this.mdiApps[existingAppIndex] = app
      } else {
        // 添加新应用
        this.mdiApps.push(app)
      }
    },
    
    // 从MDI列表中移除应用
    removeMdiApp(appName: string) {
      const index = this.mdiApps.findIndex(app => app.name === appName)
      if (index >= 0) {
        this.mdiApps.splice(index, 1)
      }
    },
  },
  
  // 持久化配置
  persist: {
    key: 'framework-store',
    storage: localStorage,
    paths: ['currentTheme', 'sidebarCollapsed', 'userInfo', 'isLoggedIn', 'subApps', 'currentAppName', 'showDrawer', 'mainMenu', 'openModes', 'mdiApps']
  }
}) 