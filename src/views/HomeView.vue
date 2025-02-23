<template>
  <div class="container">
    <!-- 计数器应用 -->
    <div class="left-panel">
      <WujieVue
        width="100%"
        height="100%"
        name="counter-app"
        url="http://localhost:8081"
        :sync="true"
      />
    </div>
    
    <!-- 对话框应用 -->
    <div class="right-panel">
      <WujieVue
        width="100%"
        height="100%"
        name="dialog-app"
        url="http://localhost:8082"
        :sync="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WujieVue from "wujie-vue3";

export default defineComponent({
  name: "HomeView",
  components: {
    WujieVue,
  },
});
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
