<template>
  <div class="container">
    <!-- 左侧应用列表 -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
      <!-- 上半部分：所有应用列表 -->
      <div class="sidebar-section">
        <div class="sidebar-header" @click="toggleCollapse" :class="{ 'header-hover': isHeaderHovered }"
          @mouseenter="isHeaderHovered = true" @mouseleave="isHeaderHovered = false">
          <div class="header-content">
            <img src="@/assets/logo.png" class="vue-logo" :class="{ 'logo-small': isCollapsed }" />
            <h3 v-if="!isCollapsed" class="header-title">微应用列表</h3>
          </div>
          <el-icon class="collapse-icon" :class="{ 'icon-rotate': isCollapsed }">
            <ArrowLeft />
          </el-icon>
        </div>
        <el-menu :collapse="isCollapsed">
          <el-menu-item v-for="app in microApps" :key="app.name" @click="() => openApp(app)">
            <el-icon>
              <component :is="app.icon" />
            </el-icon>
            <template #title>{{ app.title }}</template>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 下半部分：运行中的应用列表 -->
      <CollapsibleGroup v-if="!isCollapsed" title="运行中的应用">
        <el-menu class="running-apps-menu">
          <el-menu-item v-for="app in activeApps" :key="app.instanceId" @click="() => focusApp(app)"
            :class="{ 'is-minimized': app.isMinimized }">
            <div class="menu-item-content">
              <div class="app-info">
                <el-icon>
                  <component :is="app.icon" />
                </el-icon>
                <span class="app-title">
                  {{ app.title }}{{ app.instanceId > 1 ? '.' + app.instanceId : '.1' }}
                </span>
              </div>
              <el-button link class="close-button" @click.stop="closeApp(app)">
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </div>
          </el-menu-item>
        </el-menu>
      </CollapsibleGroup>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content">
      <!-- 只在没有活动应用时显示路由视图 -->
      <router-view v-if="activeApps.length === 0" />

      <!-- 背景网格 -->
      <div class="content-background" v-if="activeApps.length > 0"></div>

      <!-- 应用窗口 -->
      <div v-for="app in activeApps" :key="app.instanceId" v-show="!app.isMinimized" class="app-window"
        :class="{ 'window-maximized': app.isMaximized }" :style="getWindowStyle(app)"
        @mousedown="handleWindowClick(app)">
        <div class="window-header" @mousedown.stop="startDrag($event, app)" @mousemove="onDrag($event, app)"
          @mouseup="stopDrag" @mouseleave="stopDrag" @click="handleWindowClick(app)">
          <span class="window-title">
            <el-icon>
              <component :is="app.icon" />
            </el-icon>
            {{ app.title }}{{ app.instanceId > 1 ? '.' + app.instanceId : '.1' }}
          </span>
          <div class="window-controls">
            <el-button-group class="control-buttons">
              <el-button link @click="minimizeApp(app)" :class="{ 'is-active': app.isMinimized }">
                <el-icon>
                  <Minus />
                </el-icon>
              </el-button>
              <el-button link @click="maximizeApp(app)" :class="{ 'is-active': app.isMaximized }">
                <el-icon>
                  <component :is="app.isMaximized ? 'CopyDocument' : 'FullScreen'" />
                </el-icon>
              </el-button>
              <el-button link @click="closeApp(app)">
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>
        <div class="window-content">
          <WujieVue :width="app.isMaximized ? '100%' : app.defaultWidth"
            :height="app.isMaximized ? '100%' : app.defaultHeight" :name="`${app.name}-${app.instanceId}`"
            :url="app.url" :sync="true" :props="{
              instanceId: app.instanceId,
              appName: app.name
            }" />
        </div>

        <!-- 调整大小的手柄 -->
        <div v-if="!app.isMaximized" class="resize-handles">
          <div class="resize-handle top-left" @mousedown.stop="startResize($event, app, 'top-left')"></div>
          <div class="resize-handle top" @mousedown.stop="startResize($event, app, 'top')"></div>
          <div class="resize-handle top-right" @mousedown.stop="startResize($event, app, 'top-right')"></div>
          <div class="resize-handle right" @mousedown.stop="startResize($event, app, 'right')"></div>
          <div class="resize-handle bottom-right" @mousedown.stop="startResize($event, app, 'bottom-right')"></div>
          <div class="resize-handle bottom" @mousedown.stop="startResize($event, app, 'bottom')"></div>
          <div class="resize-handle bottom-left" @mousedown.stop="startResize($event, app, 'bottom-left')"></div>
          <div class="resize-handle left" @mousedown.stop="startResize($event, app, 'left')"></div>
        </div>
      </div>

      <!-- 最小化应用栏 -->
      <div class="minimized-bar" v-if="hasMinimizedApps">
        <el-button-group>
          <el-button v-for="app in minimizedApps" :key="app.name" type="default" size="small" @click="restoreApp(app)">
            <el-icon>
              <component :is="app.icon" />
            </el-icon>
            {{ app.title }}{{ app.instanceId > 1 ? '.' + app.instanceId : '.1' }}
          </el-button>
        </el-button-group>
      </div>

      <!-- 添加窗口排列控制按钮 -->
      <div class="window-controls-bar">
        <el-button-group>
          <el-button size="small" @click="cascadeWindows">
            <el-icon>
              <Operation />
            </el-icon>
            级联排列
          </el-button>
          <el-button size="small" @click="tileWindows">
            <el-icon>
              <Grid />
            </el-icon>
            平铺排列
          </el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import WujieVue from "wujie-vue3";
