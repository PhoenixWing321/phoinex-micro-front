# rust-wasm

## 1. 安装rust

由于 WebAssembly 开发需要特定的工具链，强烈建议使用 rustup 安装 Rust：

### 1.1 配置 rustup 镜像源（推荐）
在安装 Rust 之前，可以先配置环境变量来使用镜像源：

```bash
# 设置 RUSTUP 镜像源（中科大镜像）
export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup

# 或者使用清华镜像
# export RUSTUP_DIST_SERVER=https://mirrors.tuna.tsinghua.edu.cn/rustup
# export RUSTUP_UPDATE_ROOT=https://mirrors.tuna.tsinghua.edu.cn/rustup/rustup
```

### 1.2 安装 Rust
```bash
# 1. 如果之前通过 Homebrew 安装了 Rust，先卸载它
brew uninstall rust

# 2. 安装 rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 3. 添加 WebAssembly 目标
rustup target add wasm32-unknown-unknown
```

### 1.3 检查安装
安装完成后，可以通过以下命令检查安装是否成功：

```bash
# 检查 Rust 版本
rustc --version

# 检查 Cargo 版本
cargo --version

# 检查 rustup 版本
rustup --version

# 检查已安装的目标
rustup target list | grep wasm32
```

### 1.4 配置 Cargo 镜像源（可选）
如果在使用 Cargo 时遇到网络问题，可以配置国内镜像源。创建或编辑 `~/.cargo/config.toml` 文件：

```toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "sparse+https://mirrors.ustc.edu.cn/crates.io-index/"

[http]
check-revoke = false
```

## 2. 安装wasm-pack

通过 Cargo 安装 wasm-pack：

```bash
# 配置好镜像源后再运行
cargo install wasm-pack
```

### 检查 wasm-pack 安装
```bash
wasm-pack --version
```

## 3. 创建项目

```bash
wasm-pack new rust-wasm
```

## 4. 运行项目

```bash
wasm-pack build --target web
```

## 5. 创建示例项目

### 5.1 创建新的 Rust 库项目
```bash
# 创建新的 lib 项目
cargo new --lib rust-wasm
cd rust-wasm
```

### 5.2 编辑 Cargo.toml
```toml
[package]
name = "rust-wasm"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

### 5.3 编写 Rust 代码
在 `src/lib.rs` 中实现函数：

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn fibonacci(n: i32) -> i32 {
    if n <= 1 {
        return n;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}
```

### 5.4 构建 WebAssembly
```bash
wasm-pack build --target web
```

### 5.5 创建 HTML 页面
创建 `index.html` 文件：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rust WebAssembly Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .result {
            margin-top: 10px;
            padding: 10px;
            background-color: #f0f0f0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <h1>Rust WebAssembly Demo</h1>
    
    <h2>加法计算</h2>
    <input type="number" id="num1" value="5">
    <input type="number" id="num2" value="3">
    <button onclick="calculateAdd()">计算</button>
    <div id="addResult" class="result"></div>

    <h2>斐波那契数列</h2>
    <input type="number" id="fibNum" value="10">
    <button onclick="calculateFib()">计算</button>
    <div id="fibResult" class="result"></div>

    <script type="module">
        import init, { add, fibonacci } from './pkg/rust_wasm.js';

        window.calculateAdd = async () => {
            await init();
            const num1 = parseInt(document.getElementById('num1').value);
            const num2 = parseInt(document.getElementById('num2').value);
            const result = add(num1, num2);
            document.getElementById('addResult').textContent = `${num1} + ${num2} = ${result}`;
        };

        window.calculateFib = async () => {
            await init();
            const num = parseInt(document.getElementById('fibNum').value);
            const result = fibonacci(num);
            document.getElementById('fibResult').textContent = 
                `斐波那契数列第 ${num} 项为: ${result}`;
        };
    </script>
</body>
</html>
```

### 5.6 启动本地服务器

#### 方式一：使用 Python 简单服务器
```bash
# Python 3
python -m http.server 8080
```

#### 方式二：使用 Node.js（推荐）
首先创建 `package.json` 文件：

```bash
npm init -y
```

安装依赖：
```bash
npm install express
```

创建 `server.js` 文件：
```bash
# 创建服务器文件
touch server.js
```

### 5.7 启动 Node.js 服务器
安装依赖并启动服务器：

```bash
# 安装依赖
npm install

# 启动服务器
npm start
```

然后在浏览器中访问 `http://localhost:3000` 即可看到示例页面。

如果你想要开发模式（自动重启），可以安装 nodemon：
```bash
# 安装 nodemon（可选）
npm install nodemon --save-dev

# 使用开发模式启动
npm run dev
```

## 项目结构
```
rust-wasm/
├── Cargo.toml
├── src/
│   └── lib.rs
├── pkg/              # wasm-pack 构建后生成
│   ├── rust_wasm_bg.wasm
│   ├── rust_wasm.js
│   └── ...
├── index.html
├── package.json
└── server.js
```
