<template>
  <header class="framework-header">
    <div class="logo">
      <h1>微前端框架</h1>
    </div>
    
    <div class="controls">
      <!-- 主题切换 -->
      <button @click="toggleTheme" class="theme-toggle">
        {{ store.currentTheme === 'light' ? '🌙' : '☀️' }}
      </button>
      
      <!-- 用户信息 -->
      <div class="user-info">
        <template v-if="store.isLoggedIn">
          <span>欢迎，{{ store.username }}</span>
          <button @click="handleLogout" class="logout-btn">登出</button>
        </template>
        <button v-else @click="handleLogin" class="login-btn">登录</button>
      </div>
      
      <!-- 消息通知 -->
      <div class="notifications">
        <span class="icon">🔔</span>
        <span v-if="unreadMessages.length" class="badge">{{ unreadMessages.length }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFrameworkStore } from '../store/framework'
import type { SystemMessage } from '../types/framework'

// 使用框架store
const store = useFrameworkStore()

// 计算未读消息
const unreadMessages = computed((): SystemMessage[] => {
  return store.systemMessages.filter(msg => !msg.read)
})

// 切换主题
const toggleTheme = (): void => {
  const newTheme = store.currentTheme === 'light' ? 'dark' : 'light'
  store.setTheme(newTheme)
}

// 模拟登录
const handleLogin = (): void => {
  // 实际应用中这里会有登录逻辑
  store.login({
    username: '测试用户',
    role: 'user',
    id: 1
  })
  store.addSystemMessage('登录成功！')
}

// 登出
const handleLogout = (): void => {
  store.logout()
  store.addSystemMessage('您已安全登出')
}
</script>

<style scoped>
.framework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: var(--header-bg, #fff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.theme-toggle, .login-btn, .logout-btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.theme-toggle:hover, .login-btn:hover, .logout-btn:hover {
  background-color: #f0f0f0;
}

.notifications {
  position: relative;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 暗黑主题适配 */
:root[data-theme="dark"] .framework-header {
  --header-bg: #333;
  color: #fff;
}

:root[data-theme="dark"] .theme-toggle, 
:root[data-theme="dark"] .login-btn, 
:root[data-theme="dark"] .logout-btn {
  border-color: #555;
  color: #fff;
}

:root[data-theme="dark"] .theme-toggle:hover, 
:root[data-theme="dark"] .login-btn:hover, 
:root[data-theme="dark"] .logout-btn:hover {
  background-color: #444;
}
</style> 