import { microApps, type MicroApp } from "./config/apps";
import {
  Monitor,
  ChatDotRound,
  ArrowLeft,
  Minus,
  FullScreen,
  CopyDocument,
  Close,
  Operation,
  Grid
} from '@element-plus/icons-vue';
import CollapsibleGroup from '@/components/CollapsibleGroup.vue';

interface ExtendedMicroApp extends MicroApp {
  isMaximized?: boolean;
  isMinimized?: boolean;
  zIndex?: number;
  position?: {
    x: number;
    y: number;
  };
  instanceId: number;
  url: string;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  originalX: number;
  originalY: number;
}

interface ResizeState {
  isResizing: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  direction: string;
}

export default defineComponent({
  name: "App",
  components: {
    WujieVue,
    Monitor,
    ChatDotRound,
    ArrowLeft,
    Minus,
    FullScreen,
    CopyDocument,
    Close,
    Operation,
    Grid,
    CollapsibleGroup
  },
  setup() {
    const activeApps = ref<ExtendedMicroApp[]>([]);
    const isCollapsed = ref(false);
    const isHeaderHovered = ref(false);
    const currentZIndex = ref(1);
    const instanceCounter = ref<Record<string, number>>({});
    const dragState = ref<DragState | null>(null);
    const resizeState = ref<ResizeState | null>(null);

    const minimizedApps = computed(() =>
      activeApps.value.filter(app => app.isMinimized)
    );

    const hasMinimizedApps = computed(() =>
      minimizedApps.value.length > 0
    );

    const getNewWindowPosition = () => {
      const baseOffset = 30;
      const activeCount = activeApps.value.length;
      return {
        x: baseOffset + (activeCount * 20),
        y: baseOffset + (activeCount * 20)
      };
    };

    const bringToFront = (app: ExtendedMicroApp) => {
      currentZIndex.value += 1;
      app.zIndex = currentZIndex.value;
    };

    const getWindowStyle = (app: ExtendedMicroApp) => {
      if (app.isMaximized) {
        return {
          width: '100%',
          height: 'calc(100% - 20px)',
          top: '10px',
          left: '10px',
          zIndex: app.zIndex
        };
      }
      return {
        width: app.defaultWidth,
        height: app.defaultHeight,
        top: `${app.position?.y || 0}px`,
        left: `${app.position?.x || 0}px`,
        zIndex: app.zIndex
      };
    };

    const minimizeApp = (app: ExtendedMicroApp) => {
      app.isMinimized = true;
      app.isMaximized = false;
    };

    const maximizeApp = (app: ExtendedMicroApp) => {
      app.isMaximized = !app.isMaximized;
      app.isMinimized = false;
    };

    const restoreApp = (app: ExtendedMicroApp) => {
      app.isMinimized = false;
    };

    const getNextInstanceId = (appName: string) => {
      instanceCounter.value[appName] = (instanceCounter.value[appName] || 0) + 1;
      return instanceCounter.value[appName];
    };

    const openApp = (app: MicroApp, isNewInstance = false) => {
      if (!isNewInstance) {
        const existingApp = activeApps.value.find(a => a.name === app.name);
        if (existingApp) {
          existingApp.isMinimized = false;
          bringToFront(existingApp);
          return;
        }
      }

      currentZIndex.value += 1;
      const position = getNewWindowPosition();
      const instanceId = getNextInstanceId(app.name);

      const appInstance: ExtendedMicroApp = {
        ...app,
        instanceId,
        isMaximized: false,
        isMinimized: false,
        zIndex: currentZIndex.value,
        position,
        url: app.url
      };

      activeApps.value.push(appInstance);
    };

    const closeApp = (app: ExtendedMicroApp) => {
      const index = activeApps.value.findIndex(a => a.instanceId === app.instanceId);
      if (index > -1) {
        activeApps.value.splice(index, 1);
      }
    };

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    const handleWindowClick = (app: ExtendedMicroApp) => {
      bringToFront(app);
    };

    const startDrag = (event: MouseEvent, app: ExtendedMicroApp) => {
      if (app.isMaximized) return;

      dragState.value = {
        isDragging: true,
        startX: event.clientX,
        startY: event.clientY,
        originalX: app.position?.x || 0,
        originalY: app.position?.y || 0
      };
    };

    const onDrag = (event: MouseEvent, app: ExtendedMicroApp) => {
      if (!dragState.value?.isDragging) return;

      const deltaX = event.clientX - dragState.value.startX;
      const deltaY = event.clientY - dragState.value.startY;

      app.position = {
        x: dragState.value.originalX + deltaX,
        y: dragState.value.originalY + deltaY
      };
    };

    const stopDrag = () => {
      dragState.value = null;
    };

    const focusApp = (app: ExtendedMicroApp) => {
      app.isMinimized = false;
      bringToFront(app);
    };

    // 开始调整大小
    const startResize = (event: MouseEvent, app: ExtendedMicroApp, direction: string) => {
      event.preventDefault();
      const rect = (event.target as HTMLElement).closest('.app-window')?.getBoundingClientRect();
      if (!rect) return;

      resizeState.value = {
        isResizing: true,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: rect.width,
        startHeight: rect.height,
        direction
      };

      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
    };

    // 处理调整大小
    const handleResize = (event: MouseEvent) => {
      if (!resizeState.value?.isResizing) return;

      const deltaX = event.clientX - resizeState.value.startX;
      const deltaY = event.clientY - resizeState.value.startY;
      const app = activeApps.value.find(a => a.zIndex === currentZIndex.value);
      if (!app) return;

      const minWidth = 200;
      const minHeight = 150;

      switch (resizeState.value.direction) {
        case 'right':
          app.defaultWidth = `${Math.max(resizeState.value.startWidth + deltaX, minWidth)}px`;
          break;
        case 'bottom':
          app.defaultHeight = `${Math.max(resizeState.value.startHeight + deltaY, minHeight)}px`;
          break;
        // ... 添加其他方向的处理
      }
    };

    // 停止调整大小
    const stopResize = () => {
      resizeState.value = null;
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };

    // 级联排列窗口
    const cascadeWindows = () => {
      const offset = 30;
      activeApps.value.forEach((app, index) => {
        if (!app.isMinimized) {
          app.isMaximized = false;
          app.position = {
            x: offset * (index + 1),
            y: offset * (index + 1)
          };
          bringToFront(app);
        }
      });
    };

    // 平铺排列窗口
    const tileWindows = () => {
      const visibleApps = activeApps.value.filter(app => !app.isMinimized);
      const count = visibleApps.length;
      if (count === 0) return;

      // 获取内容区域的尺寸
      const contentArea = document.querySelector('.content');
      if (!contentArea) return;
      const { width: containerWidth, height: containerHeight } = contentArea.getBoundingClientRect();

      // 计算最佳的行列数
      let cols: number;
      let rows: number;

      if (count <= 2) {
        // 1-2个窗口水平排列
        cols = count;
        rows = 1;
      } else if (count <= 4) {
        // 3-4个窗口 2x2 网格
        cols = 2;
        rows = 2;
      } else if (count <= 6) {
        // 5-6个窗口 2x3 网格
        cols = 3;
        rows = 2;
      } else {
        // 更多窗口时，尽量保持方形布局
        cols = Math.ceil(Math.sqrt(count));
        rows = Math.ceil(count / cols);
      }

      // 计算单个窗口的尺寸
      const padding = 10;  // 窗口间距
      const windowWidth = Math.floor((containerWidth - (cols + 1) * padding) / cols);
      const windowHeight = Math.floor((containerHeight - (rows + 1) * padding) / rows);

      visibleApps.forEach((app, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        app.isMaximized = false;
        app.position = {
          x: padding + col * (windowWidth + padding),
          y: padding + row * (windowHeight + padding)
        };
        app.defaultWidth = `${windowWidth}px`;
        app.defaultHeight = `${windowHeight}px`;
        bringToFront(app);
      });
    };

    return {
      microApps,
      activeApps,
      isCollapsed,
      openApp,
      closeApp,
      toggleCollapse,
      isHeaderHovered,
      minimizedApps,
      hasMinimizedApps,
      getWindowStyle,
      minimizeApp,
      maximizeApp,
      restoreApp,
      handleWindowClick,
      startDrag,
      onDrag,
      stopDrag,
      focusApp,
      startResize,
      cascadeWindows,
      tileWindows
    };
  }
});
</script>

