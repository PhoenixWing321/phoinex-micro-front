<template>
  <div class="right-app">
    <h2>右侧应用</h2>
    <div class="content">
      <el-input v-model="message" placeholder="请输入内容"></el-input>
      <div class="message">{{ message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  }
}
</script>

<style scoped>
.right-app {
  padding: 20px;
}
.content {
  margin-top: 20px;
}
.message {
  margin-top: 10px;
}
</style> 