#!/bin/bash

# 确保在 cpp-wasm 目录下
cd "$(dirname "$0")"

# 创建并进入构建目录
mkdir -p build
cd build

# 配置 CMake
emcmake cmake ..

# 构建项目
emmake make

# 复制文件到测试目录
cp main.wasm ../public/
cp main.js ../public/

echo "构建完成！" 