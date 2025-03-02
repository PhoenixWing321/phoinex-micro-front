<template>
  <div class="home">
    <div class="home-header">
      <h1>首页</h1>
      <!-- 主题切换按钮 -->
      <button @click="toggleTheme" class="theme-toggle">
        {{ store.currentTheme === 'light' ? '🌙' : '☀️' }}
      </button>
    </div>
    <div class="wujie-container">
      <div class="wujie-apps">
        <h2>微前端应用列表</h2>
        <div class="app-list">
          <div 
            v-for="app in store.subApps" 
            :key="app.name"
            class="app-item"
            :class="{ active: app.name === store.currentAppName }"
            @click="activateApp(app.name)"
          >
            {{ app.name }}
          </div>
          <div class="app-item add" @click="showAddAppForm = true">
            + 添加应用
          </div>
        </div>
      </div>
      
      <div class="wujie-content">
        <div v-if="store.currentApp" class="current-app">
          <h3>当前应用: {{ store.currentAppName }}</h3>
          <!-- 这里是wujie的容器 -->
          <div :id="store.currentApp.container" class="wujie-container-app"></div>
        </div>
        <div v-else class="no-app">
          请选择一个微应用
        </div>
      </div>
    </div>
    
    <!-- 添加应用表单 -->
    <div v-if="showAddAppForm" class="add-app-form">
      <div class="form-content">
        <h3>添加微应用</h3>
        <div class="form-group">
          <label>应用名称</label>
          <input v-model="newApp.name" type="text" placeholder="输入应用名称">
        </div>
        <div class="form-group">
          <label>入口地址</label>
          <input v-model="newApp.entry" type="text" placeholder="输入应用入口URL">
        </div>
        <div class="form-group">
          <label>容器ID</label>
          <input v-model="newApp.container" type="text" placeholder="输入容器ID">
        </div>
        <div class="form-actions">
          <button @click="showAddAppForm = false">取消</button>
          <button @click="addApp" class="primary">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFrameworkStore } from '../store/framework'
import type { SubApp } from '../types/framework'

const store = useFrameworkStore()
const showAddAppForm = ref(false)
const newApp = ref<SubApp>({
  name: '',
  entry: '',
  container: ''
})

// 激活应用
const activateApp = (appName: string) => {
  store.activateApp(appName)
}

// 添加应用
const addApp = () => {
  if (newApp.value.name && newApp.value.entry && newApp.value.container) {
    const appName = newApp.value.name;
    
    store.registerSubApp({
      name: appName,
      entry: newApp.value.entry,
      container: newApp.value.container
    })
    
    // 添加成功消息
    store.addSystemMessage(`成功添加应用: ${appName}`)
    
    // 重置表单
    newApp.value = {
      name: '',
      entry: '',
      container: ''
    }
    
    showAddAppForm.value = false
  }
}

// 切换主题
const toggleTheme = () => {
  store.toggleTheme()
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 0; /* 确保没有左侧margin */
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin: 0;
}

.theme-toggle {
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
  color: var(--text-color);
}

.theme-toggle:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

:root[data-theme="dark"] .theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.wujie-container {
  display: flex;
  flex: 1;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  height: calc(100% - 60px);
  background-color: var(--background-color);
}

.wujie-apps {
  width: 220px;
  min-width: 220px;
  flex-shrink: 0;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.02);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.wujie-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.wujie-container-app {
  flex: 1;
  margin-top: 15px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  min-height: 400px;
}

h2, h3 {
  color: var(--text-color);
  margin-bottom: 15px;
}

.app-list {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.app-item {
  padding: 10px 15px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: #333;
}

.app-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.app-item.active {
  background-color: var(--primary-color);
  color: white;
}

.app-item.add {
  border: 1px dashed #ccc;
  background-color: transparent;
  text-align: center;
  color: var(--text-color);
}

.no-app {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color);
  opacity: 0.6;
  font-size: 18px;
}

.current-app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.add-app-form {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.form-content {
  background-color: var(--background-color);
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: var(--background-color);
  color: var(--text-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: var(--background-color);
  color: var(--text-color);
  cursor: pointer;
}

.form-actions button.primary {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 暗黑主题适配 */
:root[data-theme="dark"] .wujie-apps {
  background-color: rgba(255, 255, 255, 0.03);
  border-right-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .wujie-container {
  border-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .app-item {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
}

:root[data-theme="dark"] .app-item.add {
  border-color: rgba(255, 255, 255, 0.2);
}

:root[data-theme="dark"] .wujie-container-app {
  border-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .form-group input {
  background-color: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .form-actions button {
  background-color: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}
</style> 