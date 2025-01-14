const winston = require("winston");
const path = require("path");

// 定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// 创建 Winston logger 实例
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    // 错误日志
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // API 请求日志
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/api.log"),
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    // 数据库操作日志
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/db.log"),
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// 在开发环境下同时输出到控制台
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// 数据库操作日志中间件
const dbLogger = (operation, collection, query = {}, result = null) => {
  logger.info({
    type: "db",
    operation,
    collection,
    query,
    result: result ? "success" : "failed",
    timestamp: new Date(),
  });
};

module.exports = { logger, dbLogger };
