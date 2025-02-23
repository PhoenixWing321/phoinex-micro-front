<template>
  <div class="container">
    <!-- 左侧应用列表 -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
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
        <el-menu-item v-for="app in microApps" :key="app.name" @click="openApp(app)">
          <el-icon>
            <component :is="app.icon" />
          </el-icon>
          <template #title>{{ app.title }}</template>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content">
      <!-- 只在没有活动应用时显示路由视图 -->
      <router-view v-if="activeApps.length === 0" />

      <!-- 背景网格 -->
      <div class="content-background" v-if="activeApps.length > 0"></div>

      <!-- 应用窗口 -->
      <div v-for="app in activeApps" :key="app.name" v-show="!app.isMinimized" class="app-window"
        :class="{ 'window-maximized': app.isMaximized }" :style="getWindowStyle(app)">
        <div class="window-header">
          <span class="window-title">
            <el-icon>
              <component :is="app.icon" />
            </el-icon>
            {{ app.title }}
          </span>
          <div class="window-controls">
            <el-button-group class="control-buttons">
              <el-button type="text" @click="minimizeApp(app)" :class="{ 'is-active': app.isMinimized }">
                <el-icon>
                  <Minus />
                </el-icon>
              </el-button>
              <el-button type="text" @click="maximizeApp(app)" :class="{ 'is-active': app.isMaximized }">
                <el-icon>
                  <component :is="app.isMaximized ? 'CopyDocument' : 'FullScreen'" />
                </el-icon>
              </el-button>
              <el-button type="text" @click="closeApp(app)">
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>
        <div class="window-content">
          <WujieVue :width="app.isMaximized ? '100%' : app.defaultWidth"
            :height="app.isMaximized ? '100%' : app.defaultHeight" :name="app.name" :url="app.url" :sync="true" />
        </div>
      </div>

      <!-- 最小化应用栏 -->
      <div class="minimized-bar" v-if="hasMinimizedApps">
        <el-button-group>
          <el-button v-for="app in minimizedApps" :key="app.name" type="default" size="small" @click="restoreApp(app)">
            <el-icon>
              <component :is="app.icon" />
            </el-icon>
            {{ app.title }}
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
  Close
} from '@element-plus/icons-vue';

interface ExtendedMicroApp extends MicroApp {
  isMaximized?: boolean;
  isMinimized?: boolean;
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
    Close
  },
  setup() {
    const activeApps = ref<ExtendedMicroApp[]>([]);
    const isCollapsed = ref(false);
    const isHeaderHovered = ref(false);

    const minimizedApps = computed(() =>
      activeApps.value.filter(app => app.isMinimized)
    );

    const hasMinimizedApps = computed(() =>
      minimizedApps.value.length > 0
    );

    const getWindowStyle = (app: ExtendedMicroApp) => {
      if (app.isMaximized) {
        return {
          width: '100%',
          height: 'calc(100% - 20px)',
          top: '10px',
          left: '10px'
        };
      }
      return {
        width: app.defaultWidth,
        height: app.defaultHeight
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

    const openApp = (app: MicroApp) => {
      if (!activeApps.value.find(a => a.name === app.name)) {
        activeApps.value.push({
          ...app,
          isMaximized: false,
          isMinimized: false
        });
      }
    };

    const closeApp = (app: ExtendedMicroApp) => {
      const index = activeApps.value.findIndex(a => a.name === app.name);
      if (index > -1) {
        activeApps.value.splice(index, 1);
      }
    };

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
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
      restoreApp
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
  margin: 10px;
  z-index: 1;
  /* 确保窗口在背景网格之上 */
}

.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #ddd;
  background-color: #f8f9fa;
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
</style>
