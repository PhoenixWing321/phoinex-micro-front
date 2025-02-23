<template>
  <div class="home">
    <div class="welcome-content">
      <img src="@/assets/logo.png" class="welcome-logo" />
      <h1>欢迎使用微前端示例</h1>
      <p>请从左侧菜单选择要打开的应用</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeView"
});
</script>

<style scoped>
.home {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
}

.welcome-content {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.welcome-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
}

h1 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 16px;
}

p {
  font-size: 16px;
  color: #606266;
  margin: 0;
}
</style>
