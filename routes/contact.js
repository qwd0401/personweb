const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// 处理联系表单提交
router.post('/', async (req, res) => {
    try {
        const message = new Message({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });

        const newMessage = await message.save();
        res.status(201).json({
            success: true,
            message: '您的消息已成功发送！'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router; 