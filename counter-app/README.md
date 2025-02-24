# Counter App with WebAssembly

## 开发环境设置

### 1. 安装依赖
```bash
npm install
```

### 2. 配置 WebAssembly
WebAssembly 文件需要从 rust-wasm 项目复制：

```bash
# 在 counter-app 目录下执行
sh copy-wasm.sh
```

### 3. 启动开发服务器
```bash
npm run dev
```

或者使用一键启动脚本：
```bash
npm run start
```

## 项目结构
```
counter-app/
├── src/
│   ├── assets/
│   │   └── wasm/        # WebAssembly 文件目录
│   ├── components/
│   │   ├── Counter.vue  # 计数器组件
│   │   └── WasmDemo.vue # WebAssembly 演示组件
│   └── App.vue
├── vite.config.js
└── package.json
```

## 注意事项
1. 确保 rust-wasm 项目已经构建
2. WebAssembly 文件会自动复制到 src/assets/wasm 目录
3. 开发服务器运行在 8081 端口

