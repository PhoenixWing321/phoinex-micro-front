<template>
  <div class="home">
    <div class="home-header">
      <div class="header-left">
        <h1>首页</h1>
        <button v-if="store.mdiApps.length > 0" class="return-to-mdi" @click="returnToMdi">
          <i class="nav-icon">📱</i>
          返回工作区 ({{ store.mdiApps.length }}个应用)
        </button>
      </div>
      <!-- 主题切换按钮 -->
      <button @click="toggleTheme" class="theme-toggle">
        {{ store.currentTheme === 'light' ? '🌙' : '☀️' }}
      </button>
    </div>
    
    <div class="home-content">
      <!-- 快捷应用区域 -->
      <div class="quick-apps">
        <h2>快捷应用</h2>
        <div class="app-grid">
          <div 
            v-for="app in store.subApps.slice(0, 6)" 
            :key="app.name"
            class="app-card"
            @click="openApp(app)"
          >
            <div class="app-icon">
              <span>{{ getAppInitial(app.name) }}</span>
            </div>
            <div class="app-name">{{ app.name }}</div>
          </div>
          <div class="app-card add" @click="openAppManager">
            <div class="app-icon add">
              <span>+</span>
            </div>
            <div class="app-name">管理应用</div>
          </div>
        </div>
      </div>
      
      <!-- 系统信息区域 -->
      <div class="system-info">
        <h2>系统信息</h2>
        <div class="info-cards">
          <div class="info-card">
            <div class="info-icon">📊</div>
            <div class="info-content">
              <h3>应用统计</h3>
              <p>当前共有 {{ store.subApps.length }} 个应用</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">👤</div>
            <div class="info-content">
              <h3>用户信息</h3>
              <p>{{ store.isLoggedIn ? store.username : '未登录' }}</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">🔔</div>
            <div class="info-content">
              <h3>系统消息</h3>
              <p>{{ store.systemMessages.length }} 条未读消息</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 使用指南 -->
      <div class="usage-guide">
        <h2>使用指南</h2>
        <div class="guide-content">
          <div class="guide-item">
            <div class="guide-icon">1</div>
            <div class="guide-text">
              <h3>添加应用</h3>
              <p>在应用管理页面添加您需要的微前端应用</p>
            </div>
          </div>
          <div class="guide-item">
            <div class="guide-icon">2</div>
            <div class="guide-text">
              <h3>打开应用</h3>
              <p>点击首页的应用卡片或在应用管理页面打开应用</p>
            </div>
          </div>
          <div class="guide-item">
            <div class="guide-icon">3</div>
            <div class="guide-text">
              <h3>管理应用</h3>
              <p>在应用管理页面可以添加、删除和管理您的应用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFrameworkStore } from '../store/framework'
import type { SubApp } from '../types/framework'

const store = useFrameworkStore()

// 获取应用名称首字母作为图标
const getAppInitial = (name: string): string => {
  return name.charAt(0).toUpperCase()
}

// 打开应用
const openApp = (app: SubApp) => {
  // 使用全局事件总线触发打开应用事件
  window.dispatchEvent(new CustomEvent('open-wujie-app', { detail: app }))
}

// 打开应用管理
const openAppManager = () => {
  window.dispatchEvent(new CustomEvent('open-app-manager'))
}

// 切换主题
const toggleTheme = () => {
  store.toggleTheme()
}

// 返回MDI工作区
const returnToMdi = () => {
  window.dispatchEvent(new CustomEvent('return-to-mdi'))
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

h1 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin: 0;
}

.return-to-mdi {
  background-color: transparent;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  color: var(--text-color);
  margin-left: 10px;
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

.home-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

/* 快捷应用区域 */
.quick-apps {
  margin-bottom: 30px;
}

h2 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: var(--text-color);
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
}

.app-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.app-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.app-icon span {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.app-name {
  font-size: 14px;
  text-align: center;
  color: var(--text-color);
}

.app-card.add .app-icon {
  background-color: rgba(0, 0, 0, 0.1);
}

.app-card.add .app-icon span {
  color: var(--text-color);
}

:root[data-theme="dark"] .app-card {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .app-card.add .app-icon {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 系统信息区域 */
.system-info {
  margin-bottom: 30px;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.info-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-icon {
  font-size: 28px;
  margin-right: 15px;
}

.info-content h3 {
  font-size: 16px;
  margin: 0 0 5px 0;
  color: var(--text-color);
}

.info-content p {
  margin: 0;
  color: var(--text-color);
  opacity: 0.8;
}

:root[data-theme="dark"] .info-card {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 使用指南 */
.usage-guide {
  margin-bottom: 30px;
}

.guide-content {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.guide-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.guide-item:last-child {
  margin-bottom: 0;
}

.guide-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.guide-text h3 {
  font-size: 16px;
  margin: 0 0 5px 0;
  color: var(--text-color);
}

.guide-text p {
  margin: 0;
  color: var(--text-color);
  opacity: 0.8;
}

:root[data-theme="dark"] .guide-content {
  background-color: rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
  .app-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style> 