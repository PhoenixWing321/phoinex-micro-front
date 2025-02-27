#!/bin/bash

# 运行测试
jest --config jest.config.js

# 等待报告生成
while [ ! -f "./test-report/index.html" ]; do
  sleep 0.1
done

# 打开报告
open test-report/index.html 