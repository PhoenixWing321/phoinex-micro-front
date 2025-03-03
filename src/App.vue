<template>
  <div v-if="isStandalonePage" class="standalone-container" :data-theme="store.currentTheme">
    <router-view />
  </div>
  <div v-else class="app-container" :data-theme="store.currentTheme">
    <!-- 左侧边栏 -->
    <div class="sidebar" :class="{ 'collapsed': store.sidebarCollapsed }">
      <!-- 顶部标题和控制区 -->
      <FrameworkHeader @toggle-sidebar="toggleSidebar" />

      <button @click="toggleSidebar" class="toggle-btn">
        {{ store.sidebarCollapsed ? '>' : '<' }} </button>

          <!-- 中间导航区 -->
          <nav>
            <template v-for="item in store.sortedMainMenu" :key="item.id">
              <a @click="executeMenuAction(item)" class="nav-link">
                <i class="nav-icon">{{ item.icon }}</i>
                <span class="nav-text">{{ item.name }}</span>
              </a>
            </template>
          </nav>

          <!-- 底部用户区 -->
          <UserPanel />
    </div>

    <!-- 右侧内容区 -->
    <div class="content-wrapper">
      <!-- 路由视图 -->
      <div v-show="!showMdiContainer">
        <router-view />
      </div>

      <!-- MDI容器 -->
      <div v-show="showMdiContainer" class="mdi-container">
        <!-- 无界应用容器 - MDI模式 -->
        <div class="mdi-tabs">
          <button class="mdi-tab-home" @click="showHome">
            <i class="nav-icon">🏠</i>
            <span>首页</span>
          </button>
          <div class="mdi-tab-divider"></div>
          <div class="mdi-tab-list">
            <button v-for="app in store.mdiApps" 
                    :key="app.name"
                    class="mdi-tab"
                    :class="{ 'active': app.name === store.currentAppName }"
                    @click="activateApp(app.name)">
              <span class="mdi-tab-title">{{ app.name }}</span>
              <span class="mdi-tab-close" @click.stop="closeMdiApp(app.name)">×</span>
            </button>
          </div>
        </div>
        <div v-for="(app, index) in store.mdiApps" 
             :key="app.name" 
             :id="app.container" 
             class="wujie-container-mdi"
             :class="{ 'active': app.name === store.currentAppName }"
             :style="{ 
               top: 40 + index * 30 + 'px', 
               left: index * 30 + 'px', 
               zIndex: app.name === store.currentAppName ? 100 : 10 + index 
             }">
          <div class="mdi-window-header">
            <span class="mdi-window-title">{{ app.name }}</span>
            <button class="mdi-window-close" @click="closeMdiApp(app.name)">×</button>
          </div>
          <div class="mdi-window-content"></div>
        </div>
        
        <!-- 无应用时的提示 -->
        <div v-if="store.mdiApps.length === 0" class="no-mdi-apps">
          <p>没有打开的应用</p>
          <button @click="openAppManager" class="open-app-btn">打开应用</button>
        </div>
      </div>
    </div>

    <!-- 应用抽屉 -->
    <div class="app-drawer" :class="{ 'drawer-open': store.showDrawer }">
      <div class="drawer-header">
        <h2>{{ drawerTitle }}</h2>
        <button @click="closeDrawer" class="close-drawer">×</button>
      </div>
      <div class="drawer-content">
        <!-- 路由内容 -->
        <DrawerRouteView v-if="drawerType === 'route'" :path="drawerRoutePath" :hide-header="true" />
        <div v-else class="no-app-selected">
          drawerType= {{ drawerType }} 不正确
        </div>
      </div>
    </div>

    <!-- 抽屉遮罩层 -->
    <div v-if="store.showDrawer" class="drawer-overlay" @click="closeDrawer"></div>

    <!-- 系统消息组件 -->
    <SystemMessages />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFrameworkStore } from './store/framework'
