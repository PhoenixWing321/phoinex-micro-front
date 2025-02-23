<template>
  <div>
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

<style scoped>
.left-app {
  padding: 20px;
}

.content {
  margin-top: 20px;
}
</style>