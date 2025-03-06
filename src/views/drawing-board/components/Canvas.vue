<template>
  <div class="drawing-area">
    <div class="canvas-wrapper" ref="canvasWrapper">
      <canvas
        ref="canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
      ></canvas>
    </div>
    
    <!-- 历史记录面板 -->
    <div class="history-panel">
      <div class="history-header">
        <div class="header-title">
          <h3>绘制历史</h3>
          <span class="history-count">{{ history.length }}项</span>
        </div>
        <button @click="clearHistory" class="clear-btn">清空</button>
      </div>
      <div class="history-list">
        <div v-for="(item, index) in history" 
             :key="index" 
             class="history-item"
             :class="{ active: index === currentHistoryIndex }">
          <span class="history-type">{{ getHistoryItemName(item.type) }}</span>
          <span class="history-time">{{ formatTime(item.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { useDrawingStore } from '@/store/drawing'
import type { DrawingTool, DrawingState, DrawingHistoryItem } from '../types/drawing'

const drawingStore = useDrawingStore()

const props = defineProps<{
  activeTool: DrawingTool
  strokeColor: string
  strokeWidth: number
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const canvasWrapper = ref<HTMLElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const drawingState = ref<DrawingState>({
  isDrawing: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0
})

// 使用 store 中的历史记录
const history = computed(() => drawingStore.currentHistory)
const currentHistoryIndex = ref(-1)

// 初始化画布
onMounted(() => {
  if (!canvas.value || !canvasWrapper.value) return
  
  // 设置画布大小
  const resizeCanvas = () => {
    if (!canvas.value || !ctx.value) return
    
    // 保存当前的图像数据
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height)
    
    // 调整画布大小
    const { width, height } = canvasWrapper.value!.getBoundingClientRect()
    canvas.value.width = width
    canvas.value.height = height
    
    // 重新设置上下文属性
    ctx.value.lineCap = 'round'
    ctx.value.lineJoin = 'round'
    
    // 重绘所有内容
    redrawHistory()
  }
  
  // 初始化上下文
  ctx.value = canvas.value.getContext('2d')
  if (!ctx.value) return
  
  // 设置基本样式
  ctx.value.lineCap = 'round'
  ctx.value.lineJoin = 'round'
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()
  
  // 组件卸载时移除监听器
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCanvas)
  })
})

// 开始绘画
const startDrawing = (e: MouseEvent) => {
  if (!ctx.value || !canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  drawingState.value = {
    isDrawing: true,
    startX: x,
    startY: y,
    currentX: x,
    currentY: y
  }
  
  // 设置样式
  ctx.value.strokeStyle = props.strokeColor
  ctx.value.lineWidth = props.strokeWidth
}

// 绘画中
const draw = (e: MouseEvent) => {
  if (!ctx.value || !canvas.value || !drawingState.value.isDrawing) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  drawingState.value.currentX = x
  drawingState.value.currentY = y
  
  // 根据工具类型绘制
  switch (props.activeTool) {
    case 'line':
      clearCanvas()
      redrawHistory()
      drawLine()
      break
    case 'rect':
      clearCanvas()
      redrawHistory()
      drawRect()
      break
    case 'circle':
      clearCanvas()
      redrawHistory()
      drawCircle()
      break
  }
}

// 停止绘画
const stopDrawing = () => {
  if (!ctx.value || !drawingState.value.isDrawing) return
  
  // 保存历史
  saveToHistory()
  drawingState.value.isDrawing = false
}

// 直线工具
const drawLine = () => {
  if (!ctx.value) return
  ctx.value.beginPath()
  ctx.value.moveTo(drawingState.value.startX, drawingState.value.startY)
  ctx.value.lineTo(drawingState.value.currentX, drawingState.value.currentY)
  ctx.value.stroke()
}

// 矩形工具
const drawRect = () => {
  if (!ctx.value) return
  const width = drawingState.value.currentX - drawingState.value.startX
  const height = drawingState.value.currentY - drawingState.value.startY
  ctx.value.strokeRect(drawingState.value.startX, drawingState.value.startY, width, height)
}

// 圆形工具
const drawCircle = () => {
  if (!ctx.value) return
  const radius = Math.sqrt(
    Math.pow(drawingState.value.currentX - drawingState.value.startX, 2) +
    Math.pow(drawingState.value.currentY - drawingState.value.startY, 2)
  )
  ctx.value.beginPath()
  ctx.value.arc(drawingState.value.startX, drawingState.value.startY, radius, 0, Math.PI * 2)
  ctx.value.stroke()
}

// 清除画布
const clearCanvas = () => {
  if (!ctx.value || !canvas.value) return
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
}

// 保存到历史
const saveToHistory = () => {
  if (!ctx.value || !canvas.value) return
  
  // 添加新的历史记录
  drawingStore.addHistory({
    type: props.activeTool,
    startX: drawingState.value.startX,
    startY: drawingState.value.startY,
    endX: drawingState.value.currentX,
    endY: drawingState.value.currentY,
    strokeColor: props.strokeColor,
    strokeWidth: props.strokeWidth,
    timestamp: Date.now()
  })
}

// 重绘历史
const redrawHistory = () => {
  if (!ctx.value || !canvas.value) return
  
  clearCanvas()
  
  history.value.forEach(item => {
    if (item.type === 'image' && item.imageData) {
      // 如果是图片，直接绘制保存的图片数据
      ctx.value!.putImageData(item.imageData, 0, 0)
    } else {
      // 其他绘画操作
      ctx.value!.strokeStyle = item.strokeColor
      ctx.value!.lineWidth = item.strokeWidth
      
      switch (item.type) {
        case 'line':
          ctx.value!.beginPath()
          ctx.value!.moveTo(item.startX, item.startY)
          ctx.value!.lineTo(item.endX, item.endY)
          ctx.value!.stroke()
          break
        case 'rect':
          ctx.value!.strokeRect(
            item.startX,
            item.startY,
            item.endX - item.startX,
            item.endY - item.startY
          )
          break
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(item.endX - item.startX, 2) +
            Math.pow(item.endY - item.startY, 2)
          )
          ctx.value!.beginPath()
          ctx.value!.arc(item.startX, item.startY, radius, 0, Math.PI * 2)
          ctx.value!.stroke()
          break
      }
    }
  })
}

