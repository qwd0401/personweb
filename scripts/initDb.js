const mongoose = require('mongoose');
const Project = require('../models/Project');
const Blog = require('../models/Blog');

// 连接数据库
mongoose.connect('mongodb://root:nvtqlxlq@personalweb-mongodb.ns-itw5blp2.svc:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// 示例项目数据
const projectsData = [
    {
        title: "电商平台开发",
        description: "负责整体产品规划和需求分析，协调开发团队完成项目。",
        technologies: ["React", "Node.js", "MongoDB"],
        outcome: "项目成功上线，用户增长30%。"
    },
    {
        title: "企业内部管理系统",
        description: "主导需求调研和原型设计，推动项目按时交付。",
        technologies: ["Vue.js", "Express", "MySQL"],
        outcome: "系统上线后，内部效率提升20%。"
    }
];

// 示例博客数据
const blogsData = [
    {
        title: "如何高效管理产品需求",
        content: "本文将分享我在产品需求管理中的一些经验和技巧...",
        date: new Date("2023-10-01"),
        tags: ["产品管理", "需求分析"]
    },
    {
        title: "敏捷开发实践指南",
        content: "敏捷开发是一种高效的开发模式，本文将介绍如何落地...",
        date: new Date("2023-09-15"),
        tags: ["敏捷开发", "项目管理"]
    }
];

// 初始化数据
async function initDb() {
    try {
        // 清空现有数据
        await Project.deleteMany({});
        await Blog.deleteMany({});

        // 插入新数据
        await Project.insertMany(projectsData);
        await Blog.insertMany(blogsData);

        console.log('数据库初始化成功！');
        process.exit(0);
    } catch (error) {
        console.error('数据库初始化失败:', error);
        process.exit(1);
    }
}

initDb(); 