import FrameworkHeader from './components/FrameworkHeader.vue'
import UserPanel from './components/UserPanel.vue'
import AppManager from './views/AppManager.vue'
import DrawerRouteView from './components/DrawerRouteView.vue'
import SystemMessages from './components/SystemMessages.vue'
import type { SubApp, MenuItem } from './types/framework'
import WujieVue from 'wujie-vue3'

const router = useRouter()
const route = useRoute()

const { setupApp } = WujieVue

const store = useFrameworkStore()
const drawerType = ref<'app-manager' | 'wujie-app' | 'route' | null>(null)
const drawerTitle = ref('')
const drawerRouteName = ref('')
const drawerRoutePath = ref('')
const showMdiContainer = ref(false)

// 判断当前是否为独立页面
const isStandalonePage = computed(() => {
  return route.meta.standalone === true
})

// 组件挂载时初始化
onMounted(() => {
  // 初始化主题
  store.initTheme()
})

// 切换侧边栏状态
const toggleSidebar = () => {
  store.toggleSidebar()
}


// 在抽屉中打开路由
const openRouteInDrawer = (routePath: string, title: string) => {
  console.log('在抽屉中打开路由:', routePath)
  drawerType.value = 'route'
  drawerTitle.value = title
  drawerRoutePath.value = routePath
  store.setShowDrawer(true)
}

// 执行菜单动作
const executeMenuAction = (item: MenuItem) => {

  // 根据打开方式处理
  if (item.openMode === 'drawer') {
    // 在抽屉中打开路由
    openRouteInDrawer(item.path, item.name)
  } else if (item.openMode === 'mdi') {
    closeDrawer() // 关闭抽屉
    // MDI模式处理
    if (store.currentApp) {
      openAppInMdi(store.currentApp)
    }
  } else if (item.openMode === 'blank') {
    window.open(item.path, '_blank')
  } else {
    if (item.path) {
      // 默认route打开，隐藏MDI容器
      showMdiContainer.value = false;
      router.push(item.path)
    } else {
      // 显示错误消息
      store.addSystemMessage('没有路径', 'error')
    }
  }
}

// 在抽屉中打开应用
const openAppInDrawer = (app: SubApp) => {
  // 所有应用都使用 MDI 模式打开
  openAppInMdi(app)
}

// 在MDI中打开应用
const openAppInMdi = (app: SubApp) => {
  // 显示MDI容器
  showMdiContainer.value = true
  
  // 添加到MDI应用列表
  store.addMdiApp(app)
  
  // 激活应用
  store.activateApp(app.name)
  
  // 关闭抽屉
  closeDrawer()
  
  // 使用无界微前端加载应用
  setupApp({
    name: app.name,
    url: app.entry,
    exec: true,
    alive: true,
    el: `#${app.container}`,
    degrade: false,
    fetch: (url, options) => {
      // 处理跨域问题
      if (url.includes('baidu.com') || url.includes('http://')) {
        return window.fetch(url, {
          ...options,
          mode: 'no-cors',
          credentials: 'omit'
        });
      }
      return window.fetch(url, options);
    }
  })
}

// 关闭抽屉
const closeDrawer = () => {
  store.setShowDrawer(false)
  // 延迟清除抽屉类型，以便在关闭动画完成后再清除
  setTimeout(() => {
    drawerType.value = null
    drawerTitle.value = ''
    drawerRouteName.value = ''
    drawerRoutePath.value = ''
  }, 300)
}

// 监听当前应用变化
watch(() => store.currentApp, (newApp) => {
  if (newApp && drawerType.value === 'wujie-app') {
    drawerTitle.value = newApp.name
  }
})

// 监听全局事件
const handleOpenWujieApp = (event: CustomEvent) => {
  const app = event.detail as SubApp
  openAppInDrawer(app)
}

const handleOpenAppManager = () => {
  openRouteInDrawer('/app-manager', '应用管理')
}

