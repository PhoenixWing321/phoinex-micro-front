// 绘画工具类型
export type DrawingTool = 
  | 'line'      // 直线
  | 'rect'      // 矩形
  | 'circle'    // 圆形
  | 'text'      // 文字
  | 'image'     // 加载图片

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
  imageData?: ImageData  // 添加图片数据
  timestamp: number  // 添加时间戳
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