<template>
  <div class="drawing-board">
    <div class="toolbar">
      <Toolbar 
        :active-tool="activeTool"
        :stroke-color="strokeColor"
        :stroke-width="strokeWidth"
        @update:active-tool="activeTool = $event"
        @update:stroke-color="strokeColor = $event"
        @update:stroke-width="strokeWidth = $event"
      />
    </div>
    <div class="main-content">
      <div class="canvas-container">
        <Canvas
          :active-tool="activeTool"
          :stroke-color="strokeColor"
          :stroke-width="strokeWidth"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Canvas from './components/Canvas.vue'
import Toolbar from './components/Toolbar.vue'
import type { DrawingTool } from './types/drawing'

// 当前选中的工具
const activeTool = ref<DrawingTool>('line')
// 画笔颜色
const strokeColor = ref('#000000')
// 画笔宽度
const strokeWidth = ref(2)
</script>

<style scoped>
.drawing-board {
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: var(--background-color);
  padding: 20px;
  gap: 20px;
}

.toolbar {
  width: 60px;
  height: 100%;
  border-right: 1px solid var(--border-color);
  background-color: var(--background-color);
  z-index: 1;
}

.main-content {
  flex: 1;
  height: 100%;
  display: flex;
  gap: 20px;
}

.canvas-container {
  width: calc(100% - 220px);  /* 减去历史面板的宽度 */
  height: 600px;  /* 固定画板高度 */
  overflow: hidden;
  position: relative;
  background-color: white;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style> 