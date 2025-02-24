<template>
  <div class="home">
    <div class="welcome-section">
      <h1>欢迎使用微应用管理系统</h1>
      <p class="subtitle">一个基于 Vue3 + Wujie 的窗口管理系统</p>
    </div>

    <div class="features">
      <h2>主要特性</h2>
      <div class="feature-list">
        <div class="feature-item">
          <el-icon>
            <Monitor />
          </el-icon>
          <span>多应用管理</span>
        </div>
        <div class="feature-item">
          <el-icon>
            <CopyDocument />
          </el-icon>
          <span>多实例支持</span>
        </div>
        <div class="feature-item">
          <el-icon>
            <Operation />
          </el-icon>
          <span>窗口排列</span>
        </div>
        <div class="feature-item">
          <el-icon>
            <Grid />
          </el-icon>
          <span>灵活布局</span>
        </div>
      </div>
    </div>

    <div class="tech-stack">
      <h2>技术栈</h2>
      <div class="tech-grid">
        <div class="tech-item">
          <el-icon class="tech-icon">
            <Connection />
          </el-icon>
          <h3>Wujie</h3>
          <p>无界微前端框架</p>
        </div>
        <div class="tech-item">
          <el-icon class="tech-icon">
            <Platform />
          </el-icon>
          <h3>Vue 3</h3>
          <p>渐进式 JavaScript 框架</p>
        </div>
        <div class="tech-item">
          <el-icon class="tech-icon">
            <ElementPlus />
          </el-icon>
          <h3>Element Plus</h3>
          <p>Vue 3 组件库</p>
        </div>
        <div class="tech-item">
          <el-icon class="tech-icon">
            <Edit />
          </el-icon>
          <h3>TypeScript</h3>
          <p>类型安全的 JavaScript</p>
        </div>
        <div class="tech-item">
          <div class="tech-icon">
            <img src="@/assets/rust-logo.svg" alt="Rust" class="tech-icon-img">
          </div>
          <h3>Rust WebAssembly</h3>
          <p>高性能计算支持</p>
        </div>
        <div class="tech-item">
          <div class="tech-icon">
            <img src="@/assets/cpp-logo.svg" alt="C++" class="tech-icon-img">
          </div>
          <h3>C++ WebAssembly</h3>
          <p>原生性能计算</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  ElementPlus,
  Monitor,
  CopyDocument,
  Operation,
  Grid,
  Platform,
  Edit,
  Connection
} from '@element-plus/icons-vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    ElementPlus,
    Monitor,
    CopyDocument,
    Operation,
    Grid,
    Platform,
    Edit,
    Connection
  }
});
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 60px;
}

.welcome-section h1 {
  font-size: 36px;
  color: #303133;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 18px;
  color: #606266;
}

.tech-stack {
  margin-bottom: 60px;
}

.tech-stack h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 28px;
  color: #303133;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  padding: 0 20px;
}

.tech-item {
  text-align: center;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.tech-item:hover {
  transform: translateY(-5px);
}

.tech-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 16px;
}

.tech-item img.tech-icon {
  width: 48px;
  height: 48px;
}

.tech-item h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 8px;
}

.tech-item p {
  color: #606266;
  font-size: 14px;
}

.tech-icon-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-bottom: 16px;
}

.features {
  margin-top: 60px;
}

.features h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 28px;
  color: #303133;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

.feature-item .el-icon {
  font-size: 24px;
  color: #409EFF;
}

.feature-item span {
  font-size: 16px;
  color: #303133;
}
</style>