// 监听工具变化
watch(() => props.activeTool, (newTool) => {
  if (!ctx.value) return
  
  if (newTool === 'image') {
    loadImage()  
  } else {
    ctx.value.strokeStyle = props.strokeColor
  }
})

// 加载图片
const loadImage = () => {
  if (!ctx.value || !canvas.value) return
  
  const img = new Image()
  img.onload = () => {
    // 计算图片的缩放比例，使其适应画布
    const scale = Math.min(
      canvas.value!.width / img.width,
      canvas.value!.height / img.height
    )
    
    // 计算居中位置
    const x = (canvas.value!.width - img.width * scale) / 2
    const y = (canvas.value!.height - img.height * scale) / 2
    
    // 清除画布
    clearCanvas()
    
    // 绘制图片
    ctx.value!.drawImage(
      img,
      x,
      y,
      img.width * scale,
      img.height * scale
    )
    
    // 保存图片数据
    const imageData = ctx.value!.getImageData(0, 0, canvas.value!.width, canvas.value!.height)
    
    // 保存到历史
    drawingStore.addHistory({
      type: 'image',
      startX: x,
      startY: y,
      endX: x + img.width * scale,
      endY: y + img.height * scale,
      strokeColor: props.strokeColor,
      strokeWidth: props.strokeWidth,
      imageData: imageData
    })
    currentHistoryIndex.value++
  }
  
  img.src = '/assets/2092.jpg'
}

// 获取历史项目的名称
const getHistoryItemName = (type: DrawingTool) => {
  const typeMap: Record<DrawingTool, string> = {
    line: '直线',
    rect: '矩形',
    circle: '圆形',
    text: '文字',
    image: '图片'
  }
  return typeMap[type]
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}

// 清空历史
const clearHistory = () => {
  drawingStore.clearHistory()
  clearCanvas()
}
</script>

<style scoped>
.drawing-area {
  width: 100%;
  height: 100%;
  max-height: 800px;
  display: flex;
  gap: 20px;
}

.canvas-wrapper {
  flex: 1;
  background-color: white;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  max-height: inherit;
}

canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
  max-height: inherit;
}

.history-panel {
  width: 200px;
  height: 100%;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.history-header {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  background-color: rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.history-count {
  font-size: 12px;
  color: var(--primary-color);
  background-color: rgba(var(--primary-color-rgb), 0.1);
  padding: 2px 6px;
  border-radius: 10px;
}

.clear-btn {
  padding: 4px 8px;
  border: none;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: opacity 0.2s;
}

.clear-btn:hover {
  opacity: 0.9;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.03);
  transition: all 0.2s;
}

.history-item:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

.history-item.active {
  background-color: var(--primary-color);
  color: white;
}

.history-type {
  font-weight: 500;
}

.history-time {
  opacity: 0.7;
}
</style> 