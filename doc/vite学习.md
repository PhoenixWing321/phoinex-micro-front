# Vite学习笔记

## 关于index.html位置的说明

在Vite项目中，`index.html`文件通常位于项目根目录下，而不是在`public/`目录中。这与其他一些构建工具（如webpack + vue-cli）的默认配置不同。

### Vite的设计理念

Vite将`index.html`放在根目录的原因：

1. **入口点概念**：在Vite中，`index.html`被视为应用的入口点，而不仅仅是静态资源。Vite使用HTML文件作为入口，从中解析出导入的JavaScript。

2. **开发服务器根目录**：Vite的开发服务器将项目根目录作为基础路径，直接提供`index.html`。

3. **构建过程集成**：在构建过程中，`index.html`会被处理，其中的资源引用会被自动转换和优化。

### public/目录的用途

在Vite项目中，`public/`目录仍然存在，但其用途是：

- 存放不需要通过构建工具处理的静态资源
- 这些资源会被原封不动地复制到构建输出目录