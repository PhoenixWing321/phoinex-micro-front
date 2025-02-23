@echo off
echo Starting micro-frontend applications...

:: 启动计数器应用
start cmd /k "cd counter-app && npm run serve"

:: 启动对话框应用
start cmd /k "cd dialog-app && npm run serve"

:: 启动主应用
start cmd /k "npm run serve"

echo All applications are starting... 