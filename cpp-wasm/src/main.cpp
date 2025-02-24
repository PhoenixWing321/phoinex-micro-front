#include <emscripten/bind.h>

using namespace emscripten;

// 加法函数
int add(int a, int b) {
    return a + b;
}

// 斐波那契数列
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 导出函数到 JavaScript
EMSCRIPTEN_BINDINGS(my_module) {
    function("add", &add);
    function("fibonacci", &fibonacci);
} 