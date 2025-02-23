@echo off
echo Starting micro-frontend applications...

:: 启动左侧子应用
start cmd /k "cd left-app && npm run serve"

:: 启动右侧子应用
start cmd /k "cd right-app && npm run serve"

:: 启动主应用
start cmd /k "npm run serve"

echo All applications are starting... 