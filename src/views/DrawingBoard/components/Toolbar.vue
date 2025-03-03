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
        <span class="material-symbols-rounded">{{ tool.icon }}</span>
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
  { name: 'line', icon: 'horizontal_rule', title: '直线' },
  { name: 'rect', icon: 'rectangle', title: '矩形' },
  { name: 'circle', icon: 'circle', title: '圆形' },
  { name: 'text', icon: 'text_fields', title: '文字' },
  { name: 'image', icon: 'image', title: '加载示例图片' },
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

.tool-btn .material-symbols-rounded {
  font-size: 24px;
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

.tool-btn.active .material-symbols-rounded {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style> 