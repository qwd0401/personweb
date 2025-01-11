const mongoose = require('mongoose');

// 定义联系消息模型的架构
const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '姓名是必需的'],
        trim: true
    },
    email: {
        type: String,
        required: [true, '邮箱是必需的'],
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '请提供有效的邮箱地址']
    },
    message: {
        type: String,
        required: [true, '消息内容是必需的']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema); 