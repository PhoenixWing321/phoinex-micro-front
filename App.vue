<template>
  <div class="container">
    <!-- 左侧子应用 -->
    <div class="left-panel">
      <WujieVue
        width="100%"
        height="100%"
        name="left-app"
        url="http://localhost:8081"
        :sync="true"
      />
    </div>
    
    <!-- 右侧子应用 -->
    <div class="right-panel">
      <WujieVue
        width="100%"
        height="100%"
        name="right-app"
        url="http://localhost:8082"
        :sync="true"
      />
    </div>
  </div>
</template>

<script>
import WujieVue from "wujie-vue3";

export default {
  components: {
    WujieVue
  }
}
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.left-panel {
  width: 50%;
  border-right: 1px solid #ddd;
}

.right-panel {
  width: 50%;
}
</style> 