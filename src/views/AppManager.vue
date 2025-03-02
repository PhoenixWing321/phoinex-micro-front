<template>
  <div class="app-manager">
    <div class="app-manager-header">
      <h1>应用管理</h1>
    </div>
    
    <div class="app-manager-container">
      <div class="app-list-section">
        <h2>微前端应用列表</h2>
        <div class="app-list">
          <div 
            v-for="app in store.subApps" 
            :key="app.name"
            class="app-item"
            :class="{ active: app.name === store.currentAppName }"
          >
            <div class="app-item-content" @click="activateApp(app.name)">
              {{ app.name }}
            </div>
            <button class="open-app-btn" @click="openApp(app)" title="打开应用">
              ▶
            </button>
            <button class="delete-app-btn" @click="confirmDeleteApp(app.name)" title="删除应用">
              ×
            </button>
          </div>
          <div class="app-item add" @click="showAddAppForm = true">
            + 添加应用
          </div>
        </div>
      </div>
      
      <div class="app-detail-section">
        <div v-if="store.currentApp" class="current-app">
          <h3>当前应用: {{ store.currentAppName }}</h3>
          <div class="app-info">
            <div class="info-item">
              <span class="label">入口地址:</span>
              <span class="value">{{ store.currentApp.entry }}</span>
            </div>
            <div class="info-item">
              <span class="label">容器ID:</span>
              <span class="value">{{ store.currentApp.container }}</span>
            </div>
            <div class="info-item">
              <span class="label">打开方式:</span>
              <span class="value">{{ getOpenModeText(store.currentApp.openMode) }}</span>
            </div>
          </div>
          <div class="app-actions">
            <button @click="openApp(store.currentApp)" class="primary-btn">
              打开应用
            </button>
          </div>
        </div>
        <div v-else class="no-app">
          请选择一个微应用或添加新应用
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
          <small>例如: https://www.example.com</small>
        </div>
        <div class="form-group">
          <label>容器ID</label>
          <input v-model="newApp.container" type="text" placeholder="输入容器ID">
          <small>例如: example-container</small>
        </div>
        <div class="form-group">
          <label>打开方式</label>
          <select v-model="newApp.openMode">
            <option value="drawer">抽屉中打开</option>
            <option value="blank">新窗口打开</option>
            <option value="mdi">MDI管理器中打开</option>
          </select>
          <small>选择应用的打开方式</small>
        </div>
        <div class="form-actions">
          <button @click="showAddAppForm = false">取消</button>
          <button @click="addApp" class="primary" :disabled="!isFormValid">添加</button>
        </div>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="delete-confirm-dialog">
      <div class="dialog-content">
        <h3>确认删除</h3>
        <p>确定要删除应用 "{{ appToDelete }}" 吗？此操作不可撤销。</p>
        <div class="dialog-actions">
          <button @click="showDeleteConfirm = false">取消</button>
          <button @click="deleteApp" class="danger">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import { useFrameworkStore } from '../store/framework'
import { useRouter } from 'vue-router'
import type { SubApp } from '../types/framework'

const emit = defineEmits(['open-app'])
const store = useFrameworkStore()
const router = useRouter()
const showAddAppForm = ref(false)
const showDeleteConfirm = ref(false)
const appToDelete = ref('')

const newApp = ref<SubApp>({
  name: '',
  entry: '',
  container: '',
  openMode: 'drawer' // 默认在抽屉中打开
})

// 表单验证
const isFormValid = computed(() => {
  return (
    newApp.value.name.trim() !== '' && 
    newApp.value.entry.trim() !== '' && 
    newApp.value.container.trim() !== ''
  )
})

// 获取打开方式的文本描述
const getOpenModeText = (openMode?: string) => {
  switch (openMode) {
    case 'drawer': return '抽屉中打开';
    case 'blank': return '新窗口打开';
    case 'mdi': return 'MDI管理器中打开';
    default: return '抽屉中打开';
  }
}

// 激活应用
const activateApp = (appName: string) => {
  store.activateApp(appName)
}

// 打开应用
const openApp = (app: SubApp) => {
  emit('open-app', app)
}

