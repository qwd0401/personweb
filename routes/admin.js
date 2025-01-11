const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// 验证token的接口
router.get('/verify-token', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Token有效',
            admin: {
                username: req.admin.username,
                id: req.admin._id
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: '无效的Token'
        });
    }
});

// 管理员登录
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username }).select('+password');
        
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({
            success: true,
            token
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 更新项目信息
router.put('/projects/:id', auth, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: '项目不存在'
            });
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 添加新项目
router.post('/projects', auth, async (req, res) => {
    try {
        console.log('收到的项目数据:', req.body);
        
        const { title, description, technologies, outcome } = req.body;
        
        console.log('数据验证:', {
            title: { value: title, type: typeof title },
            description: { value: description, type: typeof description },
            technologies: { value: technologies, type: typeof technologies, isArray: Array.isArray(technologies) },
            outcome: { value: outcome, type: typeof outcome }
        });

        if (!title || !description || !technologies || !outcome) {
            const errors = {
                title: !title ? '项目标题是必需的' : null,
                description: !description ? '项目描述是必需的' : null,
                technologies: !technologies ? '技术栈是必需的' : null,
                outcome: !outcome ? '项目成果是必需的' : null
            };
            console.log('验证失败:', errors);
            return res.status(400).json({
                success: false,
                message: '数据验证失败',
                errors
            });
        }

        if (!Array.isArray(technologies)) {
            console.log('技术栈格式错误:', technologies);
            return res.status(400).json({
                success: false,
                message: '技术栈必须是数组格式'
            });
        }

        const project = await Project.create({
            title,
            description,
            technologies,
            outcome
        });

        console.log('项目创建成功:', project);
        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('创建项目错误:', {
            message: error.message,
            stack: error.stack,
            errors: error.errors
        });
        res.status(400).json({
            success: false,
            message: error.message,
            details: error.errors
        });
    }
});

// 删除项目
router.delete('/projects/:id', auth, async (req, res) => {
    try {
        console.log('尝试删除项目，ID:', req.params.id);

        if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: '无效的项目ID格式'
            });
        }

        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: '项目不存在'
            });
        }

        await project.deleteOne();

        console.log('项目删除成功:', req.params.id);
        res.json({
            success: true,
            message: '项目已删除'
        });
    } catch (error) {
        console.error('删除项目错误:', {
            id: req.params.id,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: error.message || '删除项目时发生错误'
        });
    }
});

// 博客文章的 CRUD 操作
router.post('/blogs', auth, async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/blogs/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: '博客文章不存在'
            });
        }

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.delete('/blogs/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: '博客文章不存在'
            });
        }

        res.json({
            success: true,
            message: '博客文章已删除'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 获取所有消息
router.get('/messages', auth, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 删除消息
router.delete('/messages/:id', auth, async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: '消息不存在'
            });
        }

        res.json({
            success: true,
            message: '消息已删除'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 