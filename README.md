# 微前端示例项目

## 项目简介
这是一个基于 Vue3 + TypeScript + Wujie 的微前端示例项目。项目实现了一个类似操作系统的窗口管理系统，可以同时运行多个独立的微应用，并支持 WebAssembly 计算能力。

## 技术栈
- Vue 3
- TypeScript
- Element Plus
- Wujie 微前端框架
- WebAssembly (Rust + C++)
- Jest (单元测试)


## 开发环境设置

### 安装依赖
```bash
npm init vite@latest

```

### 启动开发环境
```bash
npm install
npm run dev
```

### 运行测试
```bash
# 运行所有测试
npm test

# 监视模式运行测试
npm run test:watch
```

### 构建项目
```bash
# 构建主应用
npm run build

# 构建子应用
cd counter-app && npm run build
```

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





## 许可证
MIT

