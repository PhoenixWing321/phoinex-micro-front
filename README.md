# Phoenix 微前端框架

基于 Vite + Vue3 + TypeScript + Wujie 的微前端框架。

## 特性

- 🚀 使用 Vite 构建，开发体验极佳
- 🔥 基于 Vue 3 和 TypeScript，类型安全
- 📦 使用 Pinia 进行状态管理
- 🔄 基于 Wujie 的微前端架构
- 🌓 支持亮色/暗色主题切换
- 💾 状态持久化

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── App.vue                # 主应用组件
├── components/            # 公共组件
├── main.ts                # 入口文件
├── router/                # 路由配置
├── store/                 # 状态管理
├── style.css              # 全局样式
├── types/                 # 类型定义
└── views/                 # 页面视图
```

## 微应用接入

1. 在首页点击"添加应用"
2. 填写应用名称、入口地址和容器ID
3. 点击添加即可将微应用接入框架

## 技术栈

- Vite
- Vue 3
- TypeScript
- Pinia
- Vue Router
- Wujie

## 开发指南

### 命名规范

#### 1. 文件命名
- **源代码文件**：
  - 使用小写字母
  - 多词使用连字符（kebab-case）
  - 例如：`tree.ts`, `tree-node.ts`, `app-container.vue`

- **配置文件**：
  - 使用小写，可包含点号
  - 例如：`jest.config.js`, `tsconfig.json`

- **脚本文件**：
  - 使用小写，可包含连字符
  - 例如：`test-report.sh`, `start.sh`

#### 2. 类型命名
- **类/接口**：
  - 使用大驼峰命名法（PascalCase）
  - 例如：`TreeNode`, `FileSystem`, `AppContainer`

- **类型别名**：
  - 使用大驼峰命名法
  - 例如：`TreeNodeCallback`, `FileData`

#### 3. 变量/方法命名
- **变量**：
  - 使用小驼峰命名法（camelCase）
  - 例如：`nodeMap`, `currentNode`

- **方法**：
  - 使用小驼峰命名法
  - 不推荐使用 add-node 这样的连字符命名方式
  - 动词开头
  - 例如：`createNode()`, `deleteNode()`, `updateNode()`
  - 动词选择推荐：
    - 创建：`create`
    - 删除：`delete`
    - 更新：`update`
    - 获取：`get`
    - 设置：`set`
    - 初始化：`initialize`
    - 验证：`validate`
    - 转换：`convert`
    - 计算：`calculate`
    - 查找：`find`

#### 4. 常量命名
- 全大写，下划线分隔
- 例如：`MAX_DEPTH`, `DEFAULT_CONFIG`

#### 5. 组件命名
- **Vue 组件**：
  - 使用大驼峰命名法
  - 多个单词组成
  - 例如：`AppContainer.vue`, `TreeView.vue`

### WebAssembly 模块开发
1. C++ 模块：
   ```bash
   cd cpp-wasm
   emcmake cmake ..
   emmake make
   ```

2. Rust 模块：
   ```bash
   cd rust-wasm
   wasm-pack build
   ```