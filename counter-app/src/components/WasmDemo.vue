<template>
  <div class="wasm-demo">
    <h2>Rust WebAssembly 演示</h2>

    <div class="calc-section">
      <h3>加法计算</h3>
      <div class="input-group">
        <input type="number" v-model="num1">
        <input type="number" v-model="num2">
        <button @click="calculateAdd">计算</button>
      </div>
      <div class="result">{{ addResult }}</div>
    </div>

    <div class="calc-section">
      <h3>斐波那契数列</h3>
      <div class="input-group">
        <input type="number" v-model="fibNum">
        <button @click="calculateFib">计算</button>
      </div>
      <div class="result">{{ fibResult }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import init, { add, fibonacci } from '../assets/wasm/rust_wasm.js'

export default {
  name: 'WasmDemoComponent',
  setup() {
    const num1 = ref(5)
    const num2 = ref(3)
    const fibNum = ref(10)
    const addResult = ref('')
    const fibResult = ref('')

    // 初始化 WebAssembly 模块
    async function initWasm() {
      try {
        await init()
        console.log('WebAssembly module initialized')
      } catch (error) {
        console.error('Failed to initialize WebAssembly module:', error)
      }
    }

    // 加法计算函数
    const calculateAdd = () => {
      const result = add(parseInt(num1.value), parseInt(num2.value))
      addResult.value = `${num1.value} + ${num2.value} = ${result}`
    }

    // 斐波那契计算函数
    const calculateFib = () => {
      const result = fibonacci(parseInt(fibNum.value))
      fibResult.value = `斐波那契数列第 ${fibNum.value} 项为: ${result}`
    }

    // 组件挂载时初始化 WebAssembly
    onMounted(() => {
      initWasm()
    })

    return {
      num1,
      num2,
      fibNum,
      addResult,
      fibResult,
      calculateAdd,
      calculateFib
    }
  }
}
</script>

<style scoped>
.wasm-demo {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.calc-section {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

input[type="number"] {
  width: 120px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #66b1ff;
}

.result {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

h2 {
  margin-bottom: 20px;
  color: #303133;
}

h3 {
  color: #606266;
  margin-bottom: 15px;
}
</style>