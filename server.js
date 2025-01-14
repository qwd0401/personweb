const app = require("./app");
const chalk = require("chalk");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log(chalk.cyan("🚀 服务器状态"));
  console.log("=".repeat(50));

  console.log(chalk.green(`✓ 服务器成功启动于端口: ${chalk.yellow(PORT)}`));
  console.log(
    chalk.green(`✓ 本地访问: ${chalk.yellow(`http://localhost:${PORT}`)}`)
  );
  console.log(
    chalk.green(`✓ 网络访问: ${chalk.yellow(`http://${getLocalIP()}:${PORT}`)}`)
  );

  console.log(chalk.cyan("\n📝 API 路由"));
  console.log("=".repeat(50));
  console.log(chalk.green(`✓ 项目接口: ${chalk.yellow("/api/projects")}`));
  console.log(chalk.green(`✓ 博客接口: ${chalk.yellow("/api/blogs")}`));
  console.log(chalk.green(`✓ 技术文章: ${chalk.yellow("/api/tech-articles")}`));
  console.log(chalk.green(`✓ 联系接口: ${chalk.yellow("/api/contact")}`));
  console.log(chalk.green(`✓ 管理接口: ${chalk.yellow("/api/admin")}`));

  console.log(chalk.cyan("\n💾 数据库状态"));
  console.log("=".repeat(50));
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: chalk.red("未连接"),
    1: chalk.green("已连接"),
    2: chalk.yellow("正在连接"),
    3: chalk.red("断开连接"),
  };
  console.log(chalk.green(`✓ MongoDB状态: ${dbStatusText[dbStatus]}`));
  console.log(
    chalk.green(
      `✓ 数据库地址: ${chalk.yellow(
        process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/personalweb"
      )}`
    )
  );

  console.log("\n" + "=".repeat(50) + "\n");
});

function getLocalIP() {
  const { networkInterfaces } = require("os");
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

process.on("unhandledRejection", (err) => {
  console.error(chalk.red("未处理的Promise拒绝:"), err);
});

process.on("uncaughtException", (err) => {
  console.error(chalk.red("未捕获的异常:"), err);
  process.exit(1);
});
