# C++ WebAssembly 示例项目

这是一个简单的 C++ 转 WebAssembly 的示例项目，展示了如何使用 Emscripten 将 C++ 代码编译为 WebAssembly，并在网页中调用。

## 项目结构

## 1. 环境准备

### 安装 Emscripten
```bash
# 克隆 emsdk 仓库
git clone https://github.com/emscripten-core/emsdk.git

# 进入 emsdk 目录
cd emsdk

# 安装最新版本
./emsdk install latest

# 激活
./emsdk activate latest

# 设置环境变量
source ./emsdk_env.sh
```

## 2. 项目结构
```
cpp-wasm/
├── src/
│   └── main.cpp        # C++ 源代码
├── public/
│   └── index.html      # 测试页面
├── build/              # 编译输出目录
│   ├── main.wasm       # WebAssembly 二进制文件
│   └── main.js         # 胶水代码
└── CMakeLists.txt      # CMake 配置文件
```

## 5. 构建命令

```bash
# 创建并进入构建目录
mkdir build && cd build

# 配置 CMake
emcmake cmake ..

# 构建项目
emmake make
```

## 6. 测试运行

### 启动测试服务器
```bash
# 使用 Python 启动简单服务器
python -m http.server 8085
```