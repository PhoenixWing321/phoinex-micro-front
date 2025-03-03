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
    <div class="canvas-container">
      <Canvas
        :active-tool="activeTool"
        :stroke-color="strokeColor"
        :stroke-width="strokeWidth"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Canvas from './components/Canvas.vue'
import Toolbar from './components/Toolbar.vue'
import type { DrawingTool } from './types/drawing'

// 当前选中的工具
const activeTool = ref<DrawingTool>('pencil')
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.toolbar {
  width: 60px;
  height: 100%;
  border-right: 1px solid var(--border-color);
  background-color: var(--background-color);
  z-index: 1;
}

.canvas-container {
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}
</style> 