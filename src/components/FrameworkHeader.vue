<template>
  <header class="framework-header">
    <div class="logo" 
         :class="{ 'logo-collapsed': store.sidebarCollapsed }"
         @click="$emit('toggle-sidebar')"
         title="点击切换侧边栏">
      <div class="vue-logo" :class="{ 'vue-logo-collapsed': store.sidebarCollapsed }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196.32 170.02" width="24" height="24">
          <path fill="#42b883" d="M120.83 0L98.16 39.26 75.49 0H0l98.16 170.02L196.32 0h-75.49z"/>
          <path fill="#35495e" d="M120.83 0L98.16 39.26 75.49 0H39.26l58.9 102.01L157.06 0h-36.23z"/>
        </svg>
      </div>
      <h1 v-show="!store.sidebarCollapsed">微前端框架</h1>  
    </div>
    
    <!-- 消息通知 -->
    <div class="notifications" v-if="unreadMessages > 0">
      <span class="badge">{{ unreadMessages }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFrameworkStore } from '../store/framework'
import type { SystemMessage } from '../types/framework'

// 定义组件可以发出的事件
defineEmits(['toggle-sidebar'])

// 使用框架store
const store = useFrameworkStore()

// 计算未读消息
const unreadMessages = computed(() => {
  return store.systemMessages.filter(msg => !msg.read).length
})
</script>

<style scoped>
.framework-header {
  padding: 15px;
  background-color: var(--header-bg, rgba(0, 0, 0, 0.03));
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 5px;
  border-radius: 4px;
}

.logo:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.logo-collapsed {
  justify-content: center;
}

.vue-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vue-logo-collapsed {
  transform: scale(1.2);
}

.logo h1 {
  font-size: 1.2rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-color);
}

.notifications {
  position: relative;
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
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
  --header-bg: rgba(255, 255, 255, 0.03);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .logo:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .notifications {
  color: #fff;
}

:root[data-theme="dark"] .notifications .badge {
  background-color: #ff4d4d;
}
</style> 