require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const createAdmin = async () => {
  try {
    console.log("正在连接数据库...");
    // 连接数据库
    await mongoose.connect("mongodb://127.0.0.1:27017/personalweb", {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("数据库连接成功");

    // 创建管理员账号
    const adminData = {
      username: "admin",
      password: "admin123456", // 密码至少6位（根据模型要求）
    };

    // 检查是否已存在管理员账号
    const existingAdmin = await Admin.findOne({ username: adminData.username });
    if (existingAdmin) {
      console.log("管理员账号已存在");
      process.exit(0);
    }

    // 创建新管理员账号
    const admin = await Admin.create(adminData);
    console.log("管理员账号创建成功：", {
      username: admin.username,
      id: admin._id,
    });
    console.log("请记住以下登录信息：");
    console.log("用户名：admin");
    console.log("密码：admin123456");
  } catch (error) {
    console.error("创建管理员账号失败：", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin();
