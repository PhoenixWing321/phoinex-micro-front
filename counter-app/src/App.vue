<template>
  <div class="left-app">
    <h2>计数器 - 应用</h2>
    <div class="content">
      <el-button type="primary" @click="increment">计数: {{ count }}</el-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'CounterApp',
  setup() {
    const count = ref(0)

    const increment = () => {
      count.value++
    }

    onMounted(() => {
      const instanceId = window.$wujie?.props.instanceId
      const appName = window.$wujie?.props.appName
      console.log('Instance:', instanceId, 'App:', appName)
    })

    return {
      count,
      increment
    }
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