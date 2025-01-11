const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// 获取所有项目
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 获取单个项目
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: '未找到该项目' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 