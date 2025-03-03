import { defineStore } from 'pinia'
import type { FrameworkState, UserInfo, SubApp, MenuItem, OpenMode } from '../types/framework'

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
    showDrawer: false, // 是否显示应用抽屉
    
    // 系统状态
    isLoading: false, // 全局加载状态
    systemMessages: [], // 系统消息
    
    // 配置相关
    configLoaded: false, // 配置是否已加载
    mainMenu: [] as MenuItem[], // 主菜单配置
    openModes: [] as OpenMode[], // 打开方式配置
  }),
  
  // getters
  getters: {
    // 获取用户名
    username: (state): string => state.userInfo?.username || '未登录',
    
    // 判断是否是管理员
    isAdmin: (state): boolean => state.userInfo?.role === 'admin',
    
    // 获取当前激活的子应用名称
    currentAppName: (state): string => state.currentApp?.name || '',
    
    // 获取排序后的主菜单
    sortedMainMenu: (state): MenuItem[] => {
      // 确保mainMenu是数组
      const menu = state.mainMenu || [];
      return [...menu].sort((a, b) => a.order - b.order);
    },
    
    // 获取默认的打开方式
    defaultOpenMode: (state): OpenMode | undefined => {
      // 确保openModes是数组
      const modes = state.openModes || [];
      return modes.find(mode => mode.isDefault === true);
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
        const response = await fetch('/config.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const config = await response.json();
        
        // 加载默认应用
        if (this.subApps.length === 0 && config.defaultApps) {
          config.defaultApps.forEach((app: SubApp) => {
            this.registerSubApp(app);
          });
          
          // 如果有应用，默认激活第一个
          if (this.subApps.length > 0 && !this.currentApp) {
            this.activateApp(this.subApps[0].name);
          }
        }
        
        // 加载主菜单配置
        if (config.mainMenu) {
          this.mainMenu = config.mainMenu;
        }
        
        // 加载打开方式配置
        if (config.openModes) {
          this.openModes = config.openModes;
        }
        
        this.configLoaded = true;
        this.addSystemMessage('配置加载成功');
      } catch (error) {
        console.error('加载配置文件失败:', error);
        this.addSystemMessage('加载配置文件失败，请检查网络连接');
      } finally {
        this.setLoading(false);
      }
    },
    
    // 删除应用
    removeApp(appName: string): void {
      const index = this.subApps.findIndex(app => app.name === appName);
      if (index !== -1) {
        // 如果删除的是当前激活的应用，则需要重新激活其他应用
        if (this.currentApp && this.currentApp.name === appName) {
          this.currentApp = null;
          // 如果还有其他应用，则激活第一个
          if (this.subApps.length > 1) {
            const nextApp = this.subApps.find(app => app.name !== appName);
            if (nextApp) {
              this.activateApp(nextApp.name);
            }
          }
        }
        
        // 删除应用
        this.subApps.splice(index, 1);
        this.addSystemMessage(`应用 ${appName} 已删除`);
      }
    },
  },
  
  // 持久化配置
  persist: {
    key: 'framework-store',
    storage: localStorage,
    paths: ['currentTheme', 'sidebarCollapsed', 'userInfo', 'isLoggedIn', 'subApps', 'currentApp', 'showDrawer', 'mainMenu', 'openModes']
  }
}) 