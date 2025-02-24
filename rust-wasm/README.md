# Rust WebAssembly 示例

## 1. 初始化项目

```bash
# 创建新的库项目
cargo new --lib rust-wasm
cd rust-wasm
```

## 2. 配置 Cargo.toml

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

## 3. 编写 Rust 代码
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

## 4. 构建 WebAssembly

```bash
wasm-pack build --target web
```

## 5. 测试运行
可以选择以下任一方式运行：

### 使用 Python 服务器
```bash
python -m http.server 8080
```

### 使用 Node.js 服务器
```bash
# 安装依赖
npm install

# 启动服务器
npm start
```

## 项目结构
```
rust-wasm/
├── Cargo.toml          # Rust 项目配置
├── src/
│   └── lib.rs         # Rust 源代码
├── pkg/               # WebAssembly 构建输出
│   ├── rust_wasm_bg.wasm
│   ├── rust_wasm.js
│   └── ...
├── index.html         # 示例页面
├── package.json       # Node.js 配置
└── server.js          # Node.js 服务器
```

## 注意事项
1. 确保已安装 wasm-pack：
```bash
cargo install wasm-pack
```

2. 检查 wasm32 目标是否已安装：
```bash
rustup target list | grep wasm32
# 如果没有，安装：
rustup target add wasm32-unknown-unknown
```

3. 如果遇到网络问题，可以配置 Cargo 镜像源。
编辑 `~/.cargo/config.toml`：
```toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "sparse+https://mirrors.ustc.edu.cn/crates.io-index/"

[http]
check-revoke = false
```
