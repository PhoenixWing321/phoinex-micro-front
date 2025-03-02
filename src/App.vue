<template>
  <div class="app-container" :data-theme="store.currentTheme">
    <!-- 左侧边栏 -->
    <div class="sidebar" :class="{ 'collapsed': store.sidebarCollapsed }">
      <!-- 顶部标题和控制区 -->
      <FrameworkHeader @toggle-sidebar="toggleSidebar" />
      
      <button @click="toggleSidebar" class="toggle-btn">
        {{ store.sidebarCollapsed ? '>' : '<' }}
      </button>
      
      <!-- 中间导航区 -->
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/about">关于</router-link>
      </nav>
      
      <!-- 底部用户区 -->
      <UserPanel />
    </div>
    
    <!-- 右侧内容区 -->
    <div class="content-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFrameworkStore } from './store/framework'
import FrameworkHeader from './components/FrameworkHeader.vue'
import UserPanel from './components/UserPanel.vue'

const store = useFrameworkStore()

// 切换侧边栏状态
const toggleSidebar = () => {
  store.toggleSidebar()
}

// 在组件挂载后初始化主题
onMounted(() => {
  // 确保从持久化存储恢复的主题设置被应用到DOM
  store.initTheme()
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

html, body, #app {
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

.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
  flex-shrink: 0; /* 防止侧边栏被压缩 */
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

.sidebar.collapsed ~ .content-wrapper {
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

nav a {
  color: var(--text-color);
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
  white-space: nowrap;
}

nav a:hover, nav a.router-link-active {
  background-color: var(--primary-color);
  color: white;
}

.sidebar.collapsed nav a {
  overflow: hidden;
  white-space: nowrap;
  padding: 10px 5px;
  display: flex;
  justify-content: center;
  font-size: 0.9rem;
}

:root[data-theme="dark"] .sidebar {
  background-color: rgba(255, 255, 255, 0.03);
  border-right-color: var(--border-color);
}
</style>
