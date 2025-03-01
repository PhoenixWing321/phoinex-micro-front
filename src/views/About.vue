<template>
  <div class="about">
    <h1>关于</h1>
    <div class="about-content">
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

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.about-content {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

h2 {
  margin-bottom: 15px;
  color: var(--primary-color);
}

h3 {
  margin: 20px 0 10px;
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

:root[data-theme="dark"] .about-content {
  background-color: rgba(255, 255, 255, 0.05);
}
</style> 