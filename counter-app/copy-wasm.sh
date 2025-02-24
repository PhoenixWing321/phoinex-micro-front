#!/bin/bash

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
RUST_WASM_DIR="$(cd "${SCRIPT_DIR}/../rust-wasm" && pwd)"

echo "当前目录: $(pwd)"
echo "脚本目录: ${SCRIPT_DIR}"
echo "Rust WASM 目录: ${RUST_WASM_DIR}"

# 检查源文件是否存在
if [ ! -f "${RUST_WASM_DIR}/pkg/rust_wasm_bg.wasm" ] || [ ! -f "${RUST_WASM_DIR}/pkg/rust_wasm.js" ]; then
    echo "WebAssembly 文件不存在，正在构建..."
    cd "${RUST_WASM_DIR}"
    wasm-pack build --target web
    cd "${SCRIPT_DIR}"
fi

# 确保目标目录存在
mkdir -p "${SCRIPT_DIR}/src/assets/wasm"

# 复制文件
cp "${RUST_WASM_DIR}/pkg/rust_wasm_bg.wasm" "${SCRIPT_DIR}/src/assets/wasm/"
cp "${RUST_WASM_DIR}/pkg/rust_wasm.js" "${SCRIPT_DIR}/src/assets/wasm/"

echo "WebAssembly 文件复制完成" 