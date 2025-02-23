#!/bin/bash
echo "Starting micro-frontend applications..."

# 启动左侧子应用
cd left-app && npm run serve &

# 启动右侧子应用
cd ../right-app && npm run serve &

# 启动主应用
cd .. && npm run serve &

echo "All applications are starting..." 