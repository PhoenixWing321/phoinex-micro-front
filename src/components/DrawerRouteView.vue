<template>
  <div class="drawer-route-view">
    <component :is="currentComponent" v-if="currentComponent" :hide-header="hideHeader" />
    <div v-else class="loading">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, onMounted, defineProps, watch, markRaw } from 'vue'
import About from '../views/About.vue'
import Home from '../views/Home.vue'
import AppManager from '../views/AppManager.vue'

const props = defineProps<{
  path: string;
  hideHeader?: boolean;
}>()

// 使用shallowRef代替ref，避免组件被转换为响应式对象
const currentComponent = shallowRef<any>(null)

// 组件映射表 - 使用markRaw包装组件，避免被转换为响应式对象
const componentMap: Record<string, any> = {
  '/': markRaw(Home),
  '/home': markRaw(Home),
  '/about': markRaw(About),
  '/app-manager': markRaw(AppManager)
}

// 加载组件
const loadComponent = (path: string) => {
  try {
    console.log('加载路径:', path)
    // 标准化路径
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    
    // 从映射表中获取组件
    if (componentMap[normalizedPath]) {
      currentComponent.value = componentMap[normalizedPath]
      console.log('成功加载组件:', normalizedPath)
    } else {
      console.error('未找到对应组件:', normalizedPath)
      currentComponent.value = null
    }
  } catch (error) {
    console.error('加载组件失败:', error)
    currentComponent.value = null
  }
}

// 监听路径变化
watch(() => props.path, (newPath) => {
  if (newPath) {
    loadComponent(newPath)
  }
}, { immediate: true })

onMounted(() => {
  if (props.path) {
    loadComponent(props.path)
  }
})
</script>

<style scoped>
.drawer-route-view {
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: var(--text-color);
  opacity: 0.6;
}
</style> 