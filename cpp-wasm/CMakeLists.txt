cmake_minimum_required(VERSION 3.10)
project(WasmDemo)

set(CMAKE_CXX_STANDARD 17)

# 设置 Emscripten 编译选项
set(CMAKE_EXECUTABLE_SUFFIX ".js")

# 添加可执行文件
add_executable(main src/main.cpp)

# 设置链接选项
target_link_options(main PRIVATE
    "SHELL:-s WASM=1"
    "SHELL:--bind"
)

# 设置包含目录
target_include_directories(main PRIVATE
    ${CMAKE_SOURCE_DIR}/include
    $ENV{EMSDK}/upstream/emscripten/system/include
)

# 设置输出文件名
set_target_properties(main PROPERTIES OUTPUT_NAME "main") 