// 绘画工具类型
export type DrawingTool = 
  | 'pencil'    // 铅笔
  | 'line'      // 直线
  | 'rect'      // 矩形
  | 'circle'    // 圆形
  | 'eraser'    // 橡皮擦
  | 'text'      // 文字

// 绘画历史记录项
export interface DrawingHistoryItem {
  type: DrawingTool
  path?: Path2D
  startX: number
  startY: number
  endX: number
  endY: number
  strokeColor: string
  strokeWidth: number
  text?: string
}

// 绘画状态
export interface DrawingState {
  isDrawing: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
}

// 工具栏项
export interface ToolbarItem {
  name: DrawingTool
  icon: string
  title: string
} 