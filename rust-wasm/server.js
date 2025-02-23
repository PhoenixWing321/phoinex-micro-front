const express = require('express');
const path = require('path');
const app = express();

// 设置静态文件目录
app.use(express.static('./'));

// 设置正确的 MIME 类型
app.get('*.wasm', function(req, res, next) {
    res.type('application/wasm');
    next();
});

// 主路由
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 