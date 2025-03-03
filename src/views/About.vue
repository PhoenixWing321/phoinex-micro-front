<template>
  <div class="about">
    <div class="about-header" v-if="!hideHeader">
      <h1>关于</h1>
    </div>
    <div class="about-content" :class="{ 'no-header': hideHeader }">
      <h2>微前端框架</h2>
      <p>这是一个基于Vite + Vue3 + Wujie的微前端框架。</p>
      
      <h3>技术栈</h3>
      <ul>
        <li><strong>Vite</strong>: 下一代前端构建工具</li>
        <li><strong>Vue 3</strong>: 渐进式JavaScript框架</li>
        <li><strong>TypeScript</strong>: JavaScript的超集，提供类型检查</li>
        <li><strong>Pinia</strong>: Vue的状态管理库</li>
        <li><strong>Wujie</strong>: 基于Web Components的微前端解决方案</li>
      </ul>
      
      <h3>框架特性</h3>
      <ul>
        <li>支持多个独立应用的接入和管理</li>
        <li>应用间状态隔离，通信便捷</li>
        <li>统一的主题和样式管理</li>
        <li>完善的TypeScript类型支持</li>
        <li>响应式设计，适配多种设备</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFrameworkStore } from '../store/framework'

const props = defineProps<{
  hideHeader?: boolean
}>()

const store = useFrameworkStore()
</script>

<style scoped>
.about {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 0; /* 确保没有左侧margin */
}

.about-header {
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

.about-content {
  padding: 25px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  flex: 1;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-color);
}

.about-content.no-header {
  margin-top: 0;
  padding-top: 15px;
}

h2 {
  margin-bottom: 15px;
  color: var(--primary-color);
}

h3 {
  margin: 20px 0 10px;
  color: var(--text-color);
}

p {
  line-height: 1.6;
  margin-bottom: 15px;
}

ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

li {
  margin-bottom: 8px;
  line-height: 1.5;
}

strong {
  color: var(--primary-color);
  font-weight: 600;
}

/* 暗黑主题适配 */
:root[data-theme="dark"] .about-content {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}
</style> 