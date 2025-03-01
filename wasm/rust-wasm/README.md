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

## 4. 构建 WebAssembly

```bash
wasm-pack build --target web
```

## 5. 测试运行

### 使用 Python 服务器
```bash
python -m http.server 8080
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
```