<style>
.container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.sidebar {
  width: 200px;
  border-right: 1px solid #ddd;
  transition: width 0.3s;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #e6e6e6;
  transition: all 0.3s;
  user-select: none;
}

.header-hover {
  background-color: #f5f7fa;
}

.header-content {
  display: flex;
  align-items: center;
}

.vue-logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  transition: all 0.3s;
}

.logo-small {
  margin-right: 0;
}

.header-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  white-space: nowrap;
  transition: opacity 0.3s;
}

.collapse-icon {
  font-size: 20px;
  color: #909399;
  transition: all 0.3s;
}

.icon-rotate {
  transform: rotate(180deg);
}

.sidebar-header:active {
  background-color: #e4e7ed;
}

.content {
  flex: 1;
  padding: 20px;
  position: relative;
  overflow: auto;
  background-color: #f0f2f5;
}

/* 背景网格样式 */
.content-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: center center;
  pointer-events: none;
  /* 允许点击穿透到下层元素 */
  z-index: 0;
}

.app-window {
  position: absolute;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: z-index 0s, transform 0.3s;
}

.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #ddd;
  background-color: #f8f9fa;
  cursor: move;
}

.window-title {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.window-controls .control-buttons {
  display: flex;
  gap: 4px;
}

.window-controls .el-button {
  padding: 4px 8px;
  color: #606266;
}

.window-controls .el-button:hover {
  color: #409eff;
  background-color: #ecf5ff;
}

.window-controls .el-button.is-active {
  color: #409eff;
}

.window-maximized {
  transition: all 0.3s;
}

.minimized-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px 8px 0 0;
  z-index: 100;
}

