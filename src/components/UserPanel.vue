<template>
  <div class="user-panel">
    <template v-if="store.isLoggedIn">
      <div class="user-info">
        <span class="username">{{ store.username }}</span>
        <button @click="handleLogout" class="logout-btn">登出</button>
      </div>
    </template>
    <button v-else @click="handleLogin" class="login-btn">登录</button>
  </div>
</template>

<script setup lang="ts">
import { useFrameworkStore } from '../store/framework'

// 使用框架store
const store = useFrameworkStore()

// 模拟登录
const handleLogin = (): void => {
  // 实际应用中这里会有登录逻辑
  store.login({
    username: '测试用户',
    name: '测试用户',
    avatar: 'https://via.placeholder.com/50',
    role: 'user'
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
.user-panel {
  padding: 12px 15px;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.username {
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  color: var(--text-color);
}

.login-btn, .logout-btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  color: var(--text-color);
}

.login-btn {
  width: 100%;
}

.login-btn:hover, .logout-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 侧边栏折叠时的样式 */
:deep(.sidebar.collapsed) .user-panel {
  padding: 12px 5px;
}

:deep(.sidebar.collapsed) .username {
  display: none;
}

:deep(.sidebar.collapsed) .logout-btn {
  width: 100%;
}

/* 暗黑主题适配 */
:root[data-theme="dark"] .user-panel {
  background-color: rgba(255, 255, 255, 0.03);
  border-top-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .login-btn, 
:root[data-theme="dark"] .logout-btn {
  border-color: #555;
}

:root[data-theme="dark"] .login-btn:hover, 
:root[data-theme="dark"] .logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style> 