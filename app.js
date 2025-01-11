require('dotenv').config();

// 导入必要的模块
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// 创建 Express 应用实例
const app = express();

// 配置 CORS
app.use(cors({
    origin: ['http://localhost:3000', 'https://xnwdwpypqvgr.sealoshzh.site'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// 其他中间件配置
app.use(express.json());        // 解析 JSON 请求体
app.use(morgan('dev'));         // 日志记录

// 连接 MongoDB 数据库
mongoose.connect('mongodb://root:nvtqlxlq@personalweb-mongodb.ns-itw5blp2.svc:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 连接成功'))
.catch((err) => console.error('MongoDB 连接失败:', err));

// 导入路由
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blogs');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// 路由配置
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// 添加预检请求处理
app.options('*', cors());

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 