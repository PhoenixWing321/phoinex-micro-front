<template>
  <div class="app-container" ref="container">
    <div class="app-frame">
      <div class="app-header">
        <span class="app-title">{{ title }}</span>
        <div class="window-controls">
          <button class="minimize" @click="minimize">—</button>
          <button class="maximize" @click="toggleMaximize">□</button>
          <button class="close" @click="close">×</button>
        </div>
      </div>
      <div class="app-content">
        <iframe :src="url" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
// ... 现有的 script 代码保持不变
</script>

<style scoped>
.app-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 300px;
  min-height: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  resize: both;
  overflow: hidden;
}

.app-frame {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f5f5f5;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  cursor: move;
  user-select: none;
}

.app-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.app-content iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.window-controls {
  display: flex;
  gap: 4px;
}

.window-controls button {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: transparent;
}

.window-controls button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.close:hover {
  background: #ff4444 !important;
  color: white;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 