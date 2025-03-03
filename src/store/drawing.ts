import { defineStore } from 'pinia'
import type { DrawingTool, DrawingHistoryItem } from '@/views/DrawingBoard/types/drawing'

interface DrawingState {
  activeTool: DrawingTool
  strokeColor: string
  strokeWidth: number
  history: DrawingHistoryItem[]
  currentHistoryIndex: number
  isDrawing: boolean
}

export const useDrawingStore = defineStore('drawing', {
  state: (): DrawingState => ({
    activeTool: 'line',
    strokeColor: '#000000',
    strokeWidth: 2,
    history: [],
    currentHistoryIndex: -1,
    isDrawing: false
  }),

  actions: {
    setActiveTool(tool: DrawingTool) {
      this.activeTool = tool
    },

    setStrokeColor(color: string) {
      this.strokeColor = color
    },

    setStrokeWidth(width: number) {
      this.strokeWidth = width
    },

    addHistory(item: DrawingHistoryItem) {
      // 删除当前位置之后的历史
      this.history = this.history.slice(0, this.currentHistoryIndex + 1)
      this.history.push(item)
      this.currentHistoryIndex++
    },

    clearHistory() {
      this.history = []
      this.currentHistoryIndex = -1
    },

    undo() {
      if (this.currentHistoryIndex > -1) {
        this.currentHistoryIndex--
      }
    },

    redo() {
      if (this.currentHistoryIndex < this.history.length - 1) {
        this.currentHistoryIndex++
      }
    },

    setIsDrawing(value: boolean) {
      this.isDrawing = value
    }
  },

  getters: {
    currentHistory: (state): DrawingHistoryItem[] => {
      return state.history.slice(0, state.currentHistoryIndex + 1)
    },

    canUndo: (state): boolean => {
      return state.currentHistoryIndex > -1
    },

    canRedo: (state): boolean => {
      return state.currentHistoryIndex < state.history.length - 1
    }
  }
}) 