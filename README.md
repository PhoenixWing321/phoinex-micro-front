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

## 功能特性

### 1. 应用管理
- **多实例支持**：
  - 同一应用可以开启多个实例
  - 实例自动编号（如：应用.1、应用.2）
  - 实例间状态完全独立
- **应用标识**：
  - 统一的应用图标
  - 清晰的实例编号
  - 一致的命名规则

### 2. 窗口管理
- **窗口操作**：
  - 拖拽移动（通过标题栏）
  - 八个方向调整大小
  - 最大化/最小化/关闭
  - 点击窗口自动提升到最前
- **窗口排列**：
  - 级联排列：窗口按层叠方式排列，自动计算偏移
  - 平铺排列：自动计算最佳布局

### 3. WebAssembly 支持
- **Rust WebAssembly**：
  - 高性能计算支持
  - 斐波那契数列计算
  - 基础数学运算
- **C++ WebAssembly**：
  - 原生性能计算
  - 复杂数学运算
  - 性能对比示例

### 4. 数据结构支持
- **树形结构**：
  - 通用树节点接口
  - 完整的树操作 API
  - 文件系统示例实现

## 项目结构
```
.
├── src/
│   ├── components/     # 通用组件
│   ├── types/         # TypeScript 类型定义
│   ├── views/         # 页面视图
│   └── assets/        # 静态资源
├── test/              # 单元测试
├── counter-app/       # 计数器子应用
├── cpp-wasm/         # C++ WebAssembly 模块
├── rust-wasm/        # Rust WebAssembly 模块
└── public/           # 公共资源
```

## 开发环境设置

### 安装依赖
```bash
# 安装主项目依赖
npm install

# 安装子应用依赖
cd counter-app && npm install
```

### 启动开发环境
```bash
# 启动所有服务
npm run start

# 或分别启动：
npm run dev              # 主应用 (端口 5173)
cd counter-app && npm run dev  # 子应用 (端口 5174)
cd cpp-wasm && python3 -m http.server 8085   # C++ WASM 服务
cd rust-wasm && python3 -m http.server 8086  # Rust WASM 服务
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

### 添加新的子应用
1. 创建新的 Vue 项目
2. 配置 Vite
3. 在主应用中注册

## 待实现功能
- 应用间通信机制
- 窗口位置和状态持久化
- 快捷键支持
- 更多窗口排列方式
- WebAssembly 性能优化
- 更多数据结构示例

## 贡献指南
1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证
MIT

