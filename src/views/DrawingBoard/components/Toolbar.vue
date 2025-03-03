<template>
  <div class="toolbar">
    <div class="tools">
      <button
        v-for="tool in tools"
        :key="tool.name"
        class="tool-btn"
        :class="{ active: activeTool === tool.name }"
        :title="tool.title"
        @click="$emit('update:active-tool', tool.name)"
      >
        {{ tool.icon }}
      </button>
    </div>
    
    <div class="divider"></div>
    
    <div class="settings">
      <div class="color-picker">
        <input
          type="color"
          :value="strokeColor"
          @input="$emit('update:stroke-color', ($event.target as HTMLInputElement).value)"
          title="选择颜色"
        >
      </div>
      
      <div class="stroke-width">
        <input
          type="range"
          :value="strokeWidth"
          min="1"
          max="20"
          @input="$emit('update:stroke-width', Number(($event.target as HTMLInputElement).value))"
          title="画笔粗细"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DrawingTool, ToolbarItem } from '../types/drawing'

const props = defineProps<{
  activeTool: DrawingTool
  strokeColor: string
  strokeWidth: number
}>()

defineEmits<{
  'update:active-tool': [tool: DrawingTool]
  'update:stroke-color': [color: string]
  'update:stroke-width': [width: number]
}>()

const tools = computed<ToolbarItem[]>(() => [
  { name: 'pencil', icon: '✏️', title: '铅笔' },
  { name: 'line', icon: '📏', title: '直线' },
  { name: 'rect', icon: '⬜', title: '矩形' },
  { name: 'circle', icon: '⭕', title: '圆形' },
  { name: 'eraser', icon: '🧹', title: '橡皮擦' },
  { name: 'text', icon: '📝', title: '文字' },
])
</script>

<style scoped>
.toolbar {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 12px;
}

.tools {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-btn {
  width: 44px;
  height: 44px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--text-color);
  transition: all 0.2s;
}

.tool-btn:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

.tool-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 8px 0;
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-picker input {
  width: 44px;
  height: 44px;
  padding: 2px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
}

.stroke-width {
  display: flex;
  flex-direction: column;
}

.stroke-width input {
  width: 100%;
  cursor: pointer;
}
</style> 