// 添加应用
const addApp = () => {
  if (isFormValid.value) {
    const appName = newApp.value.name.trim();
    
    // 检查应用名称是否已存在
    if (store.subApps.some(app => app.name === appName)) {
      store.addSystemMessage(`应用名称 "${appName}" 已存在，请使用其他名称`);
      return;
    }
    
    store.registerSubApp({
      name: appName,
      entry: newApp.value.entry.trim(),
      container: newApp.value.container.trim(),
      openMode: newApp.value.openMode
    })
    
    // 添加成功消息
    store.addSystemMessage(`成功添加应用: ${appName}`)
    
    // 如果没有激活的应用，则激活新添加的应用
    if (!store.currentApp) {
      store.activateApp(appName)
    }
    
    // 重置表单
    newApp.value = {
      name: '',
      entry: '',
      container: '',
      openMode: 'drawer'
    }
    
    showAddAppForm.value = false
  }
}

// 确认删除应用
const confirmDeleteApp = (appName: string) => {
  appToDelete.value = appName
  showDeleteConfirm.value = true
}

// 删除应用
const deleteApp = () => {
  if (appToDelete.value) {
    store.removeApp(appToDelete.value)
    appToDelete.value = ''
    showDeleteConfirm.value = false
  }
}
</script>

<style scoped>
.app-manager {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-manager-header {
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

.app-manager-container {
  display: flex;
  flex: 1;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  height: calc(100% - 60px);
  background-color: var(--background-color);
}

.app-list-section {
  width: 280px;
  min-width: 280px;
  flex-shrink: 0;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.02);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.app-detail-section {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: #333;
}

.app-item-content {
  flex: 1;
  padding: 10px 15px;
  cursor: pointer;
}

.open-app-btn, .delete-app-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transition: all 0.2s;
}

.open-app-btn:hover {
  color: var(--primary-color);
}

.delete-app-btn:hover {
  color: #ff4d4d;
}

.app-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.app-item.active {
  background-color: var(--primary-color);
}

.app-item.active .app-item-content {
  color: white;
}

.app-item.active .open-app-btn,
.app-item.active .delete-app-btn {
  color: rgba(255, 255, 255, 0.7);
}

.app-item.active .open-app-btn:hover {
  color: white;
}

.app-item.active .delete-app-btn:hover {
  color: white;
}

.app-item.add {
  border: 1px dashed #ccc;
  background-color: transparent;
  text-align: center;
  color: var(--text-color);
  cursor: pointer;
  padding: 10px 15px;
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

.app-info {
  margin-top: 20px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 15px;
  border-radius: 6px;
}

.info-item {
  margin-bottom: 10px;
}

.info-item .label {
  font-weight: bold;
  margin-right: 10px;
  color: var(--text-color);
}

.info-item .value {
  color: var(--text-color);
  opacity: 0.8;
  word-break: break-all;
}

.app-actions {
  margin-top: 20px;
}

.primary-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.primary-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.add-app-form, .delete-confirm-dialog {
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

.form-content, .dialog-content {
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

.form-group small {
  display: block;
  color: #666;
  margin-top: 5px;
  font-size: 0.8rem;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: var(--background-color);
  color: var(--text-color);
}

.form-actions, .dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button, .dialog-actions button {
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

.form-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dialog-actions button.danger {
  background-color: #ff4d4d;
  color: white;
  border-color: #ff4d4d;
}

/* 暗黑主题适配 */
:root[data-theme="dark"] .app-list-section {
  background-color: rgba(255, 255, 255, 0.03);
  border-right-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .app-manager-container {
  border-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .app-item {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
}

:root[data-theme="dark"] .app-item.add {
  border-color: rgba(255, 255, 255, 0.2);
}

:root[data-theme="dark"] .app-info {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .form-group input,
:root[data-theme="dark"] .form-group select {
  background-color: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .form-group small {
  color: #aaa;
}

:root[data-theme="dark"] .form-actions button,
:root[data-theme="dark"] .dialog-actions button {
  background-color: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .app-manager {
    flex-direction: column;
  }
  
  .app-list-section {
    width: 100%;
    height: auto;
    max-height: 40%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .app-detail-section {
    height: 60%;
  }
}
</style> 