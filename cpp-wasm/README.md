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

## 3. 示例代码

### main.cpp
```cpp
#include <emscripten/bind.h>

using namespace emscripten;

// 加法函数
int add(int a, int b) {
    return a + b;
}

// 斐波那契数列
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 导出函数到 JavaScript
EMSCRIPTEN_BINDINGS(my_module) {
    function("add", &add);
    function("fibonacci", &fibonacci);
}
```

## 4. 编译配置

### CMakeLists.txt
```cmake
cmake_minimum_required(VERSION 3.10)
project(cpp_wasm)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 设置 Emscripten 编译选项
set(CMAKE_EXECUTABLE_SUFFIX ".js")

add_executable(main src/main.cpp)
target_link_options(main PRIVATE
    -s WASM=1
    -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap']
    -s EXPORTED_FUNCTIONS=['_add','_fibonacci']
    --bind
)
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

## 7. 集成到 Vue 项目

1. 复制编译后的文件：
```bash
cp build/main.wasm ../counter-app/src/assets/wasm/
cp build/main.js ../counter-app/src/assets/wasm/
```

2. 在 Vue 组件中使用：
```javascript
import { createModule } from '../assets/wasm/main.js'

const module = await createModule()
const result = module.add(5, 3)
```

## 注意事项

1. 编译环境
   - 确保 Emscripten 环境变量正确设置
   - 使用正确的 CMake 工具链

2. 内存管理
   - 注意 C++ 和 JavaScript 之间的内存交互
   - 适当处理资源释放

3. 调试
   - 使用 Chrome DevTools 的 WebAssembly 调试功能
   - 检查编译警告和错误

## 参考资料

- [Emscripten 文档](https://emscripten.org/docs/getting_started/index.html)
- [WebAssembly C++ 指南](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm)
- [CMake 文档](https://cmake.org/documentation/)
