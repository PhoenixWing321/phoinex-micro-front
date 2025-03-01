<template>
  <div class="home">
    <h1>首页</h1>
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
          <div :id="store.currentApp.container"></div>
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
</script>

<style scoped>
.home {
  position: relative;
}

.wujie-container {
  display: flex;
  margin-top: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
}

.wujie-apps {
  width: 250px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.02);
  border-right: 1px solid #eee;
}

.wujie-content {
  flex: 1;
  padding: 20px;
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
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  color: #999;
}

.no-app {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
  font-size: 18px;
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
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
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
  border: 1px solid #ddd;
  border-radius: 4px;
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
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
}

.form-actions button.primary {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

:root[data-theme="dark"] .wujie-apps {
  background-color: rgba(255, 255, 255, 0.05);
  border-right-color: #333;
}

:root[data-theme="dark"] .wujie-container {
  border-color: #333;
}

:root[data-theme="dark"] .app-item {
  background-color: #2a2a2a;
}

:root[data-theme="dark"] .app-item.add {
  border-color: #555;
  color: #aaa;
}

:root[data-theme="dark"] .form-content {
  background-color: #2a2a2a;
}

:root[data-theme="dark"] .form-group input {
  background-color: #333;
  border-color: #555;
  color: #eee;
}

:root[data-theme="dark"] .form-actions button {
  background-color: #333;
  border-color: #555;
  color: #eee;
}
</style> 