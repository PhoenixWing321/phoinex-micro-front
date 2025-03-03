<template>
  <div class="system-messages-container">
    <transition-group name="message-fade">
      <div 
        v-for="message in store.systemMessages" 
        :key="message.id" 
        class="system-message"
        :class="message.type"
      >
        <div class="message-content">
          <i class="message-icon">
            {{ message.type === 'success' ? '✓' : message.type === 'error' ? '✗' : 'ℹ' }}
          </i>
          <span>{{ message.text }}</span>
        </div>
        <button class="close-btn" @click="closeMessage(message.id)">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useFrameworkStore } from '../store/framework'

const store = useFrameworkStore()

// 关闭消息
const closeMessage = (id: number) => {
  store.removeSystemMessage(id)
}
</script>

<style scoped>
.system-messages-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
}

.system-message {
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slide-in 0.3s ease;
  background-color: white;
  color: #333;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.message-icon {
  font-size: 16px;
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.system-message.success {
  background-color: #f0f9eb;
  border-left: 4px solid #67c23a;
}

.system-message.success .message-icon {
  color: #67c23a;
}

.system-message.error {
  background-color: #fef0f0;
  border-left: 4px solid #f56c6c;
}

.system-message.error .message-icon {
  color: #f56c6c;
}

.system-message.info {
  background-color: #f4f4f5;
  border-left: 4px solid #909399;
}

.system-message.info .message-icon {
  color: #909399;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  color: #333;
  margin-left: 10px;
}

.close-btn:hover {
  opacity: 1;
}

/* 暗黑主题适配 */
:root[data-theme="dark"] .system-message {
  background-color: #2c2c2c;
  color: #e0e0e0;
}

:root[data-theme="dark"] .system-message.success {
  background-color: rgba(103, 194, 58, 0.1);
}

:root[data-theme="dark"] .system-message.error {
  background-color: rgba(245, 108, 108, 0.1);
}

:root[data-theme="dark"] .system-message.info {
  background-color: rgba(144, 147, 153, 0.1);
}

:root[data-theme="dark"] .close-btn {
  color: #e0e0e0;
}

/* 动画效果 */
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

@keyframes slide-in {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 