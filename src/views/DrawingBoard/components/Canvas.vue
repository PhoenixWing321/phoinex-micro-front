<template>
  <div class="canvas-wrapper" ref="canvasWrapper">
    <canvas
      ref="canvas"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { DrawingTool, DrawingState, DrawingHistoryItem } from '../types/drawing'

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

// 绘画历史
const history = ref<DrawingHistoryItem[]>([])
const currentHistoryIndex = ref(-1)

// 初始化画布
onMounted(() => {
  if (!canvas.value || !canvasWrapper.value) return
  
  // 设置画布大小
  const resizeCanvas = () => {
    const { width, height } = canvasWrapper.value!.getBoundingClientRect()
    canvas.value!.width = width
    canvas.value!.height = height
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
  
  if (props.activeTool === 'pencil' || props.activeTool === 'eraser') {
    ctx.value.beginPath()
    ctx.value.moveTo(x, y)
  }
}

// 绘画中
const draw = (e: MouseEvent) => {
  if (!ctx.value || !canvas.value || !drawingState.value.isDrawing) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  drawingState.value.currentX = x
  drawingState.value.currentY = y
  
  // 清除预览
  clearCanvas()
  // 重绘历史
  redrawHistory()
  
  // 根据工具类型绘制
  switch (props.activeTool) {
    case 'pencil':
      drawPencil(x, y)
      break
    case 'line':
      drawLine()
      break
    case 'rect':
      drawRect()
      break
    case 'circle':
      drawCircle()
      break
    case 'eraser':
      drawEraser(x, y)
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

// 铅笔工具
const drawPencil = (x: number, y: number) => {
  if (!ctx.value) return
  ctx.value.lineTo(x, y)
  ctx.value.stroke()
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

// 橡皮擦工具
const drawEraser = (x: number, y: number) => {
  if (!ctx.value) return
  ctx.value.strokeStyle = '#ffffff'
  ctx.value.lineTo(x, y)
  ctx.value.stroke()
}

// 清除画布
const clearCanvas = () => {
  if (!ctx.value || !canvas.value) return
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
}

// 保存到历史
const saveToHistory = () => {
  if (!ctx.value) return
  
  // 删除当前位置之后的历史
  history.value = history.value.slice(0, currentHistoryIndex.value + 1)
  
  // 添加新的历史记录
  history.value.push({
    type: props.activeTool,
    startX: drawingState.value.startX,
    startY: drawingState.value.startY,
    endX: drawingState.value.currentX,
    endY: drawingState.value.currentY,
    strokeColor: props.strokeColor,
    strokeWidth: props.strokeWidth
  })
  
  currentHistoryIndex.value++
}

// 重绘历史
const redrawHistory = () => {
  if (!ctx.value) return
  
  history.value.forEach(item => {
    ctx.value!.strokeStyle = item.strokeColor
    ctx.value!.lineWidth = item.strokeWidth
    
    switch (item.type) {
      case 'pencil':
      case 'eraser':
        if (item.path) {
          ctx.value!.stroke(item.path)
        }
        break
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
  })
}

// 监听工具变化
watch(() => props.activeTool, () => {
  if (!ctx.value) return
  ctx.value.strokeStyle = props.activeTool === 'eraser' ? '#ffffff' : props.strokeColor
})
</script>

<style scoped>
.canvas-wrapper {
  width: 100%;
  height: 100%;
  background-color: white;
  position: relative;
  flex: 1;
  display: flex;
}

canvas {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}
</style> 