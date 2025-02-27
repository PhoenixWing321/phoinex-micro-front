#!/bin/bash
echo "Starting micro-frontend applications..."

# 启动主应用
npm run dev &

# 启动 counter-app
cd counter-app && npm run dev &

# 启动 cpp-wasm 服务
cd ../cpp-wasm && python3 -m http.server 8085 &

# 启动 rust-wasm 服务
cd ../rust-wasm && python3 -m http.server 8086 &

# 等待所有后台进程
wait

echo "All applications are starting..." 