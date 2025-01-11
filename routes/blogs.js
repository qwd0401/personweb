const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// 获取所有博客文章
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 }); // 按日期降序排序
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 获取单个博客文章
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: '未找到该博客文章' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 