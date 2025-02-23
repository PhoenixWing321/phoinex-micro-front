#!/bin/bash
echo "Stopping micro-frontend applications..."

# 查找并终止 8081 端口的进程
lsof -ti:8081 | xargs kill -9

# 查找并终止 8082 端口的进程
lsof -ti:8082 | xargs kill -9

# 查找并终止 8080 端口的进程（主应用）
lsof -ti:8080 | xargs kill -9

echo "All applications have been stopped." 