.minimized-bar .el-button-group {
  display: flex;
  gap: 8px;
}

.minimized-bar .el-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 优化菜单样式 */
.el-menu {
  border-right: none !important;
}

.el-menu-item {
  margin: 4px 0;
}

.el-menu-item:hover {
  background-color: #f5f7fa !important;
}

.el-menu-item.is-active {
  background-color: #ecf5ff !important;
}

/* 添加激活状态的样式 */
.app-window:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.sidebar-section {
  display: flex;
  flex-direction: column;
}

.running-apps {
  border-top: 1px solid #e6e6e6;
  margin-top: 20px;
}

.section-header {
  padding: 12px 16px;
  background-color: #f8f9fa;
}

.section-title {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.is-minimized {
  opacity: 0.7;
}

/* 禁用文本选择，优化拖动体验 */
.window-header * {
  user-select: none;
}

.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  pointer-events: auto;
  background: transparent;
}

.resize-handle.top-left,
.resize-handle.top-right,
.resize-handle.bottom-left,
.resize-handle.bottom-right {
  width: 10px;
  height: 10px;
}

.resize-handle.top,
.resize-handle.bottom {
  height: 5px;
  left: 10px;
  right: 10px;
  cursor: ns-resize;
}

.resize-handle.left,
.resize-handle.right {
  width: 5px;
  top: 10px;
  bottom: 10px;
  cursor: ew-resize;
}

.resize-handle.top {
  top: 0;
}

.resize-handle.right {
  right: 0;
}

.resize-handle.bottom {
  bottom: 0;
}

.resize-handle.left {
  left: 0;
}

.resize-handle.top-left {
  top: 0;
  left: 0;
  cursor: nw-resize;
}

.resize-handle.top-right {
  top: 0;
  right: 0;
  cursor: ne-resize;
}

.resize-handle.bottom-left {
  bottom: 0;
  left: 0;
  cursor: sw-resize;
}

.resize-handle.bottom-right {
  bottom: 0;
  right: 0;
  cursor: se-resize;
}

.window-controls-bar {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.running-apps-menu {
  max-height: calc(100vh - 400px);
  /* 确保不会超出侧边栏 */
  overflow-y: auto;
}

.running-apps-menu .el-menu-item {
  height: 32px;
  line-height: 32px;
  padding-right: 8px;
}

/* 确保内容不会溢出 */
.el-menu-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 优化滚动条样式 */
.running-apps-menu::-webkit-scrollbar {
  width: 6px;
}

.running-apps-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.running-apps-menu::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.running-apps-menu::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 运行中应用列表样式 */
.menu-item-content {
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 0;
  position: relative;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
  padding-right: 20px;
  width: 100%;
}

.app-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.close-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 1px;
  min-width: 16px;
  height: 16px;
  line-height: 1;
  font-size: 12px;
}

.close-button .el-icon {
  font-size: 12px;
  width: 12px;
  height: 12px;
}

/* 删除这些不再需要的样式 */
.close-button.show-on-hover {
  opacity: 0;
}

.el-menu-item:hover .close-button {
  opacity: 1;
}

.is-minimized .close-button {
  opacity: 1;
}
</style>
