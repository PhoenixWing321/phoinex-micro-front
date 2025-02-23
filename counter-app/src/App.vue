<template>
  <div class="left-app">
    <h2>计数器 - 应用</h2>
    <div class="content">
      <el-button type="primary" @click="count++">计数: {{ count }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
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