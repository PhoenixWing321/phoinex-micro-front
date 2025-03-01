<script setup lang="ts">
import { useFrameworkStore } from './store/framework'
import FrameworkHeader from './components/FrameworkHeader.vue'

const store = useFrameworkStore()
</script>

<template>
  <div class="app-container" :data-theme="store.currentTheme">
    <FrameworkHeader />
    <div class="main-content">
      <div class="sidebar" :class="{ collapsed: store.sidebarCollapsed }">
        <button @click="store.toggleSidebar" class="toggle-btn">
          {{ store.sidebarCollapsed ? '>' : '<' }}
        </button>
        <nav>
          <router-link to="/">首页</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #4a6cf7;
  --background-color: #f5f7fa;
  --text-color: #333;
  --sidebar-width: 250px;
  --sidebar-collapsed-width: 60px;
  --header-height: 60px;
}

:root[data-theme="dark"] {
  --primary-color: #6d8eff;
  --background-color: #1a1a1a;
  --text-color: #f0f0f0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
  padding-top: var(--header-height);
}

.sidebar {
  width: var(--sidebar-width);
  background-color: rgba(0, 0, 0, 0.05);
  transition: width 0.3s;
  position: relative;
  padding: 20px;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.toggle-btn {
  position: absolute;
  right: -15px;
  top: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.content {
  flex: 1;
  padding: 20px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

nav a {
  color: var(--text-color);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover, nav a.router-link-active {
  background-color: var(--primary-color);
  color: white;
}

.sidebar.collapsed nav a {
  overflow: hidden;
  white-space: nowrap;
}
</style>
