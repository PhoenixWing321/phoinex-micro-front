<template>
  <div class="excalidraw-sample">
    <h1 ">Excalidraw Example</h1>
    <div style= "height: 500px">
      <Excalidraw />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Excalidraw } from "@excalidraw/excalidraw";


</script>

<style scoped>
.excalidraw-sample {
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: var(--background-color);
  padding: 20px;
  gap: 20px;
}

</style>