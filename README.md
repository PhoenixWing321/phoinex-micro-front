# Phoenix 微前端框架

基于 Vite + Vue3 + TypeScript + Wujie 的微前端框架。

## 特性

- 🚀 使用 Vite 构建，开发体验极佳
- 🔥 基于 Vue 3 和 TypeScript，类型安全
- 📦 使用 Pinia 进行状态管理
- 🔄 基于 Wujie 的微前端架构
- 🌓 支持亮色/暗色主题切换
- 💾 状态持久化

### 抽屉
抽屉功能，独立
既能显示应用，又能显示about。

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

## 应用打开方式

Phoenix微前端框架支持多种应用打开方式，可以根据不同应用的需求选择最合适的打开方式：

### 1. 抽屉模式（Drawer）

- **特点**：在右侧抽屉中打开应用，不离开当前页面
- **适用场景**：需要同时查看主应用和微应用内容时
- **实现方式**：使用无界微前端（Wujie）在抽屉容器中渲染应用
- **配置方式**：在添加应用时选择"抽屉中打开"或设置`openMode: "drawer"`

### 2. 新窗口模式（Blank）

- **特点**：在新浏览器标签页中打开应用
- **适用场景**：独立运行的应用，或需要全屏查看的应用
- **实现方式**：使用`window.open(url, '_blank')`在新标签页打开
- **配置方式**：在添加应用时选择"新窗口打开"或设置`openMode: "blank"`

### 3. MDI模式（Multiple Document Interface）

- **特点**：在应用内部的MDI管理器中打开多个应用
- **适用场景**：需要在同一界面管理多个应用窗口时
- **实现方式**：通过MDI管理器API在内部窗口中打开应用
- **配置方式**：在添加应用时选择"MDI管理器中打开"或设置`openMode: "mdi"`

### 配置示例

在`config.json`中配置默认应用的打开方式：

```json
{
  "defaultApps": [
    {
      "name": "百度",
      "entry": "https://www.baidu.com",
      "container": "baidu-container",
      "openMode": "drawer"
    },
    {
      "name": "CSDN",
      "entry": "https://www.csdn.net",
      "container": "csdn-container",
      "openMode": "blank"
    },
    {
      "name": "Gitee",
      "entry": "https://gitee.com",
      "container": "gitee-container",
      "openMode": "mdi"
    }
  ]
}
```

### 动态切换打开方式

用户可以在应用管理界面中为每个应用选择不同的打开方式，系统会记住这些设置并在下次打开时应用。

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