// 在组件挂载后初始化
onMounted(async () => {
  // 加载配置
  await store.loadConfig()

  // 添加全局事件监听
  window.addEventListener('open-wujie-app', handleOpenWujieApp as EventListener)
  window.addEventListener('open-app-manager', handleOpenAppManager)
  window.addEventListener('return-to-mdi', (() => {
    showMdiContainer.value = true
  }) as EventListener)

  // 添加打开路由抽屉的全局事件
  window.addEventListener('open-route-drawer', ((event: CustomEvent) => {
    const { path, title } = event.detail
    openRouteInDrawer(path, title)
  }) as EventListener)
})

// 在组件卸载前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('open-wujie-app', handleOpenWujieApp as EventListener)
  window.removeEventListener('open-app-manager', handleOpenAppManager)
  window.removeEventListener('return-to-mdi', (() => {
    showMdiContainer.value = true
  }) as EventListener)
  window.removeEventListener('open-route-drawer', ((event: CustomEvent) => {
    const { path, title } = event.detail
    openRouteInDrawer(path, title)
  }) as EventListener)
})

// 关闭MDI应用
const closeMdiApp = (appName: string) => {
  // 从MDI应用列表中移除
  store.removeMdiApp(appName)
  
  // 如果没有应用了，显示首页
  if (store.mdiApps.length === 0) {
    showHome()
  }
}

// 打开应用管理器
const openAppManager = () => {
  openRouteInDrawer('/app-manager', '应用管理')
}

// 添加显示首页的方法
const showHome = () => {
  showMdiContainer.value = false;
  router.push('/');
}

// 添加返回MDI的方法
const returnToMdi = () => {
  showMdiContainer.value = true;
}

// 激活MDI应用
const activateApp = (appName: string) => {
  store.activateApp(appName)
}
</script>

<style>
:root {
  --primary-color: #4a6cf7;
  --background-color: #f5f7fa;
  --text-color: #333;
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 80px;
  --header-height: 60px;
  --border-color: rgba(0, 0, 0, 0.1);
}

:root[data-theme="dark"] {
  --primary-color: #6d8eff;
  --background-color: #1a1a1a;
  --text-color: #f0f0f0;
  --border-color: rgba(255, 255, 255, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: var(--background-color);
  color: var(--text-color);
}

.standalone-container {
  width: 100%;
  height: 100vh;
  overflow: auto;
  background-color: var(--background-color);
  color: var(--text-color);
  padding: 20px;
}

.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
  flex-shrink: 0;
  /* 防止侧边栏被压缩 */
  z-index: 10;
  position: absolute;
  left: 0;
  top: 0;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.toggle-btn {
  position: absolute;
  right: -15px;
  top: 80px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  z-index: 20;
}

.content-wrapper {
  flex: 1;
  height: 100%;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s;
  width: calc(100% - var(--sidebar-width));
  background-color: var(--background-color);
  position: relative;
}

/* 路由视图容器 */
.content-wrapper > div:first-child {
  padding: 20px;
}

.sidebar.collapsed~.content-wrapper {
  margin-left: var(--sidebar-collapsed-width);
  width: calc(100% - var(--sidebar-collapsed-width));
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  padding: 0 15px;
  overflow-y: auto;
  flex: 1;
}

nav a,
.nav-link {
  color: var(--text-color);
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  cursor: pointer;
}

nav a:hover,
nav a.router-link-active,
.nav-link:hover {
  background-color: var(--primary-color);
  color: white;
}

.nav-icon {
  font-size: 18px;
  margin-right: 10px;
  display: inline-block;
  width: 24px;
  text-align: center;
}

.nav-text {
  flex: 1;
}

.sidebar.collapsed nav a,
.sidebar.collapsed .nav-link {
  overflow: hidden;
  white-space: nowrap;
  padding: 10px 5px;
  display: flex;
  justify-content: center;
  font-size: 0.9rem;
}

.sidebar.collapsed .nav-text {
  display: none;
}

.sidebar.collapsed .nav-icon {
  margin-right: 0;
  font-size: 20px;
}

:root[data-theme="dark"] .sidebar {
  background-color: rgba(255, 255, 255, 0.03);
  border-right-color: var(--border-color);
}

/* 应用抽屉 */
.app-drawer {
  position: fixed;
  top: 0;
  right: -80%;
  width: 80%;
  height: 100%;
  background-color: var(--background-color);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.app-drawer.drawer-open {
  right: 0;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
}

.drawer-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.close-drawer {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color);
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close-drawer:hover {
  opacity: 1;
}

.drawer-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.drawer-app-manager {
  height: 100%;
  overflow: auto;
}

.wujie-container-app {
  width: 100%;
  height: 100%;
  border: none;
}

.no-app-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color);
  opacity: 0.6;
  font-size: 18px;
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

@media (max-width: 768px) {
  .app-drawer {
    width: 100%;
    right: -100%;
  }
}

/* MDI容器样式 */
.mdi-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  overflow: hidden;
}

