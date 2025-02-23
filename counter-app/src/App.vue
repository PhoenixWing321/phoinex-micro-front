<template>
  <div class="app-container">
    <!-- 原有的计数器组件 -->
    <CounterComponent />
    
    <!-- WebAssembly 演示组件 -->
    <WasmDemo />
  </div>
</template>

<script>
import CounterComponent from './components/Counter.vue'
import WasmDemo from './components/WasmDemo.vue'

export default {
  name: 'App',
  components: {
    CounterComponent,
    WasmDemo
  }
}
</script>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

/* 确保所有元素使用 border-box */
* {
  box-sizing: border-box;
}

/* 添加响应式布局 */
@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }
}
</style>