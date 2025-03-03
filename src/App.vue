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
      <router-view />
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

        <!-- 应用管理内容 -->
        <AppManager v-else-if="drawerType === 'app-manager'" @open-app="openAppInDrawer" class="drawer-app-manager" :hide-header="true" />

        <!-- 无界应用容器 -->
        <div v-else-if="drawerType === 'wujie-app' && store.currentApp" :id="store.currentApp.container"
          class="wujie-container-app"></div>

        <div v-else class="no-app-selected">
          请选择一个应用
        </div>
      </div>
    </div>

    <!-- 抽屉遮罩层 -->
    <div v-if="store.showDrawer" class="drawer-overlay" @click="closeDrawer"></div>
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
import type { SubApp, MenuItem } from './types/framework'
import WujieVue from 'wujie-vue3'

const { setupApp, preloadApp, startApp } = WujieVue
const router = useRouter()
const route = useRoute()

const store = useFrameworkStore()
const drawerType = ref<'app-manager' | 'wujie-app' | 'route' | null>(null)
const drawerTitle = ref('')
const drawerRouteName = ref('')
const drawerRoutePath = ref('')

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
  console.log('执行菜单动作:', item)

  // 根据打开方式处理
  if (item.openMode === 'drawer') {

    // 在抽屉中打开路由
    openRouteInDrawer(item.path || '/about', item.name)

    // TODO Clear store.executeMenuAction(item.action)

  } else if (item.openMode === 'mdi') {

    closeDrawer() // 关闭抽屉
    // MDI模式处理
    console.log('MDI模式打开:', item.name)
    // TODO: 实现MDI模式
  } else { // if (item.openMode === 'blank')
    window.open(item.path, '_blank')
  }

}

// 在抽屉中打开应用
const openAppInDrawer = (app: SubApp) => {
  store.activateApp(app.name)

  // 根据应用的打开方式决定如何打开
  if (app.openMode === 'blank') {
    // 在新窗口中打开
    window.open(app.entry, '_blank')
    return
  } else if (app.openMode === 'mdi') {
    // 在MDI管理器中打开（这里需要根据实际MDI管理器的API进行调整）
    console.log('在MDI管理器中打开:', app.name)
    // 这里可以添加MDI管理器的打开逻辑
    return
  }

  // 默认在抽屉中打开
  drawerType.value = 'wujie-app'
  drawerTitle.value = app.name
  store.setShowDrawer(true)

  // 使用无界微前端加载应用
  setupApp({
    name: app.name,
    url: app.entry,
    exec: true,
    sync: true
  })

  // 预加载应用
  preloadApp({
    name: app.name,
    url: app.entry
  })

  // 启动应用
  setTimeout(() => {
    startApp({
      name: app.name,
      url: app.entry,
      el: `#${app.container}`,
      sync: true
    })
  }, 100)
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
  window.removeEventListener('open-route-drawer', ((event: CustomEvent) => {
    const { path, title } = event.detail
    openRouteInDrawer(path, title)
  }) as EventListener)
})
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
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s;
  width: calc(100% - var(--sidebar-width));
  background-color: var(--background-color);
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
</style>
