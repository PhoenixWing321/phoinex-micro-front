#!/bin/bash
echo "Starting micro-frontend applications..."

# 启动计数器应用
cd counter-app && npm run serve &

# 启动对话框应用
cd ../dialog-app && npm run serve &

# 启动主应用
cd .. && npm run serve &

echo "All applications are starting..." 