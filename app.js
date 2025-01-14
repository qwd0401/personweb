require("dotenv").config();

// 导入必要的模块
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");
const morganBody = require("morgan-body");
const { logger } = require("./config/logger");
const path = require("path");
const fs = require("fs");

// 创建 Express 应用实例
const app = express();

// 配置 CORS
app.use(
  cors({
    origin: [
      "http://localhost:3001", // 前端端口
      "http://localhost:3000", // 后端端口
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// 其他中间件配置
app.use(express.json()); // 解析 JSON 请求体
app.use(morgan("dev")); // 日志记录

// 确保日志目录存在
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// 创建 API 日志写入流
const apiLogStream = fs.createWriteStream(
  path.join(logsDir, "api-requests.log"),
  { flags: "a" }
);

// 配置请求体日志
morganBody(app, {
  noColors: true,
  stream: apiLogStream,
  skip: (req, res) => {
    // 跳过健康检查等路由的日志
    return req.url === "/health";
  },
});

// 连接 MongoDB 数据库
mongoose
  .connect("mongodb://127.0.0.1:27017/personalweb", {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB 连接成功"))
  .catch((err) => console.error("MongoDB 连接失败:", err));

// 导入路由
const projectRoutes = require("./routes/projects");
const blogRoutes = require("./routes/blogs");
const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/admin");
const techArticlesRouter = require("./routes/techArticles");

// 路由配置
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tech-articles", techArticlesRouter);

// 添加预检请求处理
app.options("*", cors());

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