/* MDI标签栏 */
.mdi-tabs {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 4px;
  gap: 0;
  z-index: 2;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* MDI窗口样式 */
.wujie-container-mdi {
  position: absolute;
  width: 60%;
  height: calc(100% - 48px); /* 40px标签栏 + 8px边距 */
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 8px;
}

.wujie-container-mdi.active {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* MDI窗口标题栏 */
.mdi-window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  cursor: move;
}

.mdi-window-title {
  font-size: 14px;
  font-weight: 500;
}

.mdi-window-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.mdi-window-close:hover {
  opacity: 1;
}

/* MDI窗口内容区 */
.mdi-window-content {
  flex: 1;
  overflow: hidden;
  background-color: var(--background-color);
}

.no-mdi-apps {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color);
  opacity: 0.6;
}

.no-mdi-apps p {
  margin-bottom: 20px;
  font-size: 18px;
}

.open-app-btn {
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.open-app-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* 暗黑主题适配 */
:root[data-theme="dark"] .mdi-container {
  background-color: var(--background-color);
}

:root[data-theme="dark"] .wujie-container-mdi {
  border-color: var(--border-color);
  background-color: rgba(255, 255, 255, 0.03);
}

/* MDI标签栏 */
.mdi-tabs {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 4px;
  gap: 0;
  z-index: 2;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.mdi-tab-home {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px;
  border: none;
  background-color: transparent;
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  white-space: nowrap;
  margin-right: 4px;
}

.mdi-tab-home:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.mdi-tab-divider {
  width: 1px;
  height: 24px;
  background-color: var(--border-color);
  margin: 0 8px;
}

.mdi-tab-list {
  display: flex;
  gap: 2px;
  overflow-x: auto;
  height: 100%;
  align-items: center;
  padding: 4px 0;
}

.mdi-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  border: none;
  background-color: rgba(0, 0, 0, 0.03);
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  white-space: nowrap;
  min-width: 120px;
}

.mdi-tab.active {
  background-color: var(--primary-color);
  color: white;
}

.mdi-tab:hover {
  background-color: var(--primary-color);
  color: white;
  opacity: 0.9;
}

.mdi-tab-title {
  flex: 1;
  text-align: left;
  font-weight: 500;
}

.mdi-tab-close {
  font-size: 16px;
  opacity: 0.7;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-left: 4px;
}

.mdi-tab-close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

/* 暗黑主题适配 */
:root[data-theme="dark"] .mdi-tab-home:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .mdi-tab {
  background-color: rgba(255, 255, 255, 0.03);
}

:root[data-theme="dark"] .mdi-tab-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 滚动条美化 */
.mdi-tab-list::-webkit-scrollbar {
  height: 0;
}

.mdi-tabs::-webkit-scrollbar {
  height: 0;
}

/* 路由页面头部 */
.route-header {
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.return-to-mdi {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.return-to-mdi:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 暗黑主题适配 */
:root[data-theme="dark"] .route-header {
  border-color: var(--border-color);
}